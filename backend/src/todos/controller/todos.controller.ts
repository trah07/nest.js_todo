import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from "@nestjs/common";
import { TodosService } from "../service/todos.service";
import { CreateTodoInput, UpdateTodoInput } from "../model/todo.dto";
import { Todo } from "../model/todo.entity";

@Controller("todos")
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  getAllTodos(): Todo[] {
    return this.todosService.getTodos();
  }

  @Get(":id")
  getTodoById(@Param("id") id: string): Todo {
    return this.todosService.getTodoById(id);
  }

  @Post()
  createTodo(@Body() input: CreateTodoInput): Todo {
    return this.todosService.createTodo(input);
  }

  @Put(":id/toggle")
  toggleTodoCompleted(@Param("id") id: string): Todo {
    return this.todosService.toggleTodoCompleted(id);
  }

  @Delete(":id")
  deleteTodo(@Param("id") id: string): Todo {
    return this.todosService.deleteTodo(id);
  }

  @Put(":id")
  updateTodo(@Param("id") id: string, @Body() input: UpdateTodoInput): Todo {
    input.id = id;
    return this.todosService.updateTodo(input);
  }
}
