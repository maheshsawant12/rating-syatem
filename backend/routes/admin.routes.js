import { Router } from "express";
import {
  addStore,
  addUserAndAdmin,
  dashboard,
  getUsers,
} from "../controllers/admin.controller.js";
import {
  getStores,
} from "../services/store.service.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/dashboard").get(verifyJWT, dashboard);
router.route("/add-user").post(verifyJWT, addUserAndAdmin);
router.route("/add-store").post(verifyJWT, addStore);
router.route("/users").get(verifyJWT, getUsers);
router.route("/stores").get(verifyJWT, getStores);

export default router;
