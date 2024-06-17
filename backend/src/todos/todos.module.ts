import { Module } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { TodosResolverModule } from "./todos.resolver";

@Module({
  imports: [TodosResolverModule],
  providers: [TodosService],
})
export class TodosModule {}
