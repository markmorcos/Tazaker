import styled from "styled-components";

export const Button = styled.button`
  cursor: pointer;
  outline: none;
  border: none;
  background-color: var(--primary-color);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  color: #333;
  transition: all 0.4s;

  &:hover {
    background-color: var(--primary-color-dark);
  }

  ${(props) =>
    Boolean(props.$secondary)
      ? `
    background-color: transparent;
    color: #333;
    border: 1px solid var(--primary-color);

    &:hover {
      background-color: var(--hover-background-light);
    }
  `
      : undefined}

  ${(props) =>
    Boolean(props.disabled) ? `opacity: 0.5; cursor: not-allowed;` : undefined}
`;
