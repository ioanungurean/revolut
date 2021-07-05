import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  html,
  body,
  #root {
    font-family: Arial, Helvetica, sans-serif;
    height: 100%;
    margin: 0;
    padding: 0;
  }
`;

export const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  justify-content: center;
  align-items: center;

  > :not(:last-child) {
    margin-bottom: 12px;
  }
`;
