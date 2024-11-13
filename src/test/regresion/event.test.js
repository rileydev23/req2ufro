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

describe('Pruebas de Regresión para Eventos', () => {
  let event;

  beforeEach(async () => {
    await Event.deleteMany({});
    event = await Event.create({
      title: 'Evento 1',
      type: 'evaluado',
      date: '2024-05-01',
      grade: 95,
      weight: 0.5,
    });
  });

  it('debería crear un evento con los datos correctos', async () => {
    const eventData = { title: 'Evento 2', type: 'evaluado', date: '2024-06-01', grade: 88, weight: 0.4 };
    const response = await request(app).post('/api/events').send(eventData);
    expect(response.body.event.title).to.equal(eventData.title);
    expect(response.body.event.grade).to.equal(eventData.grade);
  });

  it('debería obtener el evento por ID', async () => {
    const response = await request(app).get(`/api/events/${event._id}`);
    expect(response.body.title).to.equal(event.title);
  });

  it('debería actualizar el título del evento', async () => {
    const response = await request(app).put(`/api/events/${event._id}`).send({ title: 'Evento Modificado' });
    expect(response.body.event.title).to.equal('Evento Modificado');
  });

  it('debería eliminar el evento exitosamente', async () => {
    const response = await request(app).delete(`/api/events/${event._id}`);
    expect(response.body.message).to.equal('Evento eliminado');
  });
});
