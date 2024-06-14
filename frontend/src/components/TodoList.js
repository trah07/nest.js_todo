import React from "react";
import TodoItem from "./TodoItem";

function TodoList({ todos }) {
  return (
    <div className="todo-list">
      <h2 className="h2">Todos</h2>
      <ul>
        {todos.length > 0 ? (
          todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        ) : (
          <li>
            <h4 className="new-task-text">Create a new task</h4>
          </li>
        )}
      </ul>
    </div>
  );
}

export default TodoList;
