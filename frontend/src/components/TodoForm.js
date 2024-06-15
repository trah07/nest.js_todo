import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { CREATE_TODO } from "../graphql";
import Notification from "./Notification";

function TodoForm() {
  const [title, setTitle] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
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
        setNotification({
          message: "New task added successfully",
          type: "success",
        });
      })
      .catch((err) => {
        console.error("Error creating todo:", err);
        setNotification({ message: "Failed to add task", type: "error" });
      });
  };

  const handleCloseNotification = () => {
    setNotification({ message: "", type: "" });
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
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
        duration={3000}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default TodoForm;
