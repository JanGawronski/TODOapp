import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo API",
      version: "1.0.0",
      description: "API for managing users, lists, and tasks.",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    tags: [
      {
        name: "Users",
        description: "Operations related to users",
      },
      {
        name: "Lists",
        description: "Operations related to lists",
      },
      {
        name: "Tasks",
        description: "Operations related to tasks",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", description: "The user ID.", example: 1 },
            name: {
              type: "string",
              description: "The user's name.",
              example: "John Doe",
            },
          },
        },
        List: {
          type: "object",
          properties: {
            id: { type: "integer", description: "The list ID.", example: 1 },
            userId: {
              type: "integer",
              description: "The user ID this list belongs to.",
              example: 1,
            },
            name: {
              type: "string",
              description: "The name of the list.",
              example: "Shopping List",
            },
          },
        },
        Task: {
          type: "object",
          properties: {
            id: { type: "integer", description: "The task ID.", example: 1 },
            listId: {
              type: "integer",
              description: "The list ID this task belongs to.",
              example: 1,
            },
            text: {
              type: "string",
              description: "The task text.",
              example: "Buy milk",
            },
            description: {
              type: "string",
              description: "Additional details about the task.",
              example: "Don't forget to check for expiration date.",
            },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "The due date of the task.",
              example: "2024-10-15T14:48:00.000Z",
            },
            completed: {
              type: "boolean",
              description: "Whether the task is completed.",
              example: false,
            },
          },
        },
      },
    },
  },
  apis: ["./index.ts"], // Path to the API docs
};

export const swaggerSpec = swaggerJsDoc(swaggerOptions);
