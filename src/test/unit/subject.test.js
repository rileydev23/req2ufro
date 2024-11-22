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
  import { expect } from 'chai';
  import sinon from 'sinon';
  
  describe('Controlador de Asignaturas (Subjects)', () => {
    let sandbox;
  
    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });
  
    afterEach(() => {
      sandbox.restore();
    });
  
    const mockRequest = (body = {}, params = {}) => ({ body, params });
    const mockResponse = () => {
      const res = {};
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      return res;
    };
  
    // 1. Crear Asignatura
    describe('createSubject', () => {
      it('debería crear una asignatura exitosamente y asignarla al semestre', async () => {
        const req = mockRequest({ name: 'Matemáticas' }, { semesterId: 'sem123' });
        const res = mockResponse();
        const newSubject = { _id: 'subjectId', name: 'Matemáticas' };
  
        sandbox.stub(Subject.prototype, 'save').resolves(newSubject);
        sandbox.stub(Semester, 'findByIdAndUpdate').resolves({ subjects: ['subjectId'] });
  
        await createSubject(req, res);
  
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith({
          message: 'Asignatura creada exitosamente',
          subject: newSubject,
        })).to.be.true;
      });
  
      it('debería devolver un error al crear la asignatura', async () => {
        const req = mockRequest({ name: 'Matemáticas' });
        const res = mockResponse();
        sandbox.stub(Subject.prototype, 'save').throws(new Error('Error'));
  
        await createSubject(req, res);
  
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({
          error: 'Error al crear la asignatura',
        })).to.be.true;
      });
    });
  
    // 2. Obtener Asignatura por ID
    describe('getSubjectById', () => {
      it('debería obtener una asignatura por ID', async () => {
        const req = mockRequest({}, { id: '123' });
        const res = mockResponse();
        const subjectData = { _id: '123', name: 'Matemáticas' };
  
        sandbox.stub(Subject, 'findById').resolves(subjectData);
  
        await getSubjectById(req, res);
  
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(subjectData)).to.be.true;
      });
  
      it('debería devolver 404 si la asignatura no existe', async () => {
        const req = mockRequest({}, { id: '123' });
        const res = mockResponse();
        sandbox.stub(Subject, 'findById').resolves(null);
  
        await getSubjectById(req, res);
  
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({
          message: 'Asignatura no encontrada',
        })).to.be.true;
      });
    });
  
    // 3. Obtener Todas las Asignaturas
    describe('getAllSubjects', () => {
      it('debería obtener todas las asignaturas', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const subjects = [{ _id: '123', name: 'Matemáticas' }];
  
        sandbox.stub(Subject, 'find').resolves(subjects);
  
        await getAllSubjects(req, res);
  
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(subjects)).to.be.true;
      });
    });
  
    // 4. Actualizar Asignatura
    describe('updateSubject', () => {
      it('debería actualizar una asignatura exitosamente', async () => {
        const req = mockRequest({ name: 'Matemáticas Avanzadas' }, { id: '123' });
        const res = mockResponse();
        const updatedSubject = { _id: '123', name: 'Matemáticas Avanzadas' };
  
        sandbox.stub(Subject, 'findByIdAndUpdate').resolves(updatedSubject);
  
        await updateSubject(req, res);
  
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({
          message: 'Asignatura actualizada',
          subject: updatedSubject,
        })).to.be.true;
      });
    });
  
    // 5. Eliminar Asignatura
    describe('deleteSubject', () => {
      it('debería eliminar una asignatura y actualizar el semestre', async () => {
        const req = mockRequest({}, { id: '123', semesterId: 'sem123' });
        const res = mockResponse();
  
        sandbox.stub(Subject, 'findByIdAndDelete').resolves(true);
        sandbox.stub(Semester, 'findByIdAndUpdate').resolves({ subjects: [] });
  
        await deleteSubject(req, res);
  
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({
          message: 'Asignatura eliminada y actualizada en el semestre',
          semester: { subjects: [] },
        })).to.be.true;
      });
  
      it('debería devolver 404 si la asignatura no existe', async () => {
        const req = mockRequest({}, { id: '123' });
        const res = mockResponse();
  
        sandbox.stub(Subject, 'findByIdAndDelete').resolves(null);
  
        await deleteSubject(req, res);
  
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({
          message: 'Asignatura no encontrada',
        })).to.be.true;
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
  
        sandbox.stub(Subject, 'findByIdAndUpdate').resolves(updatedSubject);
  
        await addEventToSubject(req, res);
  
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({
          message: 'Evento añadido',
          subject: updatedSubject,
        })).to.be.true;
      });
    });
  
    // 7. Calcular promedio asignatura
    describe('calculateSubjectAverage', () => {
      it('debería calcular el promedio ponderado correctamente y devolverlo en la respuesta', async () => {
        const subject = { _id: 'subjectId', events: ['eventId1', 'eventId2'] };
        const events = [
          { type: 'evaluado', grade: 90, weight: 50 },
          { type: 'evaluado', grade: 80, weight: 50 },
        ];
  
        sandbox.stub(Subject, 'findById').resolves(subject);
        sandbox.stub(Event, 'find').resolves(events);
        const req = mockRequest({}, { id: 'subjectId' });
        const res = mockResponse();
  
        await calculateSubjectAverage(req, res);
  
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({
          message: 'Promedio calculado',
          average: 85,
        })).to.be.true;
      });
  
      it('debería devolver 404 si no se proporciona la asignatura', async () => {
        sandbox.stub(Subject, 'findById').resolves(null);
        const req = mockRequest({}, { id: 'subjectId' });
        const res = mockResponse();
  
        await calculateSubjectAverage(req, res);
  
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({
          message: 'Asignatura no encontrada',
        })).to.be.true;
      });
    });
  });
  