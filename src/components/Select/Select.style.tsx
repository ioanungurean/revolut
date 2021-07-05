import styled, { css } from "styled-components";

interface IStyledControl {
  isMenuOpen: boolean;
}

export const StyledSelect = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  width: 140px;
`;

export const StyledControl = styled.div<IStyledControl>`
  font-size: 18px;
  line-height: 38px;

  display: flex;

  height: 38px;
  padding: 4px 10px;

  cursor: pointer;

  border: 1px solid;
  border: 1px solid #767676;
  border-radius: 4px;

  align-items: center;
  justify-content: space-between;

  ${({ isMenuOpen }) =>
    isMenuOpen &&
    css`
      outline: #005fcc auto 1px;
    `}
`;

export const StyledMenu = styled.div`
  position: absolute;
  z-index: 1;
  top: 38px;

  display: flex;
  flex-direction: column;

  margin-top: 4px;
  padding: 2px 0;

  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%);
`;

export const StyledOption = styled.div`
  line-height: 38px;

  display: flex;

  width: 140px;
  height: 38px;
  padding: 10px;

  cursor: pointer;

  flex-grow: 1;
  align-items: center;

  &:hover {
    color: #ffffff;
    background-color: #2684ff;
  }
`;

export const StyledArrow = styled.span`
  font-size: 12px;
`;
