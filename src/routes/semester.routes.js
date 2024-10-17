import express from 'express';
import { createSemester, getSemester, editSemester, deleteSemester } from '../controllers/semester.controller.js';

const router = express.Router();

router.post('/semester', createSemester);
router.get('/semester/:id', getSemester);
router.put('/semester/:id', editSemester);
router.delete('/semester/:id', deleteSemester);

export default router;
