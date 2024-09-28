import styled from "styled-components";

export const Breadcrumbs = styled.ol`
  padding: 0.5rem 1rem;
  background-color: var(--background-color);
  margin: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: var(--text-secondary);

  li {
    display: inline-block;
    margin-right: 0.5rem;

    &::after {
      content: "/";
      margin-left: 0.5rem;
      color: var(--text-primary);
    }

    &:last-child {
      margin-right: 0;

      &::after {
        display: none;
      }
    }

    &.active {
      color: var(--primary-color);
    }
  }
`;
