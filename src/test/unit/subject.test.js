import {
    createSubject,
    getSubjectById,
    getAllSubjects,
    updateSubject,
    deleteSubject,
    addEventToSubject,
    calculateSubjectAverage,
  } from '../../controllers/subject.controller.js';
  import Subject from '../../schemas/subject.schema.js';
  
  jest.mock('../../schemas/subject.schema.js');
  
  describe('Controlador de Asignaturas (Subjects)', () => {
    const mockRequest = (body = {}, params = {}) => ({ body, params });
    const mockResponse = () => {
      const res = {};
      res.status = jest.fn().mockReturnThis();
      res.json = jest.fn().mockReturnThis();
      return res;
    };
  
    afterEach(() => jest.clearAllMocks());
  
    // 1. Crear Asignatura
    describe('createSubject', () => {
      it('debería crear una asignatura exitosamente', async () => {
        const req = mockRequest({ name: 'Matemáticas', grades: [] });
        const res = mockResponse();
  
        Subject.mockImplementation(() => ({
          save: jest.fn().mockResolvedValue(req.body),
        }));
  
        await createSubject(req, res);
  
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Asignatura creada exitosamente',
          subject: req.body,
        });
      });
  
      it('debería devolver un error al crear la asignatura', async () => {
        const req = mockRequest({ name: 'Matemáticas' });
        const res = mockResponse();
  
        Subject.mockImplementation(() => {
          throw new Error('Error');
        });
  
        await createSubject(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error al crear la asignatura' });
      });
    });
  
    // 2. Obtener Asignatura por ID
    describe('getSubjectById', () => {
      it('debería obtener una asignatura por ID', async () => {
        const req = mockRequest({}, { id: '123' });
        const res = mockResponse();
        const subjectData = { _id: '123', name: 'Matemáticas' };
  
        Subject.findById.mockResolvedValue(subjectData);
  
        await getSubjectById(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(subjectData);
      });
  
      it('debería devolver 404 si la asignatura no existe', async () => {
        const req = mockRequest({}, { id: '123' });
        const res = mockResponse();
  
        Subject.findById.mockResolvedValue(null);
  
        await getSubjectById(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Asignatura no encontrada' });
      });
    });
  
    // 3. Obtener Todas las Asignaturas
    describe('getAllSubjects', () => {
      it('debería obtener todas las asignaturas', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const subjects = [{ _id: '123', name: 'Matemáticas' }];
  
        Subject.find.mockResolvedValue(subjects);
  
        await getAllSubjects(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(subjects);
      });
    });
  
    // 4. Actualizar Asignatura
    describe('updateSubject', () => {
      it('debería actualizar una asignatura exitosamente', async () => {
        const req = mockRequest({ name: 'Matemáticas Avanzadas' }, { id: '123' });
        const res = mockResponse();
        const updatedSubject = { _id: '123', name: 'Matemáticas Avanzadas' };
  
        Subject.findByIdAndUpdate.mockResolvedValue(updatedSubject);
  
        await updateSubject(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Asignatura actualizada',
          subject: updatedSubject,
        });
      });
    });
  
    // 5. Eliminar Asignatura
    describe('deleteSubject', () => {
      it('debería eliminar una asignatura', async () => {
        const req = mockRequest({}, { id: '123' });
        const res = mockResponse();
  
        Subject.findByIdAndDelete.mockResolvedValue(true);
  
        await deleteSubject(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Asignatura eliminada' });
      });
  
      it('debería devolver 404 si la asignatura no existe', async () => {
        const req = mockRequest({}, { id: '123' });
        const res = mockResponse();
  
        Subject.findByIdAndDelete.mockResolvedValue(null);
  
        await deleteSubject(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Asignatura no encontrada' });
      });
    });
  
    // 6. Añadir Evento a Asignatura
    describe('calculateSubjectAverage', () => {
        it('debería calcular el promedio ponderado correctamente y devolverlo en la respuesta', async () => {
          const subject = new Subject({
            events: [
              { type: 'evaluado', grade: 90, weight: 50 },
              { type: 'evaluado', grade: 80, weight: 50 },
            ],
          });
      
          const mockResponse = () => {
            const res = {};
            res.status = jest.fn().mockReturnThis();
            res.json = jest.fn();
            return res;
          };
          const res = mockResponse();
          await calculateSubjectAverage(subject, res);
      
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({
            message: 'Promedio calculado',
            average: 85,
          });
        });
      
        it('debería devolver 404 si no se proporciona la asignatura', async () => {
          const mockResponse = () => {
            const res = {};
            res.status = jest.fn().mockReturnThis();
            res.json = jest.fn();
            return res;
          };
          const res = mockResponse();
      
          await calculateSubjectAverage(null, res);
      
          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.json).toHaveBeenCalledWith({ message: 'Asignatura no encontrada' });
        });
      });
      
  });
  