import { Entity, PrimaryGeneratedColumn, Column, DataSource } from "typeorm";
import {
  IsString,
  IsInt,
  IsBoolean,
  IsDate,
  IsOptional,
} from "class-validator";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn({ name: "user_id" })
  id!: number;

  @Column()
  @IsString()
  name!: string;
}

@Entity({ name: "lists" })
export class List {
  @PrimaryGeneratedColumn({ name: "list_id" })
  id!: number;

  @Column({ name: "user_id" })
  @IsInt()
  userId!: number;

  @Column()
  @IsString()
  name!: string;
}

@Entity({ name: "tasks" })
export class Task {
  @PrimaryGeneratedColumn({ name: "task_id" })
  id!: number;

  @Column({ name: "list_id" })
  @IsInt()
  listId!: number;

  @Column({ name: "text" })
  @IsString()
  text!: string;

  @Column({ default: "" })
  @IsString()
  @IsOptional()
  description: string = "";

  @Column({ name: "due_date" })
  @IsDate()
  @IsOptional()
  dueDate: Date = new Date(0);

  @Column({ default: false }) 
  @IsBoolean()
  @IsOptional()
  completed: boolean = false;
}

export const AppDataSource = new DataSource({
  type: "mariadb",
  host: "localhost",
  port: 3306,
  username: "todoappuser",
  password: "todoapppassword",
  database: "todoapp",
  entities: [User, List, Task],
});
