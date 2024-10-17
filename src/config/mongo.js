import mongoose from 'mongoose';
import {MONGO_URI} from './environment.js';

class Database {
  constructor() {
    this.connectionString = MONGO_URI;
  }

  async connect() {
    try {
      await mongoose.connect(this.connectionString);
      console.log('Conectado a la base de datos');
    } catch (error) {
      console.error('Error conectando a la base de datos', error);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('Desconectado de la base de datos');
    } catch (error) {
      console.error('Error desconectando de la base de datos', error);
    }
  }
}

export default new Database();
