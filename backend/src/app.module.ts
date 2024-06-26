import { Module } from "@nestjs/common";
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
        "graphql-ws": {
          path: "/graphql",
        },
      },
    }),
  ],
  controllers: [],
  providers: [{ provide: "PUB_SUB", useValue: pubSub }],
})
export class AppModule {}
