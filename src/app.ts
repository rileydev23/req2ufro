import express from "express";
import { PORT } from "./config/environment";
import connectDB from "./config/mongo";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["*"], // Comma separated list of your urls to access your api. * means allow everything
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send({
    message: "miau!",
  });
});

async function startSever() {
  console.log("Conectando a la base de datos...");
  const isConnected = await connectDB();
  if (isConnected) {
    app.listen(PORT, () => {
      console.log(`Express server is listening at http://localhost:${PORT} 🚀`);
    });
  } else if (process.env.NODE_ENV !== "test") {
    process.exit();
  }
}

startSever();

export default app;
