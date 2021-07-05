import currency from "currency.js";
import { TState, TActionPayload } from "../typings";

export const exchange = (state: TState): TState => {
  const { accounts, currencyFrom, currencyTo } = state;

  const updatedAccounts = accounts.map((account) => {
    if (account.id === currencyFrom.id) {
      return {
        ...account,
        balance: `${
          currency(account.balance).subtract(currencyFrom.amount).value
        }`,
      };
    }

    if (account.id === currencyTo.id) {
      return {
        ...account,
        balance: `${currency(account.balance).add(currencyTo.amount).value}`,
      };
    }

    return account;
  });

  return {
    ...state,
    currencyFrom: {
      ...state.currencyFrom,
      amount: "",
    },
    currencyTo: {
      ...state.currencyTo,
      amount: "",
    },
    accounts: updatedAccounts,
  };
};

export const setFrom = (
  state: TState,
  payload: TActionPayload["currency"]
): TState => {
  return {
    ...state,
    currencyFrom: payload,
  };
};

export const setTo = (
  state: TState,
  payload: TActionPayload["currency"]
): TState => {
  return {
    ...state,
    currencyTo: payload,
  };
};
