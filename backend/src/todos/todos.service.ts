import { Injectable, NotFoundException } from "@nestjs/common";
import { Todo } from "./todo.entity";
import { CreateTodoInput, UpdateTodoInput } from "./todo.dto";

@Injectable()
export class TodosService {
  private todos: Todo[] = [];

  getTodos(): Todo[] {
    return this.todos;
  }

  getTodoById(id: string): Todo {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new NotFoundException("Todo not found");
    }
    return todo;
  }

  createTodo(input: CreateTodoInput): Todo {
    const todo: Todo = {
      id: Date.now().toString(),
      title: input.title,
      completed: false,
    };
    this.todos.push(todo);
    return todo;
  }

  toggleTodoCompleted(id: string): Todo {
    const todo = this.findTodoById(id);
    todo.completed = !todo.completed;
    return todo;
  }

  deleteTodo(id: string): Todo {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      throw new NotFoundException("Todo not found");
    }
    const [deletedTodo] = this.todos.splice(index, 1);
    return deletedTodo;
  }

  updateTodo(input: UpdateTodoInput): Todo {
    const todo = this.findTodoById(input.id);
    if (input.title !== undefined) {
      todo.title = input.title;
    }
    if (input.completed !== undefined) {
      todo.completed = input.completed;
    }
    return todo;
  }

  private findTodoById(id: string): Todo {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new NotFoundException("Todo not found");
    }
    return todo;
  }
}
