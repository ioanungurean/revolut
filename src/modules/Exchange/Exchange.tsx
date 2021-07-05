import React, { useEffect, useReducer } from "react";
import currency from "currency.js";

import { initialState, reducer } from "../../store";
import { useFetchRates } from "../../hooks/useFetchRates";
import { checkIfValidNumber } from "../../utils";

import Select from "../../components/Select";

import { ECurrency, EActionType, IAccount } from "../../typings";

import {
  StyledExchange,
  StyledHeader,
  StyledSubHeader,
  StyledCurrency,
  StyledContainer,
  StyledInput,
  StyledBalance,
  StyledErrorMessage,
  StyledButton,
} from "./Exchange.style";

export interface ExchangeProps {}

const Exchange: React.FC<ExchangeProps> = () => {
  const [{ accounts, currencyFrom, currencyTo }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const { data } = useFetchRates(currencyFrom, currencyTo);

  useEffect(() => {
    if (data) {
      const amount = currencyFrom.amount
        ? `${currency(currencyFrom.amount).multiply(data).value}`
        : "";

      dispatch({
        type: EActionType.ChangeTo,
        payload: {
          id: currencyTo.id,
          amount,
        },
      });
    }
  }, [data, currencyFrom.amount]);

  const currencyOptions: ECurrency[] = accounts.map(({ id }) => id);

  const accountFrom = accounts.find(
    ({ id }) => id === currencyFrom.id
  ) as IAccount;
  const accountTo = accounts.find(({ id }) => id === currencyTo.id) as IAccount;

  const handleSelectChange = (
    id: ECurrency,
    type: EActionType,
    amount: string
  ) => {
    dispatch({
      type,
      payload: {
        id,
        amount,
      },
    });
  };

  const handleInputChange = (
    ev: React.ChangeEvent<HTMLInputElement>,
    type: EActionType,
    id: ECurrency
  ) => {
    if (checkIfValidNumber(ev.target.value)) {
      dispatch({
        type,
        payload: {
          id,
          amount: ev.target.value,
        },
      });
    }
  };

  return (
    <StyledExchange>
      <StyledHeader>Sell {accountFrom.id}</StyledHeader>

      <StyledSubHeader>
        Market order • 1 {accountFrom.id} = {data} {accountTo.id}
      </StyledSubHeader>

      <StyledCurrency>
        <StyledContainer>
          <Select
            id="select-currency-from"
            options={currencyOptions}
            defaultValue={accountFrom.id}
            onChange={(selectedOption: ECurrency) =>
              handleSelectChange(
                selectedOption,
                EActionType.ChangeFrom,
                currencyFrom.amount
              )
            }
          />
          <StyledInput
            data-testid="input-amount-from"
            value={currencyFrom.amount}
            placeholder={`0.00 ${currencyFrom.id}`}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(ev, EActionType.ChangeFrom, accountFrom.id)
            }
          />
        </StyledContainer>
        <StyledContainer>
          <StyledBalance data-testid="account-balance-from">
            Balance: {accountFrom.balance} {accountFrom.id}
          </StyledBalance>
          {currency(currencyFrom.amount).value >
            currency(accountFrom.balance).value && (
            <StyledErrorMessage>exceed balance</StyledErrorMessage>
          )}
        </StyledContainer>
      </StyledCurrency>

      <StyledCurrency>
        <StyledContainer>
          <Select
            id="select-currency-to"
            options={currencyOptions}
            defaultValue={accountTo.id}
            onChange={(selectedOption: ECurrency) =>
              handleSelectChange(
                selectedOption,
                EActionType.ChangeTo,
                currencyTo.amount
              )
            }
          />
          <StyledInput
            data-testid="input-amount-to"
            value={currencyTo.amount}
            placeholder={`0.00 ${currencyTo.id}`}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(ev, EActionType.ChangeTo, accountTo.id)
            }
          />
        </StyledContainer>
        <StyledContainer>
          <StyledBalance data-testid="account-balance-to">
            Balance: {accountTo.balance} {accountTo.id}
          </StyledBalance>
        </StyledContainer>
      </StyledCurrency>

      <StyledButton
        data-testid="sell-button"
        disabled={
          !data ||
          !currency(currencyFrom.amount).value ||
          accountFrom.id === accountTo.id ||
          currency(currencyFrom.amount).value >
            currency(accountFrom.balance).value
        }
        onClick={() =>
          dispatch({
            type: EActionType.Exchange,
          })
        }
      >
        Sell {accountFrom.id} to {accountTo.id}
      </StyledButton>
    </StyledExchange>
  );
};

export default Exchange;
