import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "School Management System API",
      version: "1.0.0",
      description:
        "REST API documentation for the School Management System backend.",
    },
    servers: [
      {
        url: process.env.API_BASE_URL || "http://localhost:5000",
        description: "Default server",
      },
    ],
    tags: [
      { name: "System", description: "System and health endpoints" },
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Admin", description: "Admin management endpoints" },
      { name: "Students", description: "Student endpoints" },
      { name: "Teachers", description: "Teacher endpoints" },
      { name: "ClassGroups", description: "Class group endpoints" },
      { name: "Notices", description: "Notice endpoints" },
      { name: "Complaints", description: "Complaint endpoints" },
      { name: "Modules", description: "Module endpoints" },
      { name: "Library", description: "Library endpoints" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          required: ["success", "message"],
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Invalid token" },
            errors: {
              type: "array",
              items: { type: "string" },
              example: ["email is required"],
            },
          },
        },
        SuccessResponse: {
          type: "object",
          required: ["success", "message"],
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object", additionalProperties: true },
          },
        },
      },
    },
  },
  apis: ["./src/app.js", "./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
