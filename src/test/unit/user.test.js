import {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  addSemesterToUser,
  removeSemesterFromUser,
  assignRoleToUser,
  getUserSemesters,
} from '../../controllers/user.controller.js';
import User from '../../schemas/user.schema.js';
import Semester from '../../schemas/semester.schema.js';
import sinon from 'sinon';
import { expect } from 'chai';

describe('Controlador de Usuarios (Unitarias)', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = (body = {}, params = {}) => ({ body, params });
    mockResponse = () => {
      const res = {};
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      return res;
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  // 1. Pruebas para registerUser
  describe('registerUser', () => {
    it('debería registrar un usuario exitosamente', async () => {
      const req = mockRequest({
        googleId: '123',
        email: 'test@test.com',
        name: 'Test User',
      });
      const res = mockResponse();

      sinon.stub(User.prototype, 'save').resolves(req.body);

      await registerUser(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ message: 'Usuario registrado exitosamente' })).to.be.true;
    });

    it('debería manejar un error al registrar un usuario', async () => {
      const req = mockRequest({ googleId: '123' });
      const res = mockResponse();

      sinon.stub(User.prototype, 'save').throws(new Error('Error'));

      await registerUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Error al registrar el usuario' })).to.be.true;
    });
  });

  // 2. Pruebas para loginUser
  describe('loginUser', () => {
    it('debería iniciar sesión correctamente', async () => {
      const req = mockRequest({ googleId: '123' });
      const res = mockResponse();
      const user = { googleId: '123', name: 'Test User' };

      sinon.stub(User, 'findOne').resolves(user);

      await loginUser(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Inicio de sesión exitoso', user })).to.be.true;
    });

    it('debería devolver 404 si el usuario no existe', async () => {
      const req = mockRequest({ googleId: '123' });
      const res = mockResponse();

      sinon.stub(User, 'findOne').resolves(null);

      await loginUser(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Usuario no encontrado' })).to.be.true;
    });
  });

  // 3. Pruebas para getUserById
  describe('getUserById', () => {
    it('debería obtener un usuario por ID', async () => {
      const req = mockRequest({}, { id: '123' });
      const res = mockResponse();
      const user = { _id: '123', name: 'Test User' };

      sinon.stub(User, 'findById').resolves(user);

      await getUserById(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(user)).to.be.true;
    });

    it('debería devolver 404 si el usuario no existe', async () => {
      const req = mockRequest({}, { id: '123' });
      const res = mockResponse();

      sinon.stub(User, 'findById').resolves(null);

      await getUserById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Usuario no encontrado' })).to.be.true;
    });
  });

  // 4. Pruebas para getAllUsers
  describe('getAllUsers', () => {
    it('debería obtener todos los usuarios', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const users = [{ _id: '123', name: 'Test User' }];

      sinon.stub(User, 'find').resolves(users);

      await getAllUsers(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(users)).to.be.true;
    });
  });

  // 5. Pruebas para updateUser
  describe('updateUser', () => {
    it('debería actualizar un usuario correctamente', async () => {
      const req = mockRequest({ name: 'Updated User' }, { id: '123' });
      const res = mockResponse();
      const updatedUser = { _id: '123', name: 'Updated User' };

      sinon.stub(User, 'findByIdAndUpdate').resolves(updatedUser);

      await updateUser(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Usuario actualizado', user: updatedUser })).to.be.true;
    });
  });

  // 6. Pruebas para deleteUser
  describe('deleteUser', () => {
    it('debería eliminar un usuario correctamente', async () => {
      const req = mockRequest({}, { id: '123' });
      const res = mockResponse();

      sinon.stub(User, 'findByIdAndDelete').resolves({ _id: '123' });

      await deleteUser(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Usuario eliminado' })).to.be.true;
    });
  });

  // 7. Pruebas para addSemesterToUser
  describe('addSemesterToUser', () => {
    it('debería añadir un semestre al usuario y actualizar el semestre con el usuario', async () => {
      const req = mockRequest({ semesterId: '456' }, { id: '123' });
      const res = mockResponse();

      const updatedUser = { _id: '123', semesters: ['456'] };
      const updatedSemester = { _id: '456', users: ['123'] };

      sinon.stub(User, 'findByIdAndUpdate').resolves(updatedUser);
      sinon.stub(Semester, 'findByIdAndUpdate').resolves(updatedSemester);

      await addSemesterToUser(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Semestre añadido', user: updatedUser })).to.be.true;
    });
  });

  // 8. Prueba para removeSemesterFromUser
  describe('removeSemesterFromUser', () => {
    it('debería eliminar un semestre de un usuario y actualizar el semestre eliminando al usuario', async () => {
      const req = mockRequest({}, { id: '123', semesterId: '456' });
      const res = mockResponse();

      const updatedUser = { _id: '123', semesters: [] };
      const updatedSemester = { _id: '456', users: [] };

      sinon.stub(User, 'findByIdAndUpdate').resolves(updatedUser);
      sinon.stub(Semester, 'findByIdAndUpdate').resolves(updatedSemester);

      await removeSemesterFromUser(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Semestre eliminado', user: updatedUser })).to.be.true;
    });
  });

  // 9. Pruebas para assignRoleToUser
  describe('assignRoleToUser', () => {
    it('debería asignar un rol a un usuario', async () => {
      const req = mockRequest({ role: 'admin' }, { id: '123' });
      const res = mockResponse();
      const updatedUser = { _id: '123', role: 'admin' };

      sinon.stub(User, 'findByIdAndUpdate').resolves(updatedUser);

      await assignRoleToUser(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Rol asignado', user: updatedUser })).to.be.true;
    });
  });

  // 10. Pruebas para getUserSemesters
  describe('getUserSemesters', () => {
    it('debería obtener los semestres del usuario', async () => {
      const req = mockRequest({}, { id: '123' });
      const res = mockResponse();
      const user = { _id: '123', semesters: ['456'] };

      sinon.stub(User, 'findById').resolves(user);

      await getUserSemesters(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(user.semesters)).to.be.true;
    });
  });
});
