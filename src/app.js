import express from "express";
import cors from "cors";
import semesterRouter from "./routes/semester.routes.js";
import userRouter from "./routes/user.routes.js";
import subjectRouter from "./routes/subject.routes.js";
import eventRouter from "./routes/event.routes.js";
import authRouter from "./routes/auth.routes.js";
import { PORT } from "./config/environment.js";
import connectDB from "./config/mongo.js";
import { verifyToken, verifyAdminToken } from "./validate-token.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", verifyToken, userRouter);
app.use("/api/semester", verifyToken, semesterRouter);
app.use("/api/subjects", verifyToken, subjectRouter);
app.use("/api/events", verifyToken, eventRouter);

app.get("/", (req, res) => {
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
