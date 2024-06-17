import { Subscription, Resolver } from "@nestjs/graphql";
import { Todo } from "../model/todo.entity";
import { pubSub } from "./pubsub";

@Resolver(() => Todo)
export class TodosSubscriptionResolver {
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
}
