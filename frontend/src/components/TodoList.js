import React from "react";
import TodoItem from "./TodoItem";

const TodoList = ({ todos }) => (
  <div>
    <h2 className="h2">Todos</h2>
    <div className="todo-list">
      {todos.length > 0 ? (
        <ul>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      ) : (
        <EmptyState />
      )}
    </div>
  </div>
);

const EmptyState = () => (
  <div className="empty-state">
    <h4 className="new-task-text">Create a new task</h4>
  </div>
);

export default TodoList;
