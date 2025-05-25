import {Router} from 'express';
import { getRatings } from '../controllers/storeOwner.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.route("/dashboard").get(verifyJWT, getRatings)

export default router