import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TODO } from "../graphql/queries";
import { UPDATE_TODO } from "../graphql/mutations";

const TodoItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newTitle, setNewTitle] = useState("");
  const { data, loading, error } = useQuery(GET_TODO, { variables: { id } });
  const [updateTodo] = useMutation(UPDATE_TODO);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! :( {error.message}</p>;

  if (!data || !data.getTodo) return <p>No Todo found.</p>;

  const { title, completed } = data.getTodo;

  const handleUpdateTodo = () => {
    if (newTitle.trim() === "") {
      return;
    }
    updateTodo({
      variables: { id, title: newTitle },
      optimisticResponse: {
        __typename: "Mutation",
        updateTodo: {
          __typename: "Todo",
          id,
          title: newTitle,
          completed,
        },
      },
      update: (cache, { data: { updateTodo } }) => {
        cache.modify({
          id: cache.identify(updateTodo),
          fields: {
            title() {
              return updateTodo.title;
            },
          },
        });
      },
    });
    setNewTitle("");
  };

  return (
    <div className="todo-details-container">
      <h2 className="h2">Todo Details</h2>
      <div className="todo-details">
        <p>
          <strong>ID:</strong> {id}
        </p>
        <p>
          <strong>Title:</strong> {title}
        </p>
        <p>
          <strong>Completed:</strong> {completed ? "Yes" : "No"}
        </p>
      </div>
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="New title"
        className="update-input"
      />
      <button className="todo-button update-button" onClick={handleUpdateTodo}>
        Update
      </button>
      <button className="todo-button back-button" onClick={() => navigate("/")}>
        Back
      </button>
    </div>
  );
};

export default TodoItemDetails;
