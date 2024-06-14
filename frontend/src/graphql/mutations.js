import { gql } from "@apollo/client";

export const CREATE_TODO = gql`
  mutation CreateTodo($title: String!) {
    createTodo(input: { title: $title }) {
      id
      title
      completed
    }
  }
`;

export const TOGGLE_TODO_COMPLETED = gql`
  mutation ToggleTodoCompleted($id: String!) {
    toggleTodoCompleted(id: $id) {
      id
      title
      completed
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: String!) {
    deleteTodo(id: $id) {
      id
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: String!, $title: String) {
    updateTodo(input: { id: $id, title: $title }) {
      id
      title
      completed
    }
  }
`;
