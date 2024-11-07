import connectDB from '../../config/mongo.js';
import request from 'supertest';
import mongoose from 'mongoose';
import { expect } from 'chai';
import app from '../../app.js';
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

describe('Controlador de Semestres (Integración)', () => {
  describe('Crear Semestre', () => {
    it('debería crear un semestre exitosamente', async () => {
      const semestreData = {
        name: 'Semestre 1',
        year: 2024,
        startDate: '2024-03-01',
        endDate: '2024-07-01',
        subjects: [],
        owner: new mongoose.Types.ObjectId(),
        users: [],
      };

      const response = await request(app)
        .post('/api/semester')
        .send(semestreData)
        .expect(201);

      expect(response.body.message).to.equal('Semestre creado exitosamente');
      expect(response.body.semestre).to.have.property('_id');
      expect(response.body.semestre.name).to.equal(semestreData.name);
    });
  });

  describe('Obtener un semestre', () => {
    it('debería obtener un semestre por ID', async () => {
      const semestre = await Semester.create({
        name: 'Semestre 1',
        year: 2024,
        startDate: '2024-03-01',
        endDate: '2024-07-01',
        subjects: [],
        owner: new mongoose.Types.ObjectId(),
        users: [],
      });

      const response = await request(app)
        .get(`/api/semester/${semestre._id}`)
        .expect(200);

      expect(response.body).to.have.property('_id').that.equals(semestre._id.toString());
      expect(response.body.name).to.equal('Semestre 1');
    });

    it('debería devolver un error si el semestre no se encuentra', async () => {
      const response = await request(app)
        .get('/api/semester/609b4b64b3c1b2a0f0b85c1a')
        .expect(404);

      expect(response.body.message).to.equal('Semestre no encontrado');
    });
  });

  describe('Editar un semestre', () => {
    it('debería actualizar un semestre exitosamente', async () => {
      const semestre = await Semester.create({
        name: 'Semestre 1',
        year: 2024,
        startDate: '2024-03-01',
        endDate: '2024-07-01',
        subjects: [],
        owner: new mongoose.Types.ObjectId(),
        users: [],
      });

      const response = await request(app)
        .put(`/api/semester/${semestre._id}`)
        .send({ name: 'Semestre 1 Actualizado', year: 2024 })
        .expect(200);

      expect(response.body.semestre.name).to.equal('Semestre 1 Actualizado');
    });

    it('debería devolver un error si el semestre a editar no se encuentra', async () => {
      const response = await request(app)
        .put('/api/semester/609b4b64b3c1b2a0f0b85c1a')
        .send({ name: 'Semestre Inexistente' })
        .expect(404);

      expect(response.body.message).to.equal('Semestre no encontrado');
    });
  });

  describe('Eliminar un semestre', () => {
    it('debería eliminar un semestre exitosamente', async () => {
      const semestre = await Semester.create({
        name: 'Semestre 1',
        year: 2024,
        startDate: '2024-03-01',
        endDate: '2024-07-01',
        subjects: [],
        owner: new mongoose.Types.ObjectId(),
        users: [],
      });

      const response = await request(app)
        .delete(`/api/semester/${semestre._id}`)
        .expect(200);

      expect(response.body.message).to.equal('Semestre eliminado');

      const checkDeleted = await Semester.findById(semestre._id);
      expect(checkDeleted).to.be.null;
    });

    it('debería devolver un error si el semestre a eliminar no se encuentra', async () => {
      const response = await request(app)
        .delete('/api/semester/609b4b64b3c1b2a0f0b85c1a')
        .expect(404);

      expect(response.body.message).to.equal('Semestre no encontrado');
    });
  });

  describe('Calcular duración en semanas del semestre', () => {
    it('debería calcular correctamente las semanas del semestre', async () => {
      const semestre = await Semester.create({
        name: 'Semestre 1',
        year: 2024,
        startDate: '2024-03-01',
        endDate: '2024-07-01',
        subjects: [],
        owner: new mongoose.Types.ObjectId(),
        users: [],
      });

      const response = await request(app)
        .get(`/api/semester/${semestre._id}`)
        .expect(200);

      const weeks = response.body.weeksDuration;
      expect(weeks).to.equal(18);
    });
  });
});
