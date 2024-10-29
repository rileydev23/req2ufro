import { createSemester, getSemester, editSemester, deleteSemester, getAllSemesters } from '../../controllers/semester.controller.js'; 
import Semester from '../../schemas/semester.schema.js'; 

jest.mock('../../schemas/semester.schema.js'); // Simular el modelo de Mongoose

describe('Controlador de Semestres (Unitarias)', () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };

  const mockRequest = (body = {}, params = {}) => ({
    body,
    params,
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpiar los mocks después de cada prueba
  });

  describe('Crear Semestre', () => {
    it('debería crear un semestre exitosamente', async () => {
      const req = mockRequest({ name: 'Semestre 1', year: 2024, subjects: [] });
      const res = mockResponse();

      Semester.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(req.body),
      }));

      await createSemester(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Semestre creado exitosamente',
        semestre: req.body,
      });
    });

    it('debería devolver un error al crear un semestre si ocurre un problema', async () => {
      const req = mockRequest({ name: 'Semestre 1', year: 2024 });
      const res = mockResponse();

      Semester.mockImplementation(() => {
        throw new Error('Error');
      });

      await createSemester(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al crear el semestre', details: 'Error' });
    });
  });

  describe('Obtener un semestre', () => {
    it('debería obtener un semestre exitosamente', async () => {
      const req = mockRequest({}, { id: '12345' });
      const res = mockResponse();
      const semesterData = { _id: '12345', name: 'Semestre 1', year: 2024 };

      Semester.findById = jest.fn().mockResolvedValue(semesterData);

      await getSemester(req, res);

      expect(res.json).toHaveBeenCalledWith(semesterData);
    });

    it('debería devolver un error si el semestre no se encuentra', async () => {
      const req = mockRequest({}, { id: '12345' });
      const res = mockResponse();

      Semester.findById = jest.fn().mockResolvedValue(null);

      await getSemester(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Semestre no encontrado'});
    });
  });

  describe('Editar un semestre', () => {
    it('debería actualizar un semestre exitosamente', async () => {
      const req = mockRequest({ name: 'Semestre 1 Actualizado', year: 2024 }, { id: '12345' });
      const res = mockResponse();
      const semesterData = { _id: '12345', name: 'Semestre 1', year: 2024 };

      Semester.findByIdAndUpdate = jest.fn().mockResolvedValue(semesterData);

      await editSemester(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Semestre actualizado', semestre: semesterData });
    });

    it('debería devolver un error si el semestre a editar no se encuentra', async () => {
      const req = mockRequest({ name: 'Semestre Inexistente' }, { id: '12345' });
      const res = mockResponse();

      Semester.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await editSemester(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Semestre no encontrado' });
    });
  });

  describe('Eliminar un semestre', () => {
    it('debería eliminar un semestre exitosamente', async () => {
      const req = mockRequest({}, { id: '12345' });
      const res = mockResponse();
      const semesterData = { _id: '12345', name: 'Semestre 1', year: 2024 };

      Semester.findByIdAndDelete = jest.fn().mockResolvedValue(semesterData);

      await deleteSemester(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Semestre eliminado' });
    });

    it('debería devolver un error si el semestre a eliminar no se encuentra', async () => {
      const req = mockRequest({}, { id: '12345' });
      const res = mockResponse();

      Semester.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await deleteSemester(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Semestre no encontrado'});
    });
  });

  describe('Obtener todos los semestres', () => {
    it('debería obtener todos los semestres', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const semesterList = [{ _id: '12345', name: 'Semestre 1', year: 2024 }];

      Semester.find = jest.fn().mockResolvedValue(semesterList);

      await getAllSemesters(req, res);

      expect(res.json).toHaveBeenCalledWith(semesterList);
    });

    it('debería devolver un error si ocurre un problema al obtener los semestres', async () => {
      const req = mockRequest();
      const res = mockResponse();

      Semester.find = jest.fn().mockImplementation(() => {
        throw new Error('Error');
      });

      await getAllSemesters(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al obtener los semestres'});
    });
  });
});
