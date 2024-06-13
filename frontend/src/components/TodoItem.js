import React from "react";
import { useMutation } from "@apollo/client";
import { TOGGLE_TODO_COMPLETED, DELETE_TODO } from "../graphql";

function TodoItem({ todo }) {
  const [toggleTodoCompleted] = useMutation(TOGGLE_TODO_COMPLETED);
  const [deleteTodo] = useMutation(DELETE_TODO);

  const handleTodoCompleted = (id) => {
    toggleTodoCompleted({
      variables: { id },
      optimisticResponse: {
        __typename: "Mutation",
        toggleTodoCompleted: {
          __typename: "Todo",
          id,
          title: todo.title,
          completed: !todo.completed,
        },
      },
    });
  };

  const handleDeleteTodo = (id) => {
    deleteTodo({
      variables: { id },
      update: (cache) => {
        cache.modify({
          fields: {
            getTodos(existingTodos = [], { readField }) {
              return existingTodos.filter(
                (todoRef) => readField("id", todoRef) !== id
              );
            },
          },
        });
      },
    });
  };

  return (
    <li className={todo.completed ? "completed" : ""}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => handleTodoCompleted(todo.id)}
      />
      <span>{todo.title}</span>
      <button
        className="delete-button"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        Delete
      </button>
    </li>
  );
}

export default TodoItem;
