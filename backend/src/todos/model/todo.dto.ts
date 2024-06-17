import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from "class-validator";

@InputType()
export class CreateTodoInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;
}

@InputType()
export class UpdateTodoInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
