import connectDB from '../../config/mongo.js';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import { expect } from 'chai';
import Event from '../../schemas/event.schema.js';

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

describe('Pruebas de Humo para Eventos', () => {
  afterEach(async () => {
    await Event.deleteMany({});
  });

  it('debería responder al intentar crear un evento', async () => {
    const response = await request(app).post('/api/events').send({
      title: 'Evento de Prueba',
      type: 'evaluado',
      date: '2024-05-01',
      grade: 90,
      weight: 0.5,
    });
    expect(response.status).to.not.equal(500); 
  });

  it('debería responder al intentar obtener un evento', async () => {
    const event = await Event.create({
      title: 'Evento de Prueba',
      type: 'evaluado',
      date: '2024-05-01',
      grade: 90,
      weight: 0.5,
    });

    const response = await request(app).get(`/api/events/${event._id}`);
    expect(response.status).to.not.equal(500);
  });

  it('debería responder al intentar actualizar un evento', async () => {
    const event = await Event.create({
      title: 'Evento de Prueba',
      type: 'evaluado',
      date: '2024-05-01',
      grade: 90,
      weight: 0.5,
    });

    const response = await request(app).put(`/api/events/${event._id}`).send({
      title: 'Evento Actualizado',
    });
    expect(response.status).to.not.equal(500);
  });

  it('debería responder al intentar eliminar un evento', async () => {
    const event = await Event.create({
      title: 'Evento de Prueba',
      type: 'evaluado',
      date: '2024-05-01',
      grade: 90,
      weight: 0.5,
    });

    const response = await request(app).delete(`/api/events/${event._id}`);
    expect(response.status).to.not.equal(500);
  });
});
