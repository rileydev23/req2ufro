import {
    createEvent,
    getEventById,
    getAllEvents,
    updateEvent,
    deleteEvent,
    isEvaluatedEvent,
    calculateEventWeight,
  } from '../../controllers/event.controller.js';
  import Event from '../../schemas/event.schema.js';
  
  jest.mock('../../schemas/event.schema.js');
  
  describe('Controlador de Eventos (Events)', () => {
    const mockRequest = (body = {}, params = {}) => ({ body, params });
    const mockResponse = () => {
      const res = {};
      res.status = jest.fn().mockReturnThis();
      res.json = jest.fn().mockReturnThis();
      return res;
    };
  
    afterEach(() => jest.clearAllMocks());
  
    // 1. Crear Evento
    describe('createEvent', () => {
      it('debería crear un evento exitosamente', async () => {
        const req = mockRequest({ title: 'Examen Final', type: 'evaluado', weight: 50, date: '2024-07-01' });
        const res = mockResponse();
  
        Event.mockImplementation(() => ({
          save: jest.fn().mockResolvedValue(req.body),
        }));
  
        await createEvent(req, res);
  
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Evento creado exitosamente',
          event: req.body,
        });
      });
  
      it('debería devolver un error al crear el evento', async () => {
        const req = mockRequest({ title: 'Examen Final' });
        const res = mockResponse();
  
        Event.mockImplementation(() => {
          throw new Error('Error');
        });
  
        await createEvent(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error al crear el evento' });
      });
    });
  
    // 2. Obtener Evento por ID
    describe('getEventById', () => {
      it('debería obtener un evento por ID', async () => {
        const req = mockRequest({}, { id: '123' });
        const res = mockResponse();
        const eventData = { _id: '123', title: 'Examen Final', type: 'evaluado' };
  
        Event.findById.mockResolvedValue(eventData);
  
        await getEventById(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(eventData);
      });
  
      it('debería devolver 404 si el evento no existe', async () => {
        const req = mockRequest({}, { id: '123' });
        const res = mockResponse();
  
        Event.findById.mockResolvedValue(null);
  
        await getEventById(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Evento no encontrado' });
      });
    });
  
    // 3. Obtener Todos los Eventos
    describe('getAllEvents', () => {
      it('debería obtener todos los eventos', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const events = [{ _id: '123', title: 'Examen Final' }];
  
        Event.find.mockResolvedValue(events);
  
        await getAllEvents(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(events);
      });
    });
  
    // 4. Actualizar Evento
    describe('updateEvent', () => {
      it('debería actualizar un evento exitosamente', async () => {
        const req = mockRequest({ title: 'Examen Actualizado' }, { id: '123' });
        const res = mockResponse();
        const updatedEvent = { _id: '123', title: 'Examen Actualizado' };
  
        Event.findByIdAndUpdate.mockResolvedValue(updatedEvent);
  
        await updateEvent(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Evento actualizado',
          event: updatedEvent,
        });
      });
    });
  
    // 5. Eliminar Evento
    describe('deleteEvent', () => {
      it('debería eliminar un evento', async () => {
        const req = mockRequest({}, { id: '123' });
        const res = mockResponse();
  
        Event.findByIdAndDelete.mockResolvedValue(true);
  
        await deleteEvent(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Evento eliminado' });
      });
  
      it('debería devolver 404 si el evento no existe', async () => {
        const req = mockRequest({}, { id: '123' });
        const res = mockResponse();
  
        Event.findByIdAndDelete.mockResolvedValue(null);
  
        await deleteEvent(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Evento no encontrado' });
      });
    });
  
    // 6. Verificar si el Evento es Evaluado
    describe('isEvaluatedEvent', () => {
      it('debería devolver true para un evento evaluado', () => {
        const event = { type: 'evaluado' };
  
        const result = isEvaluatedEvent(event);
        expect(result).toBe(true);
      });
  
      it('debería devolver false para un evento no evaluado', () => {
        const event = { type: 'recordatorio' };
  
        const result = isEvaluatedEvent(event);
        expect(result).toBe(false);
      });
    });
  
    // 7. Calcular Peso Total de Eventos Evaluados
    describe('calculateEventWeight', () => {
      it('debería calcular correctamente el peso total de los eventos', () => {
        const events = [
          { type: 'evaluado', weight: 50 },
          { type: 'evaluado', weight: 30 },
        ];
  
        const totalWeight = calculateEventWeight(events);
        expect(totalWeight).toBe(80);
      });
    });
  });
  