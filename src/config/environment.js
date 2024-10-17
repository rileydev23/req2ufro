import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI ?? "";
const PORT = process.env.PORT ?? 3000;

export { MONGO_URI, PORT };

