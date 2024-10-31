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
import Event from '../../schemas/event.schema.js';
import Semester from '../../schemas/semester.schema.js';

jest.mock('../../schemas/subject.schema.js');
jest.mock('../../schemas/event.schema.js');
jest.mock('../../schemas/semester.schema.js');

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
    it('debería crear una asignatura exitosamente y asignarla al semestre', async () => {
        const req = mockRequest({ name: 'Matemáticas' }, { semesterId: 'sem123' });
        const res = mockResponse();
    
        // Mock de Subject
        const newSubject = { _id: 'subjectId', name: 'Matemáticas' };
        Subject.mockImplementation(() => ({
          save: jest.fn().mockResolvedValue(newSubject),
        }));
    
        // Mock de Semester
        Semester.findByIdAndUpdate.mockResolvedValue({
          subjects: ['subjectId'],
        });
    
        await createSubject(req, res);
    
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Asignatura creada exitosamente',
          subject: newSubject,
        });
        expect(Semester.findByIdAndUpdate).toHaveBeenCalledWith(
          req.params.semesterId,
          { $push: { subjects: newSubject._id } }, 
          { new: true }
        );
      });

    it('debería devolver un error al crear la asignatura', async () => {
      const req = mockRequest({ name: 'Matemáticas' });
      const res = mockResponse();

      Subject.mockImplementation(() => {
        throw new Error('Error');
      });

      await createSubject(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al crear la asignatura',
      });
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
      expect(res.json).toHaveBeenCalledWith({
        message: 'Asignatura no encontrada',
      });
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
    it('debería eliminar una asignatura y actualizar el semestre', async () => {
        const req = mockRequest({}, { id: '123', semesterId: 'sem123' });
        const res = mockResponse();
    
        Subject.findByIdAndDelete.mockResolvedValue(true);
        Semester.findByIdAndUpdate.mockResolvedValue({
          subjects: [],
        });
    
        await deleteSubject(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Asignatura eliminada y actualizada en el semestre',
          semester: { subjects: [] }, 
        });
        expect(Semester.findByIdAndUpdate).toHaveBeenCalledWith(
          req.params.semesterId,
          { $pull: { subjects: req.params.id } },
          { new: true }
        );
      });

    it('debería devolver 404 si la asignatura no existe', async () => {
      const req = mockRequest({}, { id: '123' });
      const res = mockResponse();

      Subject.findByIdAndDelete.mockResolvedValue(null);

      await deleteSubject(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Asignatura no encontrada',
      });
    });
  });

  // 6. Añadir Evento a Asignatura
  describe('addEventToSubject', () => {
    it('debería añadir un evento a la asignatura', async () => {
      const req = mockRequest(
        { event: { type: 'evaluado', grade: 85 } },
        { id: '123' }
      );
      const res = mockResponse();
      const updatedSubject = {
        _id: '123',
        events: [{ type: 'evaluado', grade: 85 }],
      };

      Subject.findByIdAndUpdate.mockResolvedValue(updatedSubject);

      await addEventToSubject(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Evento añadido',
        subject: updatedSubject,
      });
    });
  });

  // 7. Calcular promedio asignatura
  describe('calculateSubjectAverage', () => {
    it('debería calcular el promedio ponderado correctamente y devolverlo en la respuesta', async () => {
      const subject = {
        _id: 'subjectId',
        events: ['eventId1', 'eventId2'],
      };

      Subject.findById.mockResolvedValue(subject);

      Event.find.mockResolvedValue([
        { type: 'evaluado', grade: 90, weight: 50 },
        { type: 'evaluado', grade: 80, weight: 50 },
      ]);

      const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn();
        return res;
      };

      const req = { params: { id: 'subjectId' } };
      const res = mockResponse();

      await calculateSubjectAverage(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Promedio calculado',
        average: 85,
      });
    });

    it('debería devolver 404 si no se proporciona la asignatura', async () => {
      Subject.findById.mockResolvedValue(null);

      const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn();
        return res;
      };

      const req = { params: { id: 'subjectId' } };
      const res = mockResponse();

      await calculateSubjectAverage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Asignatura no encontrada',
      });
    });
  });
});
