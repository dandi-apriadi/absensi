import express from "express";
import { login, logOut, Me, registrasi } from "../../controllers/shared/authController.js";
import { verifyUser } from "../../middleware/AuthUser.js";

const router = express.Router();

router.get('/me', verifyUser, Me);
router.post('/login', login);
router.post('/register', registrasi);
router.delete('/logout', logOut);

export default router;