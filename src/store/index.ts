import { exchange, setFrom, setTo } from "./mutations";

import { ECurrency, EActionType, TAction, TState } from "../typings";

export const initialState: TState = {
  accounts: [
    {
      id: ECurrency.Usd,
      balance: "874.12",
    },
    {
      id: ECurrency.Eur,
      balance: "45.04",
    },
    {
      id: ECurrency.Gbp,
      balance: "1000.00",
    },
    {
      id: ECurrency.Aud,
      balance: "3232.12",
    },
    {
      id: ECurrency.Cad,
      balance: "453.12",
    },
  ],
  currencyFrom: { id: ECurrency.Usd, amount: "" },
  currencyTo: { id: ECurrency.Eur, amount: "" },
};

export const reducer = (state: TState, action: TAction) => {
  switch (action.type) {
    case EActionType.Exchange:
      return exchange(state);
    case EActionType.ChangeFrom:
      return setFrom(state, action.payload);
    case EActionType.ChangeTo:
      return setTo(state, action.payload);
    default:
      throw new Error();
  }
};
