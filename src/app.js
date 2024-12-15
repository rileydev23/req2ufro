import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import semesterRouter from "./routes/semester.routes.js";
import userRouter from "./routes/user.routes.js";
import subjectRouter from "./routes/subject.routes.js";
import eventRouter from "./routes/event.routes.js";
import authRouter from "./routes/auth.routes.js";
import { PORT } from "./config/environment.js";
import connectDB from "./config/mongo.js";
import { verifyToken } from "./validate-token.js";

const app = express();
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "LogRocket Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["src/routes/*.js"],
};

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const specs = swaggerJSDoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.use("/api/auth", authRouter);
app.use("/api/users", verifyToken, userRouter);
app.use("/api/semester", verifyToken, semesterRouter);
app.use("/api/subjects", verifyToken, subjectRouter);
app.use("/api/events", verifyToken, eventRouter);

app.get("/", (req, res) => {
  console.log(req, "Hello, World!");
  res.send({ message: "Hello, World!" });
});

async function startServer() {
  const isConnected = await connectDB();
  if (isConnected) {
    app.listen(PORT, () => {
      console.log(`Backend en http://localhost:${PORT}`);
    });
  } else {
    console.log(`Server did not start on ${PORT}`);
    process.exit();
  }
}

startServer();

export default app;
