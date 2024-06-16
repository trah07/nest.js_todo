import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Todo } from "./todo.entity";
import { CreateTodoInput, UpdateTodoInput } from "./todo.dto";
import { NotFoundException } from "@nestjs/common";
import { TodosService } from "./todos.service";

const pubSub = new PubSub();

@Resolver(() => Todo)
export class TodosResolver {
  constructor(private readonly todosService: TodosService) {}

  @Query(() => [Todo])
  getTodos(): Todo[] {
    return this.todosService.getTodos();
  }

  @Query(() => Todo, { nullable: true })
  getTodo(@Args("id") id: string): Todo {
    try {
      return this.todosService.getTodoById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException("Todo not found");
      }
      throw error;
    }
  }

  @Mutation(() => Todo)
  createTodo(@Args("input") input: CreateTodoInput): Todo {
    const todo = this.todosService.createTodo(input);
    this.publishEvent("todoCreated", todo);
    return todo;
  }

  @Mutation(() => Todo)
  toggleTodoCompleted(@Args("id") id: string): Todo {
    const todo = this.todosService.toggleTodoCompleted(id);
    this.publishEvent("todoCompleted", todo);
    return todo;
  }

  @Mutation(() => Todo, { nullable: true })
  deleteTodo(@Args("id") id: string): Todo {
    const deletedTodo = this.todosService.deleteTodo(id);
    this.publishEvent("todoDeleted", deletedTodo);
    return deletedTodo;
  }

  @Mutation(() => Todo)
  updateTodo(@Args("input") input: UpdateTodoInput): Todo {
    const todo = this.todosService.updateTodo(input);
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

  private publishEvent(event: string, payload: Todo) {
    pubSub.publish(event, { [event]: payload });
  }
}
