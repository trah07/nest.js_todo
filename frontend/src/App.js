import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import TodoItemDetails from "./components/TodoItemDetails";
import TodoSearchForm from "./components/TodoSearchForm";
import Notification from "./components/Notification";
import { useQuery, useSubscription } from "@apollo/client";
import { GET_TODOS, TODO_CREATED, TODO_UPDATED } from "./graphql";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [notifications, setNotifications] = useState([]);

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

  const handleCloseNotification = (index) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, i) => i !== index)
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! :(</p>;

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <TodoForm setNotifications={setNotifications} />
                <TodoList todos={todos} setNotifications={setNotifications} />
                <Link to="/search" className="todo-button search-todos-button">
                  Search Todos
                </Link>
              </>
            }
          />
          <Route path="/todos/:id" element={<TodoItemDetails />} />
          <Route path="/search" element={<TodoSearchForm />} />
        </Routes>
        <Notification
          notifications={notifications}
          onClose={handleCloseNotification}
        />
      </div>
    </Router>
  );
};

export default App;
