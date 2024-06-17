import { Query, Resolver, Args } from "@nestjs/graphql";
import { Todo } from "./todo.entity";
import { TodosService } from "./todos.service";

@Resolver(() => Todo)
export class TodosQueryResolver {
  constructor(private readonly todosService: TodosService) {}

  @Query(() => [Todo])
  getTodos(): Todo[] {
    return this.todosService.getTodos();
  }

  @Query(() => Todo, { nullable: true })
  getTodo(@Args("id") id: string): Todo {
    return this.todosService.getTodoById(id);
  }
}
