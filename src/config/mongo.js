import mongoose from "mongoose";
import { MONGO_URI } from "./environment.js";

export default function connectDB() {
	return mongoose
		.connect(MONGO_URI)
		.then(async () => {
			console.log(`Estado de la conextion MongoDB (1 es conectado): ${mongoose.connection.readyState}`);
			await registerModels();
			return true;
		})
		.catch((error) => {
			console.log(`MongoDB no pudo conectarse. Error: ${error}`);
			return false;
		});
}

async function registerModels() {
    await import('../schemas/semester.schema.js');
}