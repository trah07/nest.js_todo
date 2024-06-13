import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TodosModule } from "./todos/todos.module";
import { PubSub } from "graphql-subscriptions";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

const pubSub = new PubSub();

@Module({
  imports: [
    TodosModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res, pubSub }),
      subscriptions: {
        "subscriptions-transport-ws": {
          path: "/graphql",
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
