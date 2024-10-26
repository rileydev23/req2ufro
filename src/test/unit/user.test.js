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
  
  jest.mock('../../schemas/user.schema.js');
  
  describe('Controlador de Usuarios (Unitarias)', () => {
    const mockRequest = (body = {}, params = {}) => ({ body, params });
    const mockResponse = () => {
      const res = {};
      res.status = jest.fn().mockReturnThis();
      res.json = jest.fn().mockReturnThis();
      return res;
    };
  
    afterEach(() => jest.clearAllMocks());
  
    // 1. Pruebas para registerUser
    describe('registerUser', () => {
      it('debería registrar un usuario exitosamente', async () => {
        const req = mockRequest({ googleId: '123', email: 'test@test.com', name: 'Test User' });
        const res = mockResponse();
  
        User.mockImplementation(() => ({
          save: jest.fn().mockResolvedValue(req.body),
        }));
  
        await registerUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Usuario registrado exitosamente' });
      });
  
      it('debería manejar un error al registrar un usuario', async () => {
        const req = mockRequest({ googleId: '123' });
        const res = mockResponse();
  
        User.mockImplementation(() => {
          throw new Error('Error');
        });
  
        await registerUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error al registrar el usuario' });
      });
    });
  
    // 2. Pruebas para loginUser
    describe('loginUser', () => {
      it('debería iniciar sesión correctamente', async () => {
        const req = mockRequest({ googleId: '123' });
        const res = mockResponse();
        const user = { googleId: '123', name: 'Test User' };
  
        User.findOne.mockResolvedValue(user);
  
        await loginUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Inicio de sesión exitoso', user });
      });
  
      it('debería devolver 404 si el usuario no existe', async () => {
        const req = mockRequest({ googleId: '123' });
        const res = mockResponse();
  
        User.findOne.mockResolvedValue(null);
  
        await loginUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
      });
    });
  
    // 3. Pruebas para getUserById
    describe('getUserById', () => {
      it('debería obtener un usuario por ID', async () => {
        const req = mockRequest({}, { id: '123' });
        const res = mockResponse();
        const user = { _id: '123', name: 'Test User' };
  
        User.findById.mockResolvedValue(user);
  
        await getUserById(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(user);
      });
  
      it('debería devolver 404 si el usuario no existe', async () => {
        const req = mockRequest({}, { id: '123' });
        const res = mockResponse();
  
        User.findById.mockResolvedValue(null);
  
        await getUserById(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
      });
    });
  
    // 4. Pruebas para addSemesterToUser
    describe('addSemesterToUser', () => {
      it('debería añadir un semestre al usuario', async () => {
        const req = mockRequest({ semesterId: '456' }, { id: '123' });
        const res = mockResponse();
        const updatedUser = { _id: '123', semesters: ['456'] };
  
        User.findByIdAndUpdate.mockResolvedValue(updatedUser);
  
        await addSemesterToUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Semestre añadido', user: updatedUser });
      });
    });
  
    // 5. Pruebas para getUserSemesters
    describe('getUserSemesters', () => {
      it('debería obtener los semestres del usuario', async () => {
        const req = mockRequest({}, { id: '123' });
        const res = mockResponse();
        const user = { _id: '123', semesters: ['456'] };
  
        User.findById.mockResolvedValue(user);
  
        await getUserSemesters(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(user.semesters);
      });
    });
  });
  