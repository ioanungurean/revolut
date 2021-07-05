import { useQuery } from "react-query";

import { ECurrency, ICurrency } from "../typings";

const fetchRates = async (
  currencyFromId: ECurrency,
  currencyToId: ECurrency
) => {
  return await fetch(
    `https://currency-exchange.p.rapidapi.com/exchange?from=${currencyFromId}&to=${currencyToId}&q=1.0`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": "075300c478msh0e398192b31d907p1ca169jsn375580d6aab4",
        "x-rapidapi-host": "currency-exchange.p.rapidapi.com",
      },
    }
  )
    .then((response) => response.text())
    .catch((err) => console.error("Error at fetchRates: ", err));
};

export const useFetchRates = (
  currencyFrom: ICurrency,
  currencyTo: ICurrency
) => {
  return useQuery(
    ["rates", currencyFrom.id, currencyTo.id],
    async () => {
      return await fetchRates(currencyFrom.id, currencyTo.id);
    },
    {
      refetchOnMount: false,
      refetchInterval: 10000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );
};
