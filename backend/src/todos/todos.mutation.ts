import { Mutation, Resolver, Args } from "@nestjs/graphql";
import { Todo } from "./todo.entity";
import { CreateTodoInput, UpdateTodoInput } from "./todo.dto";
import { TodosService } from "./todos.service";
import { pubSub } from "./pubsub";

@Resolver(() => Todo)
export class TodosMutationResolver {
  constructor(private readonly todosService: TodosService) {}

  @Mutation(() => Todo)
  createTodo(@Args("input") input: CreateTodoInput): Todo {
    const todo = this.todosService.createTodo(input);
    pubSub.publish("todoCreated", { todoCreated: todo });
    return todo;
  }

  @Mutation(() => Todo)
  toggleTodoCompleted(@Args("id") id: string): Todo {
    const todo = this.todosService.toggleTodoCompleted(id);
    pubSub.publish("todoCompleted", { todoCompleted: todo });
    return todo;
  }

  @Mutation(() => Todo, { nullable: true })
  deleteTodo(@Args("id") id: string): Todo {
    const deletedTodo = this.todosService.deleteTodo(id);
    pubSub.publish("todoDeleted", { todoDeleted: deletedTodo });
    return deletedTodo;
  }

  @Mutation(() => Todo)
  updateTodo(@Args("input") input: UpdateTodoInput): Todo {
    const todo = this.todosService.updateTodo(input);
    pubSub.publish("todoUpdated", { todoUpdated: todo });
    return todo;
  }
}
