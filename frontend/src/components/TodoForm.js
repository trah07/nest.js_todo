import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { CREATE_TODO } from "../graphql";

function TodoForm({ setErrorMessage }) {
  const [title, setTitle] = useState("");
  const [createTodo] = useMutation(CREATE_TODO);

  const handleCreateTodo = (e) => {
    e.preventDefault();
    if (title.trim() === "") {
      setErrorMessage("Title cannot be empty");
      return;
    }
    setErrorMessage(null);
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
    });
    setTitle("");
  };

  return (
    <div className="todo-form">
      <form onSubmit={handleCreateTodo}>
        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default TodoForm;
