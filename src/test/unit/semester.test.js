import { createSemester, getSemester, editSemester, deleteSemester, getAllSemesters } from '../../controllers/semester.controller.js';
import Semester from '../../schemas/semester.schema.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('Controlador de Semestres (Unitarias)', () => {
  const mockResponse = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
  };

  const mockRequest = (body = {}, params = {}) => ({
    body,
    params,
  });

  afterEach(() => {
    sinon.restore(); // Restaurar los mocks después de cada prueba
  });

  describe('Crear Semestre', () => {
    it('debería crear un semestre exitosamente', async () => {
      const req = mockRequest({ name: 'Semestre 1', year: 2024, subjects: [] });
      const res = mockResponse();

      sinon.stub(Semester.prototype, 'save').resolves(req.body);

      await createSemester(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({
        message: 'Semestre creado exitosamente',
        semestre: req.body,
      })).to.be.true;
    });

    it('debería devolver un error al crear un semestre si ocurre un problema', async () => {
      const req = mockRequest({ name: 'Semestre 1', year: 2024 });
      const res = mockResponse();

      sinon.stub(Semester.prototype, 'save').throws(new Error('Error'));

      await createSemester(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Error al crear el semestre', details: 'Error' })).to.be.true;
    });
  });

  describe('Obtener un semestre', () => {
    it('debería obtener un semestre exitosamente', async () => {
      const req = mockRequest({}, { id: '12345' });
      const res = mockResponse();
      const semesterData = { _id: '12345', name: 'Semestre 1', year: 2024 };

      sinon.stub(Semester, 'findById').resolves(semesterData);

      await getSemester(req, res);

      expect(res.json.calledWith(semesterData)).to.be.true;
    });

    it('debería devolver un error si el semestre no se encuentra', async () => {
      const req = mockRequest({}, { id: '12345' });
      const res = mockResponse();

      sinon.stub(Semester, 'findById').resolves(null);

      await getSemester(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Semestre no encontrado' })).to.be.true;
    });
  });

  describe('Editar un semestre', () => {
    it('debería actualizar un semestre exitosamente', async () => {
      const req = mockRequest({ name: 'Semestre 1 Actualizado', year: 2024 }, { id: '12345' });
      const res = mockResponse();
      const semesterData = { _id: '12345', name: 'Semestre 1', year: 2024 };

      sinon.stub(Semester, 'findByIdAndUpdate').resolves(semesterData);

      await editSemester(req, res);

      expect(res.json.calledWith({ message: 'Semestre actualizado', semestre: semesterData })).to.be.true;
    });

    it('debería devolver un error si el semestre a editar no se encuentra', async () => {
      const req = mockRequest({ name: 'Semestre Inexistente' }, { id: '12345' });
      const res = mockResponse();

      sinon.stub(Semester, 'findByIdAndUpdate').resolves(null);

      await editSemester(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Semestre no encontrado' })).to.be.true;
    });
  });

  describe('Eliminar un semestre', () => {
    it('debería eliminar un semestre exitosamente', async () => {
      const req = mockRequest({}, { id: '12345' });
      const res = mockResponse();
      const semesterData = { _id: '12345', name: 'Semestre 1', year: 2024 };

      sinon.stub(Semester, 'findByIdAndDelete').resolves(semesterData);

      await deleteSemester(req, res);

      expect(res.json.calledWith({ message: 'Semestre eliminado' })).to.be.true;
    });

    it('debería devolver un error si el semestre a eliminar no se encuentra', async () => {
      const req = mockRequest({}, { id: '12345' });
      const res = mockResponse();

      sinon.stub(Semester, 'findByIdAndDelete').resolves(null);

      await deleteSemester(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Semestre no encontrado' })).to.be.true;
    });
  });

  describe('Obtener todos los semestres', () => {
    it('debería obtener todos los semestres', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const semesterList = [{ _id: '12345', name: 'Semestre 1', year: 2024 }];

      sinon.stub(Semester, 'find').resolves(semesterList);

      await getAllSemesters(req, res);

      expect(res.json.calledWith(semesterList)).to.be.true;
    });

    it('debería devolver un error si ocurre un problema al obtener los semestres', async () => {
      const req = mockRequest();
      const res = mockResponse();

      sinon.stub(Semester, 'find').throws(new Error('Error'));

      await getAllSemesters(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Error al obtener los semestres', details: 'Error' })).to.be.true;
    });
  });
});
