import { Module } from "@nestjs/common";
import { TodosResolver } from "./todos.resolver";
import { TodosService } from "./todos.service";

@Module({
  providers: [TodosResolver, TodosService],
})
export class TodosModule {}
