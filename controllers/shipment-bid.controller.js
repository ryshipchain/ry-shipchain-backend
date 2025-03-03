import Shipment from "../models/shipment.model.js";
import ShipmentBid from "../models/ShipmentBid.model.js";
import mongoose from 'mongoose';

export const createShipmentBid = async (req, res) => {
  try {
    const { shipmentId, bidAmount, actionFor } = req.body;

    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) return res.status(404).json({ success: false, message: "Shipment not found" });

    if (bidAmount <= shipment.rate) return res.status(400).json({ success: false, message: "Bid amount must be greater than shipment rate" });

    const findShipmentBidOptions = {
      shipment: shipmentId,
    }
    const createShipmentBidValues = {
      shipment: shipmentId,
      amount: bidAmount,
      createdBy: req.user.role
    };

    if (req.user.role == 'carrier') {
      findShipmentBidOptions.shipper = createShipmentBidValues.shipper = actionFor
      findShipmentBidOptions.carrier = createShipmentBidValues.carrier = req.user.id
    } else {
      findShipmentBidOptions.shipper = createShipmentBidValues.shipper = req.user.id
      findShipmentBidOptions.carrier = createShipmentBidValues.carrier = actionFor
    }

    const shipmentBid = await ShipmentBid.findOne(findShipmentBidOptions).sort({ createdAt: -1 });

    if (!shipmentBid && req.user.role == 'shipper') return res.status(400).json({ success: false, message: "Only carrier can first bid on shipment" });
    if (shipmentBid && shipmentBid.createdBy == 'carrier' && req.user.role == 'carrier') return res.status(400).json({ success: false, message: "You have already placed a bid on this shipment" });
    if (shipmentBid && shipmentBid.createdBy == 'shipper' && req.user.role == 'shipper') return res.status(400).json({ success: false, message: "You have already placed a bid on this shipment" });

    await ShipmentBid.create(createShipmentBidValues);

    res.status(200).json({ success: true, message: "Shipment bid created successfully" });
  } catch (error) {
    console.error("Error : ", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}

export const manageStatus = async (req, res) => {
  try {
    const { shipmentId, shipmentBidId, actionForId, action } = req.body;

    const [shipment, shipmentBid] = await Promise.all([
      Shipment.findById(shipmentId),
      ShipmentBid.findById(shipmentBidId),
    ]);

    if (!shipment) return res.status(404).json({ success: false, message: "Shipment not found" });
    if (!shipmentBid) return res.status(404).json({ success: false, message: "Shipment bid not found" });

    const criteria = {
      shipment: shipmentId,
      carrier: req.user.role === 'carrier' ? req.user.id : actionForId,
      shipper: req.user.role === 'shipper' ? req.user.id : actionForId,
    };

    const currentUserLastBidOnShipment = await ShipmentBid.findOne(criteria).sort({ createdAt: -1 });

    if (!currentUserLastBidOnShipment) {
      return res.status(400).json({ success: false, message: "No bid found for the current user" });
    }

    const { createdBy, isCarrierAccepted, isShipperAccepted } = currentUserLastBidOnShipment;

    if (action === "withdraw" && createdBy !== req.user.role) {
      return res.status(400).json({ success: false, message: "You can't withdraw others' bid" });
    }
    if (action === "reject" && createdBy === req.user.role) {
      return res.status(400).json({ success: false, message: "You can't reject your own bid" });
    }
    if (action === "accept" && createdBy === req.user.role) {
      if (req.user.role === 'carrier' && !isShipperAccepted) {
        return res.status(400).json({ success: false, message: "Shipper must accept the bid first" });
      }
      if (req.user.role === 'shipper' && !isCarrierAccepted) {
        return res.status(400).json({ success: false, message: "Carrier must accept the bid first" });
      }
    }

    await ShipmentBid.updateOne({ _id: shipmentBidId }, { $set: { status: action } });

    res.status(200).json({ success: true, message: `Bid ${action} successfully` });
  } catch (error) {
    console.error("Error : ", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}

export const getAllShipmentBidsByShipmentId = async (req, res) => {
  try {
    const { shipmentId } = req.query;
    const findOptions = { shipment: shipmentId };

    if (req.user.role === 'carrier') {
      findOptions.carrier = req.user.id;
    } else {
      const shipment = await Shipment.findOne({ _id: shipmentId, shipper: req.user.id });
      if (!shipment) return res.status(200).json({ success: false, message: "Shipment not found" });
    }

    const [shipmentBidsCount, shipmentBids] = await Promise.all([
      ShipmentBid.countDocuments(findOptions),
      // ShipmentBid.find(findOptions).sort({ createdAt: -1 }).lean(),
      req.user.role === 'carrier'
        ? ShipmentBid.find(findOptions)
          .populate('carrier', 'firstName lastName email')
          .populate('shipper', 'firstName lastName email')
          .sort({ createdAt: -1 })
          .lean()
        : ShipmentBid.aggregate([
          {
            $match: {
              shipment: new mongoose.Types.ObjectId(shipmentId),
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $group: {
              _id: "$carrier",
              shipmentBids: {
                $push: {
                  _id: "$_id",
                  shipment: "$shipment",
                  carrier: "$carrier",
                  shipper: "$shipper",
                  amount: "$amount",
                  status: "$status",
                  createdBy: "$createdBy",
                  createdAt: "$createdAt",
                  updatedAt: "$updatedAt",
                },
              },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "carrierDetails",
            },
          },
          {
            $unwind: {
              path: "$carrier",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 0,
              // carrier: "$_id",
              // carrier: "$carrier",
              carrierDetails: { firstName: 1, lastName: 1, email: 1 },
              shipmentBids: 1,
            },
          },
        ]),
    ]);

    console.log(shipmentBids);

    // res.status(200).json({ success: true, message: "Shipment bids list fetched successfully", totalCount: shipmentBidsCount, data: shipmentBids });
    res.status(200).json({
      success: true,
      message: "Shipment bids list fetched successfully",
      totalCount: shipmentBidsCount,
      data: req.user.role === 'carrier'
        ? shipmentBids
        : shipmentBids.map(({ carrierDetails, shipmentBids }) => ({
          carrierDetails,
          shipmentBids,
        })),
    });
  } catch (error) {
    console.error("Error : ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};
