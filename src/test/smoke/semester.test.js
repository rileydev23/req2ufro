import connectDB from '../../config/mongo.js';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app.js';
import { expect } from 'chai';
import Semester from '../../schemas/semester.schema.js';

let createdSemesterId;

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

describe('Pruebas de Humo para Semestres', () => {
  it('Debería crear un semestre exitosamente', async () => {
    const response = await request(app).post('/api/semester').send({
      name: 'Semestre de Prueba',
      year: 2024,
      startDate: '2024-03-01',
      endDate: '2024-07-01',
      subjects: [],
      users: [],
      owner: new mongoose.Types.ObjectId(),
    });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('semestre');
    createdSemesterId = response.body.semestre._id;
  });

  it('Debería obtener el semestre por ID', async () => {
    const response = await request(app).get(`/api/semester/${createdSemesterId}`);
    expect(response.status).to.equal(200);
    expect(response.body.name).to.equal('Semestre de Prueba');
  });

  it('Debería obtener todos los semestres', async () => {
    const response = await request(app).get('/api/semester');
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
  });

  it('Debería actualizar el semestre', async () => {
    const response = await request(app).put(`/api/semester/${createdSemesterId}`).send({
      name: 'Semestre Actualizado',
      year: 2025,
    });

    expect(response.status).to.equal(200);
    expect(response.body.semestre.name).to.equal('Semestre Actualizado');
  });

  it('Debería eliminar el semestre', async () => {
    const response = await request(app).delete(`/api/semester/${createdSemesterId}`);
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Semestre eliminado');
  });
});
