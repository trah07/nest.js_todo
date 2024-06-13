import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";

const GET_TODOS = gql`
  query GetTodos {
    getTodos {
      id
      title
      completed
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($title: String!) {
    createTodo(input: { title: $title }) {
      id
      title
      completed
    }
  }
`;

const TOGGLE_TODO_COMPLETED = gql`
  mutation ToggleTodoCompleted($id: String!) {
    toggleTodoCompleted(id: $id) {
      id
      title
      completed
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: String!) {
    deleteTodo(id: $id) {
      id
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: String!, $title: String, $completed: Boolean) {
    updateTodo(input: { id: $id, title: $title, completed: $completed }) {
      id
      title
      completed
    }
  }
`;

const TODO_CREATED = gql`
  subscription TodoCreated {
    todoCreated {
      id
      title
      completed
    }
  }
`;

const TODO_UPDATED = gql`
  subscription TodoUpdated {
    todoUpdated {
      id
      title
      completed
    }
  }
`;

function App() {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const { data, loading, error } = useQuery(GET_TODOS);
  const [createTodo] = useMutation(CREATE_TODO);
  const [toggleTodoCompleted] = useMutation(TOGGLE_TODO_COMPLETED);
  const [deleteTodo] = useMutation(DELETE_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);

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

  const handleCreateTodo = (e) => {
    e.preventDefault();
    if (title.trim() === "") {
      setErrorMessage("Title cannot be empty");
      return;
    }
    setErrorMessage(null);
    createTodo({
      variables: { title: title },
      update: (cache, { data: { createTodo: todo } }) => {
        cache.modify({
          fields: {
            getTodos(existingTodos = []) {
              const newTodoRef = cache.writeFragment({
                data: todo,
                fragment: gql`
                  fragment NewTodo on Todo {
                    id
                    title
                    completed
                  }
                `,
              });
              return [...existingTodos, newTodoRef];
            },
          },
        });
      },
    });
    setTitle("");
  };

  const handleTodoCompleted = (id) => {
    toggleTodoCompleted({
      variables: { id },
      optimisticResponse: {
        __typename: "Mutation",
        toggleTodoCompleted: {
          __typename: "Todo",
          id,
          title: todos.find((todo) => todo.id === id).title,
          completed: !todos.find((todo) => todo.id === id).completed,
        },
      },
    });
  };

  const handleDeleteTodo = (id) => {
    deleteTodo({
      variables: { id },
      update: (cache) => {
        cache.modify({
          fields: {
            getTodos(existingTodos = [], { readField }) {
              return existingTodos.filter(
                (todoRef) => readField("id", todoRef) !== id
              );
            },
          },
        });
      },
    });
  };

  const handleUpdateTodo = (id, newTitle) => {
    updateTodo({
      variables: { id, title: newTitle },
      optimisticResponse: {
        __typename: "Mutation",
        updateTodo: {
          __typename: "Todo",
          id,
          title: newTitle,
          completed: todos.find((todo) => todo.id === id).completed,
        },
      },
    });
  };

  return (
    <>
      <div className="todo-form">
        <form onSubmit={handleCreateTodo}>
          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      <div className="todo-list">
        <h2>Todos</h2>
        <ul>
          {todos.length > 0 ? (
            todos.map((todo) => (
              <li className={todo.completed ? "completed" : ""} key={todo.id}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleTodoCompleted(todo.id)}
                />
                <input
                  type="text"
                  value={todo.title}
                  onChange={(e) => handleUpdateTodo(todo.id, e.target.value)}
                />
                <button
                  className="delete-button"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <li>
              <h4>Create a new task</h4>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

export default App;
