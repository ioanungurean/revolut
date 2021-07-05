import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import Exchange from "./modules/Exchange";

import { GlobalStyle, StyledApp } from "./App.style";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      <StyledApp>
        <Exchange />
      </StyledApp>
    </QueryClientProvider>
  );
};

export default App;
