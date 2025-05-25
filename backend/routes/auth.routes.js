import {Router} from 'express'
import { loginUser, logout, registerUser, changePassword } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/update-password").post(verifyJWT, changePassword)
router.route("/logout").post(verifyJWT, logout)

export default router