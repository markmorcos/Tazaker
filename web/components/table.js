import styled from "styled-components";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 0.25rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);

  th {
    background-color: #f8f9fa;
    color: #495057;
    font-weight: 600;
    text-align: left;
    padding: 0.75rem;
  }

  td {
    padding: 0.75rem;
    border-bottom: 1px solid #dee2e6;
  }

  tr:last-child td {
    border-bottom: none;
  }

  a {
    color: #007bff;
  }

  .badge {
    display: inline-block;
    padding: 0.35em 0.65em;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25rem;

    &.primary {
      color: #fff;
      background-color: #007bff;
    }

    &.danger {
      color: #fff;
      background-color: #dc3545;
    }

    &.success {
      color: #fff;
      background-color: #28a745;
    }
  }
`;
