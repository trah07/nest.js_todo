import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Todo } from "./todo.entity";
import { CreateTodoInput, UpdateTodoInput } from "./todo.dto";
import { NotFoundException } from "@nestjs/common";

const pubSub = new PubSub();

@Resolver(() => Todo)
export class TodosResolver {
  private todos: Todo[] = [];

  @Query(() => [Todo])
  getTodos(): Todo[] {
    return this.todos;
  }

  @Query(() => Todo, { nullable: true })
  getTodo(@Args("id") id: string): Todo {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new NotFoundException("Todo not found");
    }
    return todo;
  }

  @Mutation(() => Todo)
  createTodo(@Args("input") input: CreateTodoInput): Todo {
    const todo: Todo = {
      id: Date.now().toString(),
      title: input.title,
      completed: false,
    };
    this.todos.push(todo);
    this.publishEvent("todoCreated", todo);
    return todo;
  }

  @Mutation(() => Todo)
  toggleTodoCompleted(@Args("id") id: string): Todo {
    const todo = this.findTodoById(id);
    todo.completed = !todo.completed;
    this.publishEvent("todoCompleted", todo);
    return todo;
  }

  @Mutation(() => Todo, { nullable: true })
  deleteTodo(@Args("id") id: string): Todo {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      throw new NotFoundException("Todo not found");
    }
    const [deletedTodo] = this.todos.splice(index, 1);
    this.publishEvent("todoDeleted", deletedTodo);
    return deletedTodo;
  }

  @Mutation(() => Todo)
  updateTodo(@Args("input") input: UpdateTodoInput): Todo {
    const todo = this.findTodoById(input.id);
    if (input.title !== undefined) {
      todo.title = input.title;
    }
    if (input.completed !== undefined) {
      todo.completed = input.completed;
    }
    this.publishEvent("todoUpdated", todo);
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

  private findTodoById(id: string): Todo {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new NotFoundException("Todo not found");
    }
    return todo;
  }

  private publishEvent(event: string, payload: Todo) {
    pubSub.publish(event, { [event]: payload });
  }
}
