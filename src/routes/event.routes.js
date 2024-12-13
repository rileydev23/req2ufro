import express from "express";
import {
  createEvent,
  getEventById,
  getAllEvents,
  updateEvent,
  deleteEvent,
  isEvaluatedEvent,
  addGradeToEvent,
  addGradeMasiveToEvent,
} from "../controllers/event.controller.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/:id", getEventById);
router.get("/", getAllEvents);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.get("/:id/is-evaluated", isEvaluatedEvent);
router.put("/:id/add-grade", addGradeToEvent);
router.put("/:id/add-grades", addGradeMasiveToEvent);

export default router;
