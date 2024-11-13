import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;
const TOKEN_SECRET = process.env.TOKEN_SECRET;

export { MONGO_URI, PORT, TOKEN_SECRET };
