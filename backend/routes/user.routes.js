import { Router } from "express";
import {
  alterRating,
  rateStore,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getStores, StoreRating, searchStore } from "../services/store.service.js";

const router = Router();

router
  .route("/store/:id/ratings")
  .get(verifyJWT, StoreRating)
  .post(verifyJWT, rateStore)
  .put(verifyJWT, alterRating);
router.route("/stores/search").get(verifyJWT, searchStore);
router.route("/stores").get(verifyJWT, getStores);

export default router;
