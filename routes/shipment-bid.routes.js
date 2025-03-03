import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { createShipmentBid, getAllShipmentBidsByShipmentId, manageStatus } from "../controllers/shipment-bid.controller.js";

const router = Router();

router.post('/', [authenticate, authorize('shipper', 'carrier')], createShipmentBid);
router.post('/status', [authenticate, authorize('shipper', 'carrier')], manageStatus);
router.get('/', [authenticate, authorize('shipper', 'carrier')], getAllShipmentBidsByShipmentId);

export default router;