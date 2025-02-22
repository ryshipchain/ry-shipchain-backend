import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment', required: true },
    carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shipper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'rebid'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Bid = mongoose.model('Bid', bidSchema);
export default Bid;