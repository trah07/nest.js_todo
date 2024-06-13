import React from "react";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { TOGGLE_TODO_COMPLETED, DELETE_TODO } from "../graphql";

const TodoItem = ({ todo }) => {
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
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => handleTodoCompleted(todo.id)}
        />
        <span>{todo.title}</span>
      </div>
      <div className="button-group">
        <Link to={`/todos/${todo.id}`} className="todo-button details-button">
          Details
        </Link>
        <button
          className="todo-button delete-button"
          onClick={() => handleDeleteTodo(todo.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
