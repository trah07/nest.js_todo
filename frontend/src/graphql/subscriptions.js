import { gql } from "@apollo/client";

export const TODO_CREATED = gql`
  subscription TodoCreated {
    todoCreated {
      id
      title
      completed
    }
  }
`;

export const TODO_UPDATED = gql`
  subscription TodoUpdated {
    todoUpdated {
      id
      title
      completed
    }
  }
`;
