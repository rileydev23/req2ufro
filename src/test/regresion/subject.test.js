import connectDB from '../../config/mongo.js';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import { expect } from 'chai';
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

describe('Pruebas de Regresión para Asignaturas', () => {
  let semester;
  let subject;

  beforeEach(async () => {
    await Semester.deleteMany({});
    await Subject.deleteMany({});
    semester = await Semester.create({
      name: 'Semestre de prueba',
      year: 2024,
      startDate: '2024-03-01',
      endDate: '2024-07-01',
      subjects: [],
      owner: new mongoose.Types.ObjectId(),
      users: [],
    });
    subject = await Subject.create({
      name: 'Matemáticas',
      grades: [90, 85, 78],
      events: [],
    });
  });

  it('debería crear una asignatura con los datos correctos', async () => {
    const subjectData = { name: 'Ciencias' };
    const response = await request(app).post(`/api/subjects/${semester._id}`).send(subjectData);
    expect(response.body.subject.name).to.equal(subjectData.name);
    expect(response.body.subject.grades).to.deep.equal(subjectData.grades);
  });

  it('debería obtener la asignatura con el nombre correcto', async () => {
    const response = await request(app).get(`/api/subjects/${subject._id}`);
    expect(response.body.name).to.equal(subject.name);
  });

  it('debería actualizar el nombre de la asignatura', async () => {
    const response = await request(app).put(`/api/subjects/${subject._id}`).send({ name: 'Historia' });
    expect(response.body.subject.name).to.equal('Historia');
  });

  it('debería eliminar la asignatura del semestre', async () => {
    await Semester.findByIdAndUpdate(semester._id, { $push: { subjects: subject._id } });
    const response = await request(app).delete(`/api/subjects/${subject._id}/semester/${semester._id}`);
    expect(response.body.message).to.equal('Asignatura eliminada y actualizada en el semestre');
  });
});
