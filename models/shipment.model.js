import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shipper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pickup: {
      address: {
        line1: { type: String, required: true },
        line2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zip: { type: String, required: true },
      },
      location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
      },
    },
    dropoff: {
      address: {
        line1: { type: String, required: true },
        line2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zip: { type: String, required: true },
      },
      location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
      },
    },
    rate: { type: Number, required: true },
    status: {
      type: String,
      enum: ['created', 'bidding', 'assigned', 'picked-up', 'delivered', 'completed'],
      default: 'created',
    },
  },
  { timestamps: true }
);

const Shipment = mongoose.model('Shipment', shipmentSchema);
export default Shipment;
