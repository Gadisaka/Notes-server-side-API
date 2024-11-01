import express from "express";
import db from "./config/db.js";
import AuthRouter from "./routes/user.route.js";
import NoteRouter from "./routes/note.route.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = 3000;

db.connect()
  .then(() => {
    console.log("Connected to database successfully!");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database:", err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // for parsing application/json

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your Notes API",
      version: "1.0.0",
      description: "API for Notes Application",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    servers: [{ url: "http://localhost:3000" }],
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/auth", AuthRouter);
app.use("/api/note", NoteRouter);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).send("Page not found!");
  console.log("error a");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
  console.log("error b");
});

// Start the server
// const PORT = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
