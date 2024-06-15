import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TODO } from "../graphql/queries";
import { UPDATE_TODO } from "../graphql/mutations";
import Notification from "./Notification";

const TodoItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newTitle, setNewTitle] = useState("");
  const [newCompleted, setNewCompleted] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });

  const { data, loading, error } = useQuery(GET_TODO, { variables: { id } });
  const [updateTodo] = useMutation(UPDATE_TODO);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! :( {error.message}</p>;
  if (!data || !data.getTodo) return <p>No Todo found.</p>;

  const { title, completed } = data.getTodo;

  const handleUpdateTodo = () => {
    const variables = {
      input: {
        id,
        title: newTitle.trim() || title,
        completed: newCompleted !== "" ? newCompleted === "Yes" : completed,
      },
    };

    console.log("Updating Todo with variables:", variables);

    updateTodo({
      variables,
      optimisticResponse: {
        __typename: "Mutation",
        updateTodo: {
          __typename: "Todo",
          id,
          title: variables.input.title,
          completed: variables.input.completed,
        },
      },
      update: (cache, { data: { updateTodo } }) => {
        cache.modify({
          id: cache.identify(updateTodo),
          fields: {
            title() {
              return updateTodo.title;
            },
            completed() {
              return updateTodo.completed;
            },
          },
        });
      },
    })
      .then((response) => {
        console.log("Update response:", response);
        setNewTitle("");
        setNewCompleted("");
        setNotification({
          message: "Changes were successful",
          type: "success",
        });
      })
      .catch((err) => {
        console.error("Update error:", err);
        setNotification({
          message: "Changes were not successful",
          type: "error",
        });
      });
  };

  const handleCloseNotification = () =>
    setNotification({ message: "", type: "" });

  return (
    <div>
      <h2 className="h2">Todo Details</h2>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />
      <div className="todo-details-container">
        <div className="todo-details">
          <p>
            <strong>ID:</strong> {id}
          </p>
          <p>
            <strong>Title:</strong> {title}
          </p>
          <p>
            <strong>Completed:</strong>
            <select
              value={
                newCompleted !== "" ? newCompleted : completed ? "Yes" : "No"
              }
              onChange={(e) => setNewCompleted(e.target.value)}
              className="update-option"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </p>
        </div>
        <div className="new-title-form">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New title"
            className="update-input"
          />
          <button
            className="todo-button update-button"
            onClick={handleUpdateTodo}
          >
            Update
          </button>
        </div>
      </div>
      <button className="todo-button back-button" onClick={() => navigate("/")}>
        Back
      </button>
    </div>
  );
};

export default TodoItemDetails;
