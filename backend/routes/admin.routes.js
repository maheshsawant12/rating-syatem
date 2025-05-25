import { Router } from "express";
import {
  addStore,
  getStore,
  addUserAndAdmin,
  dashboard,
  getUsers,
  getUsersDetail,
} from "../controllers/admin.controller.js";
import {
  getStores,
  StoreRating,
  searchStore,
} from "../services/store.service.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/dashboard").get(verifyJWT, dashboard);
router.route("/add-user").post(verifyJWT, addUserAndAdmin);
router.route("/add-store").post(verifyJWT, addStore);
router.route("/users").get(verifyJWT, getUsers);
router.route("/user").get(verifyJWT, getUsersDetail);
router.route("/stores").get(verifyJWT, getStores);
router.route("/store").get(verifyJWT, getStore);
router.route("/store/:id/ratings").get(verifyJWT, StoreRating);

export default router;
