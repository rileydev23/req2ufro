import connectDB from '../../config/mongo.js';
import request from 'supertest';
import mongoose from 'mongoose';
import { expect } from 'chai';
import app from '../../app.js';
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

describe('Controlador de Asignaturas (Integración)', () => {
  let semester;

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

  afterEach(async () => {
    await Semester.deleteMany({});
    await Subject.deleteMany({});
  });

  describe('Crear Asignatura', () => {
    it('debería crear una asignatura exitosamente', async () => {
      const subjectData = {
        name: 'Matemáticas',
        grades: [90, 85, 78],
        events: [],
      };

      const response = await request(app)
        .post(`/api/subjects/${semester._id}`)
        .send(subjectData)
        .expect(201);

      expect(response.body.message).to.equal('Asignatura creada exitosamente');
      expect(response.body.subject).to.have.property('_id');
      expect(response.body.subject.name).to.equal(subjectData.name);
    });
  });

  describe('Obtener Asignatura', () => {
    it('debería obtener una asignatura por ID', async () => {
      const subject = await Subject.create({
        name: 'Matemáticas',
        grades: [90, 85, 78],
        events: [],
      });

      const response = await request(app)
        .get(`/api/subjects/${subject._id}`)
        .expect(200);

      expect(response.body).to.have.property('_id').that.equals(subject._id.toString());
      expect(response.body.name).to.equal('Matemáticas');
    });
  });

  describe('Actualizar Asignatura', () => {
    it('debería actualizar una asignatura exitosamente', async () => {
      const subject = await Subject.create({
        name: 'Matemáticas',
        grades: [90, 85, 78],
        events: [],
      });

      const response = await request(app)
        .put(`/api/subjects/${subject._id}`)
        .send({ name: 'Matemáticas Avanzadas' })
        .expect(200);

      expect(response.body.subject.name).to.equal('Matemáticas Avanzadas');
    });
  });

  describe('Eliminar Asignatura', () => {
    it('debería eliminar una asignatura y actualizar el semestre', async () => {
      const subject = await Subject.create({
        name: 'Matemáticas',
        grades: [90, 85, 78],
        events: [],
      });

      await Semester.findByIdAndUpdate(semester._id, { $push: { subjects: subject._id } });

      const response = await request(app)
        .delete(`/api/subjects/${subject._id}/semester/${semester._id}`)
        .expect(200);

      expect(response.body.message).to.equal('Asignatura eliminada y actualizada en el semestre');

      const checkDeleted = await Subject.findById(subject._id);
      expect(checkDeleted).to.be.null;
    });
  });
});
