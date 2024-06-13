import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import TodoItemDetails from "./components/TodoItemDetails";
import { useQuery, useSubscription } from "@apollo/client";
import { GET_TODOS, TODO_CREATED, TODO_UPDATED } from "./graphql";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const { data, loading, error } = useQuery(GET_TODOS);
  const { data: todoCreated } = useSubscription(TODO_CREATED);
  const { data: todoUpdated } = useSubscription(TODO_UPDATED);

  useEffect(() => {
    if (todoCreated) {
      const newTodo = todoCreated.todoCreated;
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    }
  }, [todoCreated]);

  useEffect(() => {
    if (todoUpdated) {
      const updatedTodo = todoUpdated.todoUpdated;
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        )
      );
    }
  }, [todoUpdated]);

  useEffect(() => {
    if (data) {
      setTodos(data.getTodos);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! :(</p>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <TodoForm setErrorMessage={setErrorMessage} />
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <TodoList todos={todos} />
            </>
          }
        />
        <Route path="/todos/:id" element={<TodoItemDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
