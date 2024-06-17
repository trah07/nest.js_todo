import { Test, TestingModule } from "@nestjs/testing";
import { TodosQueryResolver } from "../src/todos/service/graphql/todos.query";
import { TodosMutationResolver } from "../src/todos/service/graphql/todos.mutation";
import { TodosSubscriptionResolver } from "../src/todos/service/todos.subscription";
import { TodosService } from "../src/todos/service/todos.service";

describe("TodosResolvers", () => {
  let queryResolver: TodosQueryResolver;
  let mutationResolver: TodosMutationResolver;
  let subscriptionResolver: TodosSubscriptionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosQueryResolver,
        TodosMutationResolver,
        TodosSubscriptionResolver,
        {
          provide: TodosService,
          useValue: {
            getTodos: jest.fn(),
            getTodoById: jest.fn(),
            createTodo: jest.fn(),
            toggleTodoCompleted: jest.fn(),
            deleteTodo: jest.fn(),
            updateTodo: jest.fn(),
          },
        },
      ],
    }).compile();

    queryResolver = module.get<TodosQueryResolver>(TodosQueryResolver);
    mutationResolver = module.get<TodosMutationResolver>(TodosMutationResolver);
    subscriptionResolver = module.get<TodosSubscriptionResolver>(
      TodosSubscriptionResolver,
    );
  });

  it("should define queryResolver", () => {
    expect(queryResolver).toBeDefined();
  });

  it("should define mutationResolver", () => {
    expect(mutationResolver).toBeDefined();
  });

  it("should define subscriptionResolver", () => {
    expect(subscriptionResolver).toBeDefined();
  });
});
