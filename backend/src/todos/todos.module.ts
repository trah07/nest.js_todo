import { Module } from "@nestjs/common";
import { TodosService } from "./service/todos.service";
import { TodosQueryResolver } from "./service/graphql/todos.query";
import { TodosMutationResolver } from "./service/graphql/todos.mutation";
import { TodosSubscriptionResolver } from "./service/todos.subscription";
import { TodosController } from "./controller/todos.controller";

@Module({
  imports: [],
  providers: [
    TodosService,
    TodosQueryResolver,
    TodosMutationResolver,
    TodosSubscriptionResolver,
  ],
  controllers: [TodosController],
})
export class TodosModule {}
