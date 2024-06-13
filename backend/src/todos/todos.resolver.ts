import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Todo } from "./todo.entity";
import { CreateTodoInput, UpdateTodoInput } from "./todo.dto";

const pubSub = new PubSub();

@Resolver(() => Todo)
export class TodosResolver {
  todos: Todo[] = [];

  @Query(() => [Todo])
  getTodos() {
    return this.todos;
  }

  @Query(() => Todo, { nullable: true })
  getTodo(@Args("id") id: string) {
    return this.todos.find((todo) => todo.id === id);
  }

  @Mutation(() => Todo)
  createTodo(@Args("input") input: CreateTodoInput) {
    const todo = {
      id: Date.now().toString(),
      title: input.title,
      completed: false,
    };
    this.todos.push(todo);
    pubSub.publish("todoCreated", { todoCreated: todo });
    return todo;
  }

  @Mutation(() => Todo)
  toggleTodoCompleted(@Args("id") id: string) {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    todo.completed = !todo.completed;
    pubSub.publish("todoCompleted", { todoCompleted: todo });
    return todo;
  }

  @Mutation(() => Todo, { nullable: true })
  deleteTodo(@Args("id") id: string) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      throw new Error("Todo not found");
    }
    const [deletedTodo] = this.todos.splice(index, 1);
    pubSub.publish("todoDeleted", { todoDeleted: deletedTodo });
    return deletedTodo;
  }

  @Mutation(() => Todo)
  updateTodo(@Args("input") input: UpdateTodoInput) {
    const todo = this.todos.find((todo) => todo.id === input.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    if (input.title !== undefined) {
      todo.title = input.title;
    }
    if (input.completed !== undefined) {
      todo.completed = input.completed;
    }
    pubSub.publish("todoUpdated", { todoUpdated: todo });
    return todo;
  }

  @Subscription(() => Todo)
  todoCreated() {
    return pubSub.asyncIterator("todoCreated");
  }

  @Subscription(() => Todo)
  todoCompleted() {
    return pubSub.asyncIterator("todoCompleted");
  }

  @Subscription(() => Todo)
  todoDeleted() {
    return pubSub.asyncIterator("todoDeleted");
  }

  @Subscription(() => Todo)
  todoUpdated() {
    return pubSub.asyncIterator("todoUpdated");
  }
}
