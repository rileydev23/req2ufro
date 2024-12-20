import connectDB from '../../config/mongo.js';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app.js';
import { expect } from 'chai';

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

describe('Pruebas de Regresión para Semestres', () => {
  it('Debería seguir creando semestres correctamente', async () => {
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

  it('No debería crear un semestre con datos faltantes', async () => {
    const response = await request(app).post('/api/semester').send({ year: 2024 });
    expect(response.status).to.equal(500);
  });

  it('Debería seguir obteniendo el semestre por ID', async () => {
    const response = await request(app).get(`/api/semester/${createdSemesterId}`);
    expect(response.status).to.equal(200);
    expect(response.body.name).to.equal('Semestre de Prueba');
  });

  it('Debería actualizar el semestre correctamente', async () => {
    const response = await request(app).put(`/api/semester/${createdSemesterId}`).send({
      name: 'Semestre Actualizado',
      year: 2025,
    });
    expect(response.status).to.equal(200);
    expect(response.body.semestre.name).to.equal('Semestre Actualizado');
  });

  it('Debería eliminar el semestre correctamente', async () => {
    const response = await request(app).delete(`/api/semester/${createdSemesterId}`);
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Semestre eliminado');
  });
});
