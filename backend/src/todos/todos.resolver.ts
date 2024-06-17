import { Module } from "@nestjs/common";
import { TodosQueryResolver } from "./todos.query";
import { TodosMutationResolver } from "./todos.mutation";
import { TodosSubscriptionResolver } from "./todos.subscription";
import { TodosService } from "./todos.service";

@Module({
  providers: [
    TodosQueryResolver,
    TodosMutationResolver,
    TodosSubscriptionResolver,
    TodosService,
  ],
})
export class TodosResolverModule {}
