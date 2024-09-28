import styled from "styled-components";

export const Alert = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
  color: var(--light-text-color);
  background-color: ${({ background }) => background};

  a {
    color: var(--text-color);
  }

  &.success {
    background-color: #04aa6d;
  }

  &.danger {
    background-color: #f44336;
  }

  &.warning {
    background-color: #ff9800;
  }
`;
