import express from 'express';
import {
  createSemester,
  getSemester,
  editSemester,
  deleteSemester,
} from '../controller/semester.controller'; // Asegúrate de importar desde la ruta correcta

const router = express.Router();

// Crear un semestre
router.post('/semester', createSemester);

// Obtener un semestre
router.get('/semester/:id', getSemester);

// Editar un semestre
router.patch('/semester/:id', editSemester);

// Eliminar un semestre
router.delete('/semester/:id', deleteSemester);

export default router;
