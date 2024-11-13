import express from "express";
import { postLogin, postRegister } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", postLogin);
router.post("/register", postRegister);
// router.post("/request-login-code", requestLoginCode);
// router.post("/verify-login-code", verifyLoginCode);

export default router;
