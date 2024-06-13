import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_TODO } from "../graphql/queries";

const TodoItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_TODO, { variables: { id } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! :( {error.message}</p>;

  if (!data || !data.getTodo) return <p>No Todo found.</p>;

  const { title, completed } = data.getTodo;

  return (
    <div className="todo-details-container">
      <h2>Todo Details</h2>
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
      <button className="todo-button back-button" onClick={() => navigate("/")}>
        Back
      </button>
    </div>
  );
};

export default TodoItemDetails;
