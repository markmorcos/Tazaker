import styled from "styled-components";

export const Input = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  outline: none;
  transition: all 0.4s;
  display: block;
  width: 100%;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  &[type="file"] {
    cursor: pointer;

    &::-webkit-file-upload-button {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid #ccc;
      color: var(--text-color);
      cursor: pointer;
      transition: all 0.4s;
      background-color: transparent;
    }

    &::-webkit-file-upload-button:hover {
      background-color: #33333333;
      border-color: var(--primary-color);
    }
  }

  &:hover {
    border-color: var(--primary-color);
  }

  ${(props) =>
    Boolean(props.$error)
      ? `
    border-color: var(--error-color);
  `
      : undefined}
`;
