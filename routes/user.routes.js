import { Router } from "express";
import { getProfile } from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/profile', [authenticate, authorize('shipper', 'carrier', 'driver')], getProfile);

export default router;