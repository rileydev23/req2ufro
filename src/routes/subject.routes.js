import express from "express";
import {
  createSubject,
  getSubjectById,
  getAllSubjects,
  updateSubject,
  deleteSubject,
  addEventToSubject,
  calculateSubjectAverage,
  getEventsFromSubject,
} from "../controllers/subject.controller.js";

const router = express.Router();

router.post("/:semesterId", createSubject);
router.get("/:id", getSubjectById);
router.get("/", getAllSubjects);
router.put("/:id", updateSubject);
router.delete("/:id/semester/:semesterId", deleteSubject);
router.post("/:id/event", addEventToSubject);
router.get("/:id/average", calculateSubjectAverage);
router.get("/:id/events", getEventsFromSubject);

export default router;
