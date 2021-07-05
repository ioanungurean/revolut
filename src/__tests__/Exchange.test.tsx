import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import currency from "currency.js";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FakeTimers from "@sinonjs/fake-timers";
import fetchMock from "fetch-mock-jest";

import { initialState } from "../store";

import { ECurrency, IAccount } from "../typings";

import Exchange from "../modules/Exchange";

const fetchOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-host": "currency-exchange.p.rapidapi.com",
    "x-rapidapi-key": "075300c478msh0e398192b31d907p1ca169jsn375580d6aab4",
  },
};

const getFetchUrl = (from: ECurrency, to: ECurrency) =>
  `https://currency-exchange.p.rapidapi.com/exchange?from=${from}&to=${to}&q=1.0`;

describe("Exchange", () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("renders a thing", () => {
    const queryClient = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Exchange />
      </QueryClientProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("should change the header text when user selects a new currency", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Exchange />
      </QueryClientProvider>
    );
    expect(screen.getByText("Sell USD")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("select-currency-from"));
    userEvent.click(screen.getByTestId("EUR"));

    expect(screen.getByText("Sell EUR")).toBeInTheDocument();
  });

  it("should change the subheader when the user selects a new currency", async () => {
    const fixture1 = "1.2";
    const fixture2 = "1.3";

    fetchMock.mock(getFetchUrl(ECurrency.Usd, ECurrency.Eur), fixture1);

    fetchMock.mock(getFetchUrl(ECurrency.Gbp, ECurrency.Eur), fixture2);

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Exchange />
      </QueryClientProvider>
    );

    expect(fetchMock).toHaveBeenCalledWith(
      getFetchUrl(ECurrency.Usd, ECurrency.Eur),
      fetchOptions
    );

    await waitFor(() => {
      expect(
        screen.getByText(`Market order • 1 USD = ${fixture1} EUR`)
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId("select-currency-from"));
    userEvent.click(screen.getByTestId("GBP"));

    expect(fetchMock).toHaveBeenCalledWith(
      getFetchUrl(ECurrency.Gbp, ECurrency.Eur),
      fetchOptions
    );

    await waitFor(() => {
      expect(
        screen.getByText(`Market order • 1 GBP = ${fixture2} EUR`)
      ).toBeInTheDocument();
    });
  });

  it("should fetch a new rate every 10 seconds and update the subheader", async () => {
    const clock = FakeTimers.install();
    /**
     * Not possible to use Jest's Fake Timers with promises:
     * https://stackoverflow.com/questions/51126786/jest-fake-timers-with-promises/51132058#51132058
     *
     * Using Sinon's Fake Timers instead
     */
    //

    const fixture = "1.0";
    fetchMock.mock(getFetchUrl(ECurrency.Usd, ECurrency.Eur), fixture);

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Exchange />
      </QueryClientProvider>
    );

    expect(fetchMock.mock.calls.length).toEqual(1);
    await clock.tickAsync(10000);
    expect(fetchMock.mock.calls.length).toEqual(2);
    await clock.tickAsync(10000);
    expect(fetchMock.mock.calls.length).toEqual(3);

    clock.uninstall();
  });

  it("should have selected by default USD to EUR", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Exchange />
      </QueryClientProvider>
    );

    const selectFrom = screen.getByTestId("select-currency-from");
    const selectTo = screen.getByTestId("select-currency-to");

    expect(within(selectFrom).getByText("USD")).toBeInTheDocument();
    expect(within(selectTo).getByText("EUR")).toBeInTheDocument();
  });

  it("shoud have the inputs empty by default", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Exchange />
      </QueryClientProvider>
    );

    const inputFrom = screen.getByTestId("input-amount-from");
    const inputTo = screen.getByTestId("input-amount-to");

    expect(inputFrom).toHaveValue("");
    expect(inputTo).toHaveValue("");
  });

  it("should have the correct balances for each currency account", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Exchange />
      </QueryClientProvider>
    );

    expect(
      within(screen.getByTestId("select-currency-from")).getByText("USD")
    ).toBeInTheDocument();

    const usdAccount = initialState.accounts.find(
      ({ id }) => id === ECurrency.Usd
    ) as IAccount;

    const eurAccount = initialState.accounts.find(
      ({ id }) => id === ECurrency.Eur
    ) as IAccount;

    expect(screen.getByTestId("account-balance-from").textContent).toEqual(
      `Balance: ${usdAccount.balance} ${usdAccount.id}`
    );

    expect(screen.getByTestId("account-balance-to").textContent).toEqual(
      `Balance: ${eurAccount.balance} ${eurAccount.id}`
    );
  });

  it("should accept only numbers in input with a maximum of 2 decimals", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Exchange />
      </QueryClientProvider>
    );

    const inputFrom = screen.getByTestId("input-amount-from");

    userEvent.type(inputFrom, "0.000");
    expect(inputFrom).toHaveValue("0.00");
    userEvent.clear(inputFrom);

    userEvent.type(inputFrom, "999999999.99");
    expect(inputFrom).toHaveValue("999999999.99");
    userEvent.clear(inputFrom);

    userEvent.type(inputFrom, "9999999999.99");
    expect(inputFrom).toHaveValue("999999999.99");
    userEvent.clear(inputFrom);

    userEvent.type(inputFrom, "123.12");
    expect(inputFrom).toHaveValue("123.12");
    userEvent.clear(inputFrom);

    userEvent.type(inputFrom, "45.137");
    expect(inputFrom).toHaveValue("45.13");
    userEvent.clear(inputFrom);

    userEvent.type(inputFrom, "0.1");
    expect(inputFrom).toHaveValue("0.1");
    userEvent.clear(inputFrom);

    userEvent.type(inputFrom, "0.123");
    expect(inputFrom).toHaveValue("0.12");
    userEvent.clear(inputFrom);

    userEvent.type(inputFrom, "+-e1");
    expect(inputFrom).toHaveValue("1");
    userEvent.clear(inputFrom);
  });

  it("should automatically fill to the second input when user types in the first input", () => {
    const fixture = "1.2";
    fetchMock.mock(getFetchUrl(ECurrency.Usd, ECurrency.Eur), fixture);

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Exchange />
      </QueryClientProvider>
    );

    const inputFrom = screen.getByTestId("input-amount-from");
    const inputTo = screen.getByTestId("input-amount-to");

    userEvent.type(inputFrom, "123.12");

    waitFor(() => {
      expect(inputTo).toHaveValue("147.74"); // 123.12 * 1.2
    });
  });

  it("should update the Sell button label with the selected currency acronyms", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Exchange />
      </QueryClientProvider>
    );

    expect(screen.getByTestId("sell-button")).toHaveTextContent(
      "Sell USD to EUR"
    );

    userEvent.click(screen.getByTestId("select-currency-from"));
    userEvent.click(screen.getByTestId("GBP"));

    userEvent.click(screen.getByTestId("select-currency-to"));
    userEvent.click(screen.getByTestId("USD"));

    expect(screen.getByTestId("sell-button")).toHaveTextContent(
      "Sell GBP to USD"
    );
  });

  it("should have the Sell button disabled by default when the first input does not have a value or the value is 0", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Exchange />
      </QueryClientProvider>
    );

    const inputFrom = screen.getByTestId("input-amount-from");

    expect(screen.getByTestId("sell-button")).toBeDisabled();

    userEvent.type(inputFrom, "0.");
    expect(screen.getByTestId("sell-button")).toBeDisabled();

    userEvent.type(inputFrom, "1");
    waitFor(() => {
      expect(screen.getByTestId("sell-button")).toBeEnabled();
    });
  });

  it("should have the Sell button disabled when trying to exchange the same currency", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Exchange />
      </QueryClientProvider>
    );

    const inputFrom = screen.getByTestId("input-amount-from");

    userEvent.type(inputFrom, "100");

    waitFor(() => {
      expect(screen.getByTestId("sell-button")).toBeEnabled();
    });

    userEvent.click(screen.getByTestId("select-currency-to"));
    userEvent.click(screen.getByTestId("USD"));

    expect(screen.getByTestId("sell-button")).toHaveTextContent(
      "Sell USD to USD"
    );

    expect(screen.getByTestId("sell-button")).toBeDisabled();
  });

  it("should disable the Sell button if the value in the first input exceeds the value in the balance for that currrency account", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Exchange />
      </QueryClientProvider>
    );

    const usdAccount = initialState.accounts.find(
      ({ id }) => id === ECurrency.Usd
    ) as IAccount;

    const inputFrom = screen.getByTestId("input-amount-from");
    userEvent.type(inputFrom, usdAccount.balance);

    waitFor(() => {
      expect(screen.getByTestId("sell-button")).toBeEnabled();
    });

    userEvent.type(
      inputFrom,
      String(currency(usdAccount.balance).add("0.01").value)
    );

    waitFor(() => {
      expect(screen.getByTestId("sell-button")).toBeDisabled();
      expect(screen.getByText("exceed balance")).toBeInTheDocument();
    });
  });

  it("shoud convert with the correct rate when the user presses the Sell button and update the balances accordingly", () => {
    const rate = "0.1";
    const amount = "100";

    fetchMock.mock(getFetchUrl(ECurrency.Usd, ECurrency.Eur), rate);

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Exchange />
      </QueryClientProvider>
    );

    const usdAccount = initialState.accounts.find(
      ({ id }) => id === ECurrency.Usd
    ) as IAccount;

    const eurAccount = initialState.accounts.find(
      ({ id }) => id === ECurrency.Eur
    ) as IAccount;

    const inputFrom = screen.getByTestId("input-amount-from");
    userEvent.type(inputFrom, amount);

    waitFor(() => {
      expect(screen.getByTestId("sell-button")).toBeEnabled();

      userEvent.click(screen.getByTestId("sell-button"));

      expect(screen.getByTestId("account-balance-from").textContent).toEqual(
        `Balance: ${currency(usdAccount.balance).subtract(amount).value} ${
          usdAccount.id
        }`
      );

      expect(screen.getByTestId("account-balance-to").textContent).toEqual(
        `Balance: ${
          currency(eurAccount.balance).add(currency(amount).multiply(rate))
            .value
        } ${eurAccount.id}`
      );
    });
  });

  it("should reset the inputs when a currency exchange is made", () => {
    const rate = "0.1";
    const amount = "100";

    fetchMock.mock(getFetchUrl(ECurrency.Usd, ECurrency.Eur), rate);

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Exchange />
      </QueryClientProvider>
    );

    const inputFrom = screen.getByTestId("input-amount-from");
    const inputTo = screen.getByTestId("input-amount-to");
    userEvent.type(inputFrom, amount);

    waitFor(() => {
      expect(screen.getByTestId("sell-button")).toBeEnabled();

      userEvent.click(screen.getByTestId("sell-button"));

      expect(inputFrom).toHaveValue("");
      expect(inputTo).toHaveValue("");
    });
  });
});
