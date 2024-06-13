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

const TODO_CREATED = gql`
  subscription TodoCreated {
    todoCreated {
      id
      title
      completed
    }
  }
`;

function App() {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);

  const { data, loading, error } = useQuery(GET_TODOS);
  const [createTodo] = useMutation(CREATE_TODO);
  const [toggleTodoCompleted] = useMutation(TOGGLE_TODO_COMPLETED);

  const { data: todoCreated } = useSubscription(TODO_CREATED);

  console.log(todoCreated);
  useEffect(() => {
    if (todoCreated) {
      const newTodo = todoCreated.todoCreated;
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    }
  }, [todoCreated]);

  useEffect(() => {
    if (data) {
      setTodos(data.getTodos);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! :(</p>;

  const handleCreateTodo = (e) => {
    e.preventDefault();
    if (title) {
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
    }
  };

  const handleTodoCompleted = (id, title) => {
    toggleTodoCompleted({
      variables: { id },
      optimisticResponse: {
        __typename: "Mutation",
        toggleTodoCompleted: {
          __typename: "Todo",
          id,
          title,
          completed: !todos.find((todo) => todo.id === id).completed,
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
                  onChange={() => {
                    handleTodoCompleted(todo.id, todo.title);
                  }}
                />
                <span>{todo.title}</span>
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
