import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { CREATE_TODO } from "../graphql";

const TodoForm = ({ setNotifications }) => {
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [createTodo] = useMutation(CREATE_TODO);

  const handleCreateTodo = (e) => {
    e.preventDefault();
    if (title.trim() === "") {
      setErrorMessage("Title cannot be empty");
      return;
    }
    setErrorMessage("");
    createTodo({
      variables: { title },
      update: (cache, { data: { createTodo: todo } }) => {
        cache.modify({
          fields: {
            getTodos(existingTodos = []) {
              const newTodoRef = cache.writeFragment({
                data: todo,
                fragment: gql`
                  fragment NewTodo on Todo {
                    id
                    title
                    completed
                  }
                `,
              });
              return [...existingTodos, newTodoRef];
            },
          },
        });
      },
    })
      .then(() => {
        setTitle("");
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          { message: "New task added successfully", type: "success" },
        ]);
      })
      .catch((err) => {
        console.error("Error creating todo:", err);
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          { message: "Failed to add task", type: "error" },
        ]);
      });
  };

  return (
    <div className="todo-form">
      <form onSubmit={handleCreateTodo}>
        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="todo-input"
        />
        <button type="submit">Add</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default TodoForm;
