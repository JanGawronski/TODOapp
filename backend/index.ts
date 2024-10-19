import "reflect-metadata"; // For TypeORM
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger"; // Import Swagger config
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { User, List, Task, AppDataSource } from "./database";

const app: Express = express();
app.use(cors());
app.use(express.json());
const port: number = 3000;
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established.");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

// Helper function to validate entities
async function validateEntity(entity: any, res: Response) {
  const errors = await validate(entity);
  if (errors.length > 0) {
    return res.status(400).json(errors.map((err) => err.constraints));
  }
  return null;
}

// Middleware to validate IDs in params
export function validateIdParam(
  req: Request,
  res: Response,
  next: NextFunction
): any {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid ID parameter" });
  }
  next();
}

// USER ROUTES
// Retrieve all users
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Retrieve a user by ID
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
app.get(
  "/api/users/:id",
  validateIdParam,
  async (req: Request, res: Response) => {
    try {
      const user = await AppDataSource.getRepository(User).findOneBy({
        id: Number(req.params.id),
      });

      if (!user)
        return res.status(404).json({ message: "User not found" }) as any;
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching user" });
    }
  }
);

// Create a new user
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user to create
 *                 example: "John Doe"
 *     responses:
 *       201:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
app.post("/api/users", async (req: Request, res: Response) => {
  try {
    const newUser = plainToInstance(User, req.body);
    const error = await validateEntity(newUser, res);
    if (error) return;

    const savedUser = await AppDataSource.getRepository(User).save(newUser);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Update a user by ID
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user to create
 *                 example: "John Doe"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
app.put(
  "/api/users/:id",
  validateIdParam,
  async (req: Request, res: Response) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({
        id: Number(req.params.id),
      });

      if (!user)
        return res.status(404).json({ message: "User not found" }) as any;

      const updatedUser = userRepository.merge(user, req.body);
      const error = await validateEntity(
        plainToInstance(User, updatedUser),
        res
      );
      if (error) return;

      const result = await userRepository.save(updatedUser);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating user" });
    }
  }
);

// Delete a user by ID
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to delete
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
app.delete(
  "/api/users/:id",
  validateIdParam,
  async (req: Request, res: Response) => {
    try {
      const result = await AppDataSource.getRepository(User).delete(
        Number(req.params.id)
      );

      if (result.affected === 0)
        return res.status(404).json({ message: "User not found" }) as any;

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting user" });
    }
  }
);

// LIST ROUTES

// Retrieve lists for a user by ID
/**
 * @swagger
 * /api/lists/user/{id}:
 *   get:
 *     summary: Retrieve lists for a user by ID
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user whose lists are to be fetched
 *     responses:
 *       200:
 *         description: Lists found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/List'
 *       404:
 *         description: No lists found for the user
 */
app.get(
  "/api/lists/user/:id",
  validateIdParam,
  async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.id); // Extract userId from params
      const lists = await AppDataSource.getRepository(List).find({
        where: { userId }, // Find all lists where userId matches
      });

      if (lists.length === 0) {
        return res
          .status(404)
          .json({ message: "No lists found for this user" }) as any;
      }
      res.json(lists);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching lists" });
    }
  }
);

// Retrieve a list by ID
/**
 * @swagger
 * /api/lists/{id}:
 *   get:
 *     summary: Retrieve a list by ID
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the list to retrieve
 *     responses:
 *       200:
 *         description: List found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       404:
 *         description: List not found
 */
app.get(
  "/api/lists/:id",
  validateIdParam,
  async (req: Request, res: Response) => {
    try {
      const list = await AppDataSource.getRepository(List).findOneBy({
        id: Number(req.params.id),
      });

      if (!list)
        return res.status(404).json({ message: "List not found" }) as any;
      res.json(list);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching list" });
    }
  }
);

// Create a new list
/**
 * @swagger
 * /api/lists:
 *   post:
 *     summary: Create a new list
 *     tags: [Lists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the list (required).
 *               userId:
 *                 type: integer
 *                 description: The user ID this list belongs to (optional).
 *               # Add other properties here, if any
 *             required:
 *               - name  # List all required fields excluding `id`
 *     responses:
 *       201:
 *         description: List created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 */
