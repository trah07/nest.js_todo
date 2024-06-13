import React, { useEffect, useState } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { GET_TODOS, TODO_CREATED, TODO_UPDATED } from "./graphql";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

function App() {
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
    <>
      <TodoForm setErrorMessage={setErrorMessage} />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <TodoList todos={todos} />
    </>
  );
}

export default App;
