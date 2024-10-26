import connectDB from '../../config/mongo.js';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app.js';
import { expect } from 'chai';

let createdSemesterId;

// Conectar a la base de datos antes de todas las pruebas
before(async () => {
  const isConnected = await connectDB();
  if (!isConnected) {
    throw new Error('No se pudo conectar a la base de datos');
  }
});

// Cerrar la conexión a la base de datos después de todas las pruebas
after(async () => {
  await mongoose.connection.close();
});

describe('Pruebas de Regresión para Semestres', () => {
  it('Debería seguir creando semestres correctamente', async () => {
    const response = await request(app).post('/api/semester').send({
      name: 'Semestre de Prueba',
      year: 2024,
      subjects: [{ name: 'Prueba', grades: [100] }],
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
  });
});