app.post("/api/lists", async (req: Request, res: Response) => {
  try {
    const newList = plainToInstance(List, req.body);
    const error = await validateEntity(newList, res);
    if (error) return;

    const savedList = await AppDataSource.getRepository(List).save(newList);
    res.status(201).json(savedList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating list" });
  }
});

// Update a list by ID
/**
 * @swagger
 * /api/lists/{id}:
 *   put:
 *     summary: Update a list by ID
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the list to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the list (required).
 *               userId:
 *                 type: integer
 *                 description: The user ID this list belongs to.
 *               # Add any other properties here that should be updated.
 *             required:
 *               - name  # List all required fields, excluding `id`
 *     responses:
 *       200:
 *         description: List updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       404:
 *         description: List not found
 */
app.put(
  "/api/lists/:id",
  validateIdParam,
  async (req: Request, res: Response) => {
    try {
      const listRepository = AppDataSource.getRepository(List);
      const list = await listRepository.findOneBy({
        id: Number(req.params.id),
      });

      if (!list)
        return res.status(404).json({ message: "List not found" }) as any;

      const updatedList = listRepository.merge(list, req.body);
      const error = await validateEntity(
        plainToInstance(List, updatedList),
        res
      );
      if (error) return;

      const result = await listRepository.save(updatedList);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating list" });
    }
  }
);

// Delete a list by ID
/**
 * @swagger
 * /api/lists/{id}:
 *   delete:
 *     summary: Delete a list by ID
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the list to delete
 *     responses:
 *       204:
 *         description: List deleted successfully
 *       404:
 *         description: List not found
 */
app.delete(
  "/api/lists/:id",
  validateIdParam,
  async (req: Request, res: Response) => {
    try {
      const result = await AppDataSource.getRepository(List).delete(
        Number(req.params.id)
      );

      if (result.affected === 0)
        return res.status(404).json({ message: "List not found" }) as any;

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting list" });
    }
  }
);

// TASK ROUTES

// Retrieve tasks for a list by ID
/**
 * @swagger
 * /api/tasks/list/{id}:
 *   get:
 *     summary: Retrieve tasks for a list by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the list whose tasks are to be fetched
 *     responses:
 *       200:
 *         description: Tasks found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       404:
 *         description: No tasks found for the list
 */
app.get(
  "/api/tasks/list/:id",
  validateIdParam,
  async (req: Request, res: Response) => {
    try {
      const listId = Number(req.params.id);
      const lists = await AppDataSource.getRepository(Task).find({
        where: { listId },
      });

      if (lists.length === 0) {
        return res
          .status(404)
          .json({ message: "No lists found for this user" }) as any;
      }
      res.json(lists);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching lists" });
    }
  }
);

// Retrieve a task by ID
/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Retrieve a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the task to retrieve
 *     responses:
 *       200:
 *         description: Task found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
app.get(
  "/api/tasks/:id",
  validateIdParam,
  async (req: Request, res: Response) => {
    try {
      const task = await AppDataSource.getRepository(Task).findOneBy({
        id: Number(req.params.id),
      });

      if (!task)
        return res.status(404).json({ message: "Task not found" }) as any;
      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching task" });
    }
  }
);

// Create a new task
/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listId:
 *                 type: integer
 *                 description: The ID of the list this task belongs to.
 *               text:
 *                 type: string
 *                 description: The task text (required).
 *               description:
 *                 type: string
 *                 description: Additional details about the task (optional).
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: The due date of the task (optional).
 *               completed:
 *                 type: boolean
 *                 description: Whether the task is completed (default is false).
 *             required:
 *               - text  # Specify required fields here, excluding `id`
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
app.post("/api/tasks", async (req: Request, res: Response) => {
  try {
    if (req.body.dueDate) {
      req.body.dueDate = new Date(req.body.dueDate);
    }
    const newTask = plainToInstance(Task, req.body);
    const error = await validateEntity(newTask, res);
    if (error) return;

    const savedTask = await AppDataSource.getRepository(Task).save(newTask);
    res.status(201).json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating task" });
  }
});

// Update a task by ID
/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
app.put(
  "/api/tasks/:id",
  validateIdParam,
  async (req: Request, res: Response) => {
    try {
      const taskRepository = AppDataSource.getRepository(Task);
      const task = await taskRepository.findOneBy({
        id: Number(req.params.id),
      });

      if (!task)
        return res.status(404).json({ message: "Task not found" }) as any;

      const updatedTask = taskRepository.merge(task, req.body);

      const result = await taskRepository.save(updatedTask);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating task" });
    }
  }
);

// Delete a task by ID
/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the task to delete
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
app.delete(
  "/api/tasks/:id",
  validateIdParam,
  async (req: Request, res: Response) => {
    try {
      const result = await AppDataSource.getRepository(Task).delete(
        Number(req.params.id)
      );

      if (result.affected === 0)
        return res.status(404).json({ message: "Task not found" }) as any;

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting task" });
    }
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  main();
});
