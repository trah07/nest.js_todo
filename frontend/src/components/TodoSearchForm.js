import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_TODOS } from "../graphql/queries";
import TodoSearchList from "./TodoSearchList";

const TodoSearchForm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading, error } = useQuery(GET_TODOS);
  const navigate = useNavigate();

  const filteredTodos = data?.getTodos.filter((todo) =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="todo-search-container">
      <form className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title"
          className="search-input"
        />
        <button type="button" className="search-button">
          Search
        </button>
      </form>
      <h2>Search Todos</h2>
      {error && <p className="error-message">Error! :( {error.message}</p>}
      <TodoSearchList todos={filteredTodos} />
      <button className="todo-button back-button" onClick={() => navigate("/")}>
        Back
      </button>
    </div>
  );
};

export default TodoSearchForm;
