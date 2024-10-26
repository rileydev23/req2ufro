import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import Semester from '../../schemas/semester.schema.js';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
  await Semester.deleteMany({});
});

afterEach(async () => {
  await Semester.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Controlador de Semestres (Integración)', () => {
  describe('Crear Semestre', () => {
    it('debería crear un semestre exitosamente', async () => {
      const semestreData = {
        name: 'Semestre 1',
        year: 2024,
        startDate: '2024-03-01',
        endDate: '2024-07-01',
        subjects: [
          { name: 'Matemáticas', grades: [90, 85] },
          { name: 'Historia', grades: [] },
        ],
        owner: new mongoose.Types.ObjectId(),
        users: [],
      };

      const response = await request(app)
        .post('/api/semester')
        .send(semestreData)
        .expect(201);

      expect(response.body.message).toBe('Semestre creado exitosamente');
      expect(response.body.semester).toHaveProperty('_id');
      expect(response.body.semester.name).toBe(semestreData.name);
      expect(response.body.semester.year).toBe(semestreData.year);
      expect(response.body.semester.subjects).toHaveLength(2);
    });
  });

  describe('Obtener un semestre', () => {
    it('debería obtener un semestre por ID', async () => {
      const semestre = await Semester.create({
        name: 'Semestre 1',
        year: 2024,
        startDate: '2024-03-01',
        endDate: '2024-07-01',
        subjects: [{ name: 'Matemáticas', grades: [90, 85] }],
        owner: new mongoose.Types.ObjectId(),
        users: [],
      });

      const response = await request(app)
        .get(`/api/semester/${semestre._id}`)
        .expect(200);

      expect(response.body).toHaveProperty('_id', semestre._id.toString());
      expect(response.body.name).toBe('Semestre 1');
    });

    it('debería devolver un error si el semestre no se encuentra', async () => {
      const response = await request(app)
        .get('/api/semester/609b4b64b3c1b2a0f0b85c1a')
        .expect(404);

      expect(response.body.message).toBe('Semestre no encontrado');
    });
  });

  describe('Editar un semestre', () => {
    it('debería actualizar un semestre exitosamente', async () => {
      const semestre = await Semester.create({
        name: 'Semestre 1',
        year: 2024,
        startDate: '2024-03-01',
        endDate: '2024-07-01',
        subjects: [{ name: 'Matemáticas', grades: [90, 85] }],
        owner: new mongoose.Types.ObjectId(),
        users: [],
      });

      const response = await request(app)
        .put(`/api/semester/${semestre._id}`)
        .send({ name: 'Semestre 1 Actualizado', year: 2024 })
        .expect(200);

      expect(response.body.semester.name).toBe('Semestre 1 Actualizado');
    });

    it('debería devolver un error si el semestre a editar no se encuentra', async () => {
      const response = await request(app)
        .put('/api/semester/609b4b64b3c1b2a0f0b85c1a')
        .send({ name: 'Semestre Inexistente' })
        .expect(404);

      expect(response.body.message).toBe('Semestre no encontrado');
    });
  });

  describe('Eliminar un semestre', () => {
    it('debería eliminar un semestre exitosamente', async () => {
      const semestre = await Semester.create({
        name: 'Semestre 1',
        year: 2024,
        startDate: '2024-03-01',
        endDate: '2024-07-01',
        subjects: [{ name: 'Matemáticas', grades: [90, 85] }],
        owner: new mongoose.Types.ObjectId(),
        users: [],
      });

      const response = await request(app)
        .delete(`/api/semester/${semestre._id}`)
        .expect(200);

      expect(response.body.message).toBe('Semestre eliminado');

      const checkDeleted = await Semester.findById(semestre._id);
      expect(checkDeleted).toBeNull();
    });

    it('debería devolver un error si el semestre a eliminar no se encuentra', async () => {
      const response = await request(app)
        .delete('/api/semester/609b4b64b3c1b2a0f0b85c1a')
        .expect(404);

      expect(response.body.message).toBe('Semestre no encontrado');
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
      expect(weeks).toBe(18);
    });
  });
});
