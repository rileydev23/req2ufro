import express from "express";
import { PORT } from "./config/environment";
import connectDB from "./config/mongo";
import semesterRouter from "./routes/semester.routes"; // Asegúrate de que este camino sea correcto
import cors from "cors";

const app = express();

// Configuración de CORS
app.use(
  cors({
    origin: ["*"], // Lista de tus URLs para acceder a tu API. * permite todo
    credentials: true, // Permite que las cookies sean enviadas con las solicitudes
  })
);
app.use(express.json());

app.use("/api", semesterRouter);

app.get("/", (req, res) => {
  res.send({
    message: "miaau!",
  });
});

async function startServer() {
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

startServer();

export default app;
