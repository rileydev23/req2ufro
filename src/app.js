import express from 'express';
import cors from 'cors';
import semesterRouter from './routes/semester.routes.js';
import { PORT } from './config/environment.js';
import database from './config/mongo.js'; 

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', semesterRouter);

app.get('/', (req, res) => {
  res.send({ message: 'Hello, World!' });
});

database.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT} 🚀`);
  });
});

export default app;
