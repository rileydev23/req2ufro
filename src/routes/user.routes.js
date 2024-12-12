import express from "express";
import {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  addSemesterToUser,
  removeSemesterFromUser,
  assignRoleToUser,
  getUserSemesters,
  updateNotificationToken,
  sendTestNotification,
} from "../controllers/user.controller.js";

const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login', loginUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.patch("/:id/notification-token", updateNotificationToken);
router.post("/:id/semester", addSemesterToUser);
router.delete("/:id/semester/:semesterId", removeSemesterFromUser);
router.post("/:id/assign-role", assignRoleToUser);
router.post("/:id/notification-test", sendTestNotification);
router.get("/:id/semesters", getUserSemesters);

export default router;
