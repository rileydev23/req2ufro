import connectDB from '../../config/mongo.js';
import request from 'supertest';
import mongoose from 'mongoose';
import { expect } from 'chai';
import app from '../../app.js';
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

describe('Controlador de Usuarios (Integración)', () => {
  let userId;
  let semesterId;

  describe('Registrar Usuario', () => {
    it('debería registrar un usuario exitosamente', async () => {
      const userData = {
        googleId: 'test-google-id',
        email: 'test@example.com',
        name: 'Usuario de Prueba',
        avatarUrl: 'http://example.com/avatar.jpg',
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);

        expect(response.body.message).to.equal('Usuario registrado exitosamente');
    });
  });

  describe('Iniciar sesión', () => {
    it('debería iniciar sesión exitosamente', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({ googleId: 'test-google-id' })
        .expect(200);

      userId = response.body.user._id;
      expect(response.body.message).to.equal('Inicio de sesión exitoso');
      expect(response.body.user).to.have.property('googleId', 'test-google-id');
    });

    it('debería devolver error si el usuario no existe', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({ googleId: 'non-existent-id' })
        .expect(404);

      expect(response.body.message).to.equal('Usuario no encontrado');
    });
  });

  describe('Obtener usuario por ID', () => {
    it('debería obtener un usuario por su ID', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body).to.have.property('_id', userId);
    });

    it('debería devolver error si el usuario no se encuentra', async () => {
      const response = await request(app)
        .get('/api/users/609b4b64b3c1b2a0f0b85c1a')
        .expect(404);

      expect(response.body.message).to.equal('Usuario no encontrado');
    });
  });

  describe('Actualizar Usuario', () => {
    it('debería actualizar la información de un usuario', async () => {
      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send({ name: 'Usuario Actualizado' })
        .expect(200);

      expect(response.body.user.name).to.equal('Usuario Actualizado');
    });
  });

  
  describe('Asignar Rol', () => {
    it('debería asignar un rol a un usuario', async () => {
      const response = await request(app)
        .post(`/api/users/${userId}/assign-role`)
        .send({ role: 'admin' })
        .expect(200);

      expect(response.body.message).to.equal('Rol asignado');
      expect(response.body.user.role).to.equal('admin');
    });
  });


  describe('Agregar y eliminar Semestre a Usuario', () => {
    before(async () => {
      const semester = await Semester.create({
        name: 'Semestre de Prueba',
        year: 2024,
        startDate: '2024-03-01',
        endDate: '2024-07-01',
        owner: new mongoose.Types.ObjectId(),
      });
      semesterId = semester._id;
    });

    it('debería añadir un semestre a un usuario', async () => {
      const response = await request(app)
        .post(`/api/users/${userId}/semester`)
        .send({ semesterId })
        .expect(200);

      expect(response.body.message).to.equal('Semestre añadido');
    });

    it('debería eliminar un semestre de un usuario', async () => {
      const response = await request(app)
        .delete(`/api/users/${userId}/semester/${semesterId}`)
        .expect(200);

      expect(response.body.message).to.equal('Semestre eliminado');
    });
  });

  describe('Eliminar Usuario', () => {
    it('debería eliminar un usuario exitosamente', async () => {
      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.message).to.equal('Usuario eliminado');

      const checkDeleted = await User.findById(userId);
      expect(checkDeleted).to.be.null;
    });
  });
});
