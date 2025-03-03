import mongoose from "mongoose";

const shipmentBidSchema = new mongoose.Schema(
  {
    shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment', required: true },
    carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shipper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'withdraw', 'accept', 'reject', 'rebid', 'confirm'],
      default: 'pending',
    },
    createdBy: {
      type: String,
      enum: ["shipper", "carrier"],
      required: true
    },
    isShipperAccepted: { type: Boolean, default: false },
    isCarrierAccepted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const ShipmentBid = mongoose.model('ShipmentBid', shipmentBidSchema);
export default ShipmentBid;
