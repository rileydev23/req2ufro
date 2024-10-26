import express from 'express';
import {
  createEvent,
  getEventById,
  getAllEvents,
  updateEvent,
  deleteEvent,
  isEvaluatedEvent,
  calculateEventWeight,
} from '../controllers/event.controller.js';

const router = express.Router();

router.post('/', createEvent);
router.get('/:id', getEventById);
router.get('/', getAllEvents);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.get('/:id/is-evaluated', isEvaluatedEvent);
router.get('/calculate-weight', calculateEventWeight);

export default router;
