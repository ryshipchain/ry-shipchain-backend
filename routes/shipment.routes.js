import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { createShipment, deleteShipment, getAllShipments, getShipment } from "../controllers/shipment.controller.js";

const router = Router();

router.post('/', [authenticate, authorize('shipper', 'carrier')], createShipment);
router.get('/', [authenticate, authorize('shipper', 'carrier')], getAllShipments);
router.get('/:id', [authenticate, authorize('shipper', 'carrier')], getShipment);
router.delete('/:id', [authenticate, authorize('shipper', 'carrier')], deleteShipment);

export default router;