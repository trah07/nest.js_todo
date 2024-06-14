import React from "react";

const TodoSearchList = ({ todos }) => {
  return (
    <ul className="todo-list">
      {todos?.length > 0 ? (
        todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <span>{todo.title}</span>
          </li>
        ))
      ) : (
        <li>No Todos found</li>
      )}
    </ul>
  );
};

export default TodoSearchList;
