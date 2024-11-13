import express from "express";
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
} from "../controllers/user.controller.js";

const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login', loginUser);
router.get("/:id", getUserById);
router.get("/", getAllUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/:id/semester", addSemesterToUser);
router.delete("/:id/semester/:semesterId", removeSemesterFromUser);
router.post("/:id/assign-role", assignRoleToUser);
router.get("/:id/semesters", getUserSemesters);

export default router;
