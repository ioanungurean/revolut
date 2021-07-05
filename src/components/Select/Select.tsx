import React, { useRef, useState } from "react";

import { useOnClickOutside } from "../../hooks/useOnClickOutside";

import {
  StyledSelect,
  StyledControl,
  StyledMenu,
  StyledOption,
  StyledArrow,
} from "./Select.style";

export interface SelectProps {
  id: string;
  options: string[];
  defaultValue: string;
  className?: string;
  onChange(selectedOption: string): void;
}

const Select: React.FC<SelectProps> = ({
  id,
  options,
  defaultValue,
  onChange,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  const refContainer = useRef<HTMLDivElement>(null);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOptionClick = (selectedOption: string) => {
    setSelectedOption(selectedOption);
    setIsMenuOpen(false);
    onChange(selectedOption);
  };

  useOnClickOutside(refContainer, () => {
    setIsMenuOpen(false);
  });

  const renderOption = (option: string) => {
    return (
      <StyledOption
        key={option}
        data-testid={option}
        onClick={() => handleOptionClick(option)}
      >
        {option}
      </StyledOption>
    );
  };

  return (
    <StyledSelect ref={refContainer}>
      <StyledControl
        id={id}
        data-testid={id}
        isMenuOpen={isMenuOpen}
        onClick={handleMenuClick}
      >
        <span>{selectedOption}</span>
        <StyledArrow>&#9660;</StyledArrow>
      </StyledControl>
      {isMenuOpen && <StyledMenu>{options.map(renderOption)}</StyledMenu>}
    </StyledSelect>
  );
};

export default Select;
