import { gql } from "@apollo/client";

export const GET_TODOS = gql`
  query GetTodos {
    getTodos {
      id
      title
      completed
    }
  }
`;

export const GET_TODO = gql`
  query GetTodo($id: String!) {
    getTodo(id: $id) {
      id
      title
      completed
    }
  }
`;
