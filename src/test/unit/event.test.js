import {
    createEvent,
    getEventById,
    getAllEvents,
    updateEvent,
    deleteEvent,
    isEvaluatedEvent
  } from '../../controllers/event.controller.js';
  import Event from '../../schemas/event.schema.js';
  import { expect } from 'chai';
  import sinon from 'sinon';
  
  describe('Controlador de Eventos (Events)', () => {
    const mockRequest = (body = {}, params = {}) => ({ body, params });
    const mockResponse = () => {
      const res = {};
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      return res;
    };
  
    afterEach(() => sinon.restore());
  
    // 1. Crear Evento
    describe('createEvent', () => {
      it('debería crear un evento exitosamente', async () => {
        const req = mockRequest({ title: 'Examen Final', type: 'evaluado', weight: 50, date: '2024-07-01' });
        const res = mockResponse();
  
        sinon.stub(Event.prototype, 'save').resolves(req.body);
  
        await createEvent(req, res);
  
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith({
          message: 'Evento creado exitosamente',
          event: req.body,
        })).to.be.true;
      });
  
      it('debería devolver un error al crear el evento', async () => {
        const req = mockRequest({ title: 'Examen Final' });
        const res = mockResponse();
  
        sinon.stub(Event.prototype, 'save').throws(new Error('Error'));
  
        await createEvent(req, res);
  
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ error: 'Error al crear el evento' })).to.be.true;
      });
    });
  
    // 2. Obtener Evento por ID
    describe('getEventById', () => {
      it('debería obtener un evento por ID', async () => {
        const req = mockRequest({}, { id: '123' });
        const res = mockResponse();
        const eventData = { _id: '123', title: 'Examen Final', type: 'evaluado' };
  
        sinon.stub(Event, 'findById').resolves(eventData);
  
        await getEventById(req, res);
  
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(eventData)).to.be.true;
      });
  
      it('debería devolver 404 si el evento no existe', async () => {
        const req = mockRequest({}, { id: '123' });
        const res = mockResponse();
  
        sinon.stub(Event, 'findById').resolves(null);
  
        await getEventById(req, res);
  
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'Evento no encontrado' })).to.be.true;
      });
    });
  
    // 3. Obtener Todos los Eventos
    describe('getAllEvents', () => {
      it('debería obtener todos los eventos', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const events = [{ _id: '123', title: 'Examen Final' }];
  
        sinon.stub(Event, 'find').resolves(events);
  
        await getAllEvents(req, res);
  
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(events)).to.be.true;
      });
    });
  
    // 4. Actualizar Evento
    describe('updateEvent', () => {
      it('debería actualizar un evento exitosamente', async () => {
        const req = mockRequest({ title: 'Examen Actualizado' }, { id: '123' });
        const res = mockResponse();
        const updatedEvent = { _id: '123', title: 'Examen Actualizado' };
  
        sinon.stub(Event, 'findByIdAndUpdate').resolves(updatedEvent);
  
        await updateEvent(req, res);
  
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({
          message: 'Evento actualizado',
          event: updatedEvent,
        })).to.be.true;
      });
    });
  
    // 5. Eliminar Evento
    describe('deleteEvent', () => {
      it('debería eliminar un evento', async () => {
        const req = mockRequest({}, { id: '123' });
        const res = mockResponse();
  
        sinon.stub(Event, 'findByIdAndDelete').resolves(true);
  
        await deleteEvent(req, res);
  
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ message: 'Evento eliminado' })).to.be.true;
      });
  
      it('debería devolver 404 si el evento no existe', async () => {
        const req = mockRequest({}, { id: '123' });
        const res = mockResponse();
  
        sinon.stub(Event, 'findByIdAndDelete').resolves(null);
  
        await deleteEvent(req, res);
  
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'Evento no encontrado' })).to.be.true;
      });
    });
  
    // 6. Verificar si el Evento es Evaluado
    describe('isEvaluatedEvent', () => {
      it('debería devolver true para un evento evaluado', async () => {
        const req = { params: { id: 'evento123' } };
        const res = mockResponse();
  
        const mockEvent = { _id: 'evento123', type: 'evaluado' };
        sinon.stub(Event, 'findById').resolves(mockEvent);
  
        await isEvaluatedEvent(req, res);
  
        expect(Event.findById.calledWith('evento123')).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({
          message: 'Evaluación del tipo de evento',
          isEvaluated: true,
        })).to.be.true;
      });
  
      it('debería devolver false para un evento no evaluado', async () => {
        const req = { params: { id: 'evento456' } };
        const res = mockResponse();
  
        const mockEvent = { _id: 'evento456', type: 'no_evaluado' };
        sinon.stub(Event, 'findById').resolves(mockEvent);
  
        await isEvaluatedEvent(req, res);
  
        expect(Event.findById.calledWith('evento456')).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({
          message: 'Evaluación del tipo de evento',
          isEvaluated: false,
        })).to.be.true;
      });
  
      it('debería devolver 404 si el evento no existe', async () => {
        const req = { params: { id: 'evento789' } };
        const res = mockResponse();
  
        sinon.stub(Event, 'findById').resolves(null);
  
        await isEvaluatedEvent(req, res);
  
        expect(Event.findById.calledWith('evento789')).to.be.true;
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'Evento no encontrado' })).to.be.true;
      });
    });
  });
  