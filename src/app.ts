import express from "express";
import { PORT } from "./config/environment.js";
import connectDB from "./config/mongo.js";
import cors from "cors";

const app = express();

app.use(cors());

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
  } else {
    process.exit();
  }
}

startSever();
