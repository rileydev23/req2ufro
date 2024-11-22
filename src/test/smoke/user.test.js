import connectDB from '../../config/mongo.js';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import { expect } from 'chai';
import User from '../../schemas/user.schema.js';
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

describe('Pruebas de Humo para Usuarios', () => {
  let userId;
  let semesterId;

  afterEach(async () => {
    await User.deleteMany({});
    await Semester.deleteMany({});
  });

  it('debería responder al intentar registrar un usuario', async () => {
    const googleId = `test-google-id-${Date.now()}`; // Genera un googleId único
    const email = `test-${Date.now()}@example.com`; // Genera un email único
  
    const response = await request(app).post('/api/users/register').send({
      googleId,
      email,
      name: 'Usuario de Prueba',
      avatarUrl: 'http://example.com/avatar.jpg',
    });
    expect(response.status).to.not.equal(500);
  });
  
  

  it('debería responder al intentar iniciar sesión', async () => {
    await User.create({
      googleId: 'test-google-id',
      email: 'test@example.com',
      name: 'Usuario de Prueba',
      avatarUrl: 'http://example.com/avatar.jpg',
    });

    const response = await request(app).post('/api/users/login').send({
      googleId: 'test-google-id',
    });
    expect(response.status).to.not.equal(500);
  });

  it('debería responder al intentar obtener un usuario por ID', async () => {
    const user = await User.create({
      googleId: 'test-google-id',
      email: 'test@example.com',
      name: 'Usuario de Prueba',
      avatarUrl: 'http://example.com/avatar.jpg',
    });

    userId = user._id;
    const response = await request(app).get(`/api/users/${userId}`);
    expect(response.status).to.not.equal(500);
  });

  it('debería responder al intentar actualizar un usuario', async () => {
    const user = await User.create({
      googleId: 'test-google-id',
      email: 'test@example.com',
      name: 'Usuario de Prueba',
      avatarUrl: 'http://example.com/avatar.jpg',
    });

    userId = user._id;
    const response = await request(app).put(`/api/users/${userId}`).send({
      name: 'Usuario Actualizado',
    });
    expect(response.status).to.not.equal(500);
  });

  it('debería responder al intentar asignar un rol a un usuario', async () => {
    const user = await User.create({
      googleId: 'test-google-id',
      email: 'test@example.com',
      name: 'Usuario de Prueba',
      avatarUrl: 'http://example.com/avatar.jpg',
    });

    userId = user._id;
    const response = await request(app).post(`/api/users/${userId}/assign-role`).send({
      role: 'admin',
    });
    expect(response.status).to.not.equal(500);
  });

  it('debería responder al intentar añadir un semestre a un usuario', async () => {
    const user = await User.create({
      googleId: 'test-google-id',
      email: 'test@example.com',
      name: 'Usuario de Prueba',
      avatarUrl: 'http://example.com/avatar.jpg',
    });

    userId = user._id;
    const semester = await Semester.create({
      name: 'Semestre de Prueba',
      year: 2024,
      startDate: '2024-03-01',
      endDate: '2024-07-01',
      owner: userId,
    });

    semesterId = semester._id;
    const response = await request(app).post(`/api/users/${userId}/semester`).send({
      semesterId,
    });
    expect(response.status).to.not.equal(500);
  });

  it('debería responder al intentar eliminar un semestre de un usuario', async () => {
    const user = await User.create({
      googleId: 'test-google-id',
      email: 'test@example.com',
      name: 'Usuario de Prueba',
      avatarUrl: 'http://example.com/avatar.jpg',
    });

    userId = user._id;
    const semester = await Semester.create({
      name: 'Semestre de Prueba',
      year: 2024,
      startDate: '2024-03-01',
      endDate: '2024-07-01',
      owner: userId,
    });

    semesterId = semester._id;
    await request(app).post(`/api/users/${userId}/semester`).send({
      semesterId,
    });

    const response = await request(app).delete(`/api/users/${userId}/semester/${semesterId}`);
    expect(response.status).to.not.equal(500);
  });

  it('debería responder al intentar eliminar un usuario', async () => {
    const user = await User.create({
      googleId: 'test-google-id',
      email: 'test@example.com',
      name: 'Usuario de Prueba',
      avatarUrl: 'http://example.com/avatar.jpg',
    });

    userId = user._id;
    const response = await request(app).delete(`/api/users/${userId}`);
    expect(response.status).to.not.equal(500);
  });
});
