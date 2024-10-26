import express from 'express';
import cors from 'cors';
import semesterRouter from './routes/semester.routes.js';
import { PORT } from './config/environment.js';
import connectDB from './config/mongo.js'; 

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', semesterRouter);

app.get('/', (req, res) => {
  res.send({ message: 'Hello, World!' });
});

async function startServer() {
  const isConnected= await connectDB();
  if(isConnected){
    app.listen(PORT, () => {
      console.log(`Backend en http://localhost:${PORT}`);
    });
  }
  else{
    console.log(`Server did not start on ${PORT}`)
		process.exit();
  }
}

startServer();

export default app;
