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

describe('Pruebas de Regresión para Usuarios', () => {
  let userId;
  let semesterId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Semester.deleteMany({});
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
  });

  it('debería registrar un usuario con los datos correctos', async () => {
    const userData = { googleId: 'new-google-id', email: 'new@example.com', name: 'Nuevo Usuario', avatarUrl: 'http://example.com/new-avatar.jpg' };
    const response = await request(app).post('/api/users/register').send(userData);
    expect(response.body.message).to.equal("Usuario registrado exitosamente");
  });

  it('debería iniciar sesión y obtener el usuario por googleId', async () => {
    const response = await request(app).post('/api/users/login').send({ googleId: 'test-google-id' });
    expect(response.body.user.googleId).to.equal('test-google-id');
  });

  it('debería actualizar el nombre del usuario', async () => {
    const response = await request(app).put(`/api/users/${userId}`).send({ name: 'Usuario Actualizado' });
    expect(response.body.user.name).to.equal('Usuario Actualizado');
  });

  it('debería añadir y eliminar un semestre de un usuario', async () => {
    const addResponse = await request(app).post(`/api/users/${userId}/semester`).send({ semesterId });
    expect(addResponse.body.message).to.equal('Semestre añadido');

    const deleteResponse = await request(app).delete(`/api/users/${userId}/semester/${semesterId}`);
    expect(deleteResponse.body.message).to.equal('Semestre eliminado');
  });
});
