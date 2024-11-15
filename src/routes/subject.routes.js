import express from 'express';
import {
  createSubject,
  getSubjectById,
  getAllSubjects,
  updateSubject,
  deleteSubject,
  addEventToSubject,
  calculateSubjectAverage,
} from '../controllers/subject.controller.js';

const router = express.Router();

router.post('/:semesterId', createSubject);
router.get('/:id', getSubjectById);
router.get('/', getAllSubjects);
router.put('/:id', updateSubject);
router.delete('/:id/semester/:semesterId', deleteSubject);
router.post('/:id/event', addEventToSubject);
router.get('/:id/average', calculateSubjectAverage);

export default router;
