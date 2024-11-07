import connectDB from '../../config/mongo.js';
import request from 'supertest';
import mongoose from 'mongoose';
import { expect } from 'chai';
import app from '../../app.js';
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

describe('Controlador de Eventos (Integración)', () => {
  describe('Crear Evento', () => {
    it('debería crear un evento exitosamente', async () => {
      const eventData = {
        title: 'Evento 1',
        type: 'evaluado',
        date: '2024-05-01',
        grade: 95,
        weight: 0.5,
      };

      const response = await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(201);

      expect(response.body.message).to.equal('Evento creado exitosamente');
      expect(response.body.event).to.have.property('_id');
      expect(response.body.event.title).to.equal(eventData.title);
    });
  });

  describe('Obtener Evento', () => {
    it('debería obtener un evento por ID', async () => {
      const event = await Event.create({
        title: 'Evento 1',
        type: 'evaluado',
        date: '2024-05-01',
        grade: 95,
        weight: 0.5,
      });

      const response = await request(app)
        .get(`/api/events/${event._id}`)
        .expect(200);

      expect(response.body).to.have.property('_id').that.equals(event._id.toString());
      expect(response.body.title).to.equal('Evento 1');
    });

    it('debería devolver un error si el evento no se encuentra', async () => {
      const response = await request(app)
        .get('/api/events/609b4b64b3c1b2a0f0b85c1a')
        .expect(404);

      expect(response.body.message).to.equal('Evento no encontrado');
    });
  });

  describe('Actualizar Evento', () => {
    it('debería actualizar un evento exitosamente', async () => {
      const event = await Event.create({
        title: 'Evento 1',
        type: 'evaluado',
        date: '2024-05-01',
        grade: 95,
        weight: 0.5,
      });

      const response = await request(app)
        .put(`/api/events/${event._id}`)
        .send({ title: 'Evento Actualizado' })
        .expect(200);

      expect(response.body.event.title).to.equal('Evento Actualizado');
    });
  });

  describe('Eliminar Evento', () => {
    it('debería eliminar un evento exitosamente', async () => {
      const event = await Event.create({
        title: 'Evento 1',
        type: 'evaluado',
        date: '2024-05-01',
        grade: 95,
        weight: 0.5,
      });

      const response = await request(app)
        .delete(`/api/events/${event._id}`)
        .expect(200);

      expect(response.body.message).to.equal('Evento eliminado');
      const checkDeleted = await Event.findById(event._id);
      expect(checkDeleted).to.be.null;
    });
  });
});
