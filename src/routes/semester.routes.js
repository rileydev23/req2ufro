import express from 'express';
import { createSemester, getSemester, editSemester, deleteSemester, getAllSemesters } from '../controllers/semester.controller.js';

const router = express.Router();

router.post('/', createSemester);
router.get('/:id', getSemester);
router.put('/:id', editSemester);
router.delete('/:id', deleteSemester);
router.get('/', getAllSemesters);

export default router;
