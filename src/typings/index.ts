export enum ECurrency {
  Usd = "USD",
  Eur = "EUR",
  Gbp = "GBP",
  Aud = "AUD",
  Cad = "CAD",
}

export enum EActionType {
  Exchange = "EXCHANGE",
  ChangeFrom = "CHANGE_FROM",
  ChangeTo = "CHANGE_TO",
}

export interface IAccount {
  id: ECurrency;
  balance: string;
}

export interface ICurrency {
  id: ECurrency;
  amount: string;
}

export type TState = {
  accounts: IAccount[];
  currencyFrom: ICurrency;
  currencyTo: ICurrency;
};

export type TActionPayload = {
  currency: ICurrency;
};

export type TAction =
  | { type: EActionType.Exchange }
  | {
      type: EActionType.ChangeFrom;
      payload: TActionPayload["currency"];
    }
  | { type: EActionType.ChangeTo; payload: TActionPayload["currency"] };
