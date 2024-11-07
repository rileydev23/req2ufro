import connectDB from '../../config/mongo.js';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import { expect } from 'chai'; // Importa 'expect' de 'chai'
import Subject from '../../schemas/subject.schema.js';
import Semester from '../../schemas/semester.schema.js';

before(async () => {
  const isConnected = await connectDB();
  if (!isConnected) {
    throw new Error('No se pudo conectar a la base de datos');
  }
  console.log('Base de datos conectada');
});

after(async () => {
  await mongoose.connection.close();
  console.log('Conexión cerrada');
});

describe('Pruebas de Humo para Asignaturas', () => {
  let semester;

  // Crear un semestre antes de las pruebas
  beforeEach(async () => {
    semester = await Semester.create({
      name: 'Semestre de prueba',
      year: 2024,
      startDate: '2024-03-01',
      endDate: '2024-07-01',
      subjects: [],
      owner: new mongoose.Types.ObjectId(),
      users: [],
    });
  });

  // Eliminar los datos después de las pruebas
  afterEach(async () => {
    await Semester.deleteMany({});
    await Subject.deleteMany({});
  });

  it('debería responder al intentar crear una asignatura', async () => {
    const response = await request(app).post(`/api/subjects/${semester._id}`).send({
      name: 'Matemáticas',
    });
    expect(response.status).to.not.equal(500);
  });

  it('debería responder al intentar obtener una asignatura', async () => {
    const subject = await Subject.create({
      name: 'Matemáticas',
    });

    const response = await request(app).get(`/api/subjects/${subject._id}`);
    expect(response.status).to.not.equal(500);
  });

  it('debería responder al intentar actualizar una asignatura', async () => {
    const subject = await Subject.create({
      name: 'Matemáticas',
    });

    const response = await request(app).put(`/api/subjects/${subject._id}`).send({
      name: 'Matemáticas Avanzadas',
    });
    expect(response.status).to.not.equal(500);
  });

  it('debería responder al intentar eliminar una asignatura', async () => {
    const subject = await Subject.create({
      name: 'Matemáticas',
    });

    await Semester.findByIdAndUpdate(semester._id, { $push: { subjects: subject._id } });

    const response = await request(app).delete(`/api/subjects/${subject._id}/semester/${semester._id}`);
    expect(response.status).to.not.equal(500);
  });
});
