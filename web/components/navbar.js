import styled from "styled-components";

export const Navbar = styled.nav`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: var(--background-color);

  @media (max-width: 768px) {
    align-items: center;
    flex-direction: column;
    gap: 0.2rem;
  }

  .burger {
    display: none;
    cursor: pointer;
    margin-bottom: 0.2rem;

    @media (max-width: 768px) {
      display: block;
    }
  }

  .logo {
    font-family: "Dancing Script";
    font-size: 2rem;
  }

  ul {
    display: flex;
    overflow: hidden;
    transition: all 0.4s;
    margin-left: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      gap: 0.2rem;
      height: 0;
      margin-left: 0;

      &.open {
        height: 10rem;
      }
    }

    li {
      margin-right: 1rem;
      display: flex;
      align-items: center;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        margin-right: 0;
      }

      &.active a {
        font-weight: bold;
        background: var(--hover-background-light);
      }

      a {
        transition: all 0.4s;
        padding: 0.4rem;
        border-radius: 0.5rem;

        &:hover {
          font-weight: bold;
          background: var(--hover-background-light);
        }
      }
    }

    &:last-child {
      margin-right: 0;
    }
  }
`;
