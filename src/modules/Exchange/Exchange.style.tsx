import styled from "styled-components";

export const StyledExchange = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledHeader = styled.div`
  font-size: 24px;
  font-weight: bold;
  display: flex;
`;

export const StyledSubHeader = styled.div`
  font-size: 12px;
  display: flex;
  margin-bottom: 12px;
  color: #2684ff;
`;

export const StyledCurrency = styled.div`
  display: flex;
  padding: 12px;
  flex-direction: column;
  width: 360px;
`;

export const StyledContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export const StyledInput = styled.input`
  text-align: right;
  width: 140px;
  padding: 4px;
`;

export const StyledBalance = styled.span`
  font-size: 12px;
  padding-top: 6px;
`;

export const StyledErrorMessage = styled.span`
  font-size: 12px;
  padding-top: 6px;
  color: red;
`;

export const StyledButton = styled.button`
  font-size: 16px;

  width: 360px;
  padding: 12px 36px;

  cursor: pointer;
  text-align: center;

  color: white;
  border: none;
  background-color: #2684ff;

  &:hover {
    background-color: #0c50a6;
  }

  &:disabled {
    cursor: default;
    background-color: #c8c8c8;
  }
`;
