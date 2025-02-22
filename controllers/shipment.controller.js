import Shipment from "../models/shipment.model.js";
import { deleteShipmentSchemaValidator, getAllShipmentSchemaValidator, getShipmentSchemaValidator, shipmentSchemaValidator } from "../utils/validator.js";

export const createShipment = async (req, res) => {
  try {
    const { error } = shipmentSchemaValidator.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const shipment = await Shipment.create({
      ...req.body,
      [req.user.role]: req.user.id,
    });
    res.status(201).json({ success: true, message: "Shipment created successfully", data: shipment });
  } catch (error) {
    console.error("Error : ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllShipments = async (req, res) => {
  try {
    const { error, value } = getAllShipmentSchemaValidator.validate(req.query);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", search } = value;
    const query = { [req.user.role]: req.user.id };
    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(search, "i") } },
      ];
    }
    const shipments = await Shipment.find(query)
      .sort([[sortBy, order === "desc" ? -1 : 1]])
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const totalCount = await Shipment.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      message: "Shipments retrieved successfully",
      data: shipments,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page
      },
    });
  } catch (error) {
    console.error("Error : ", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const getShipment = async (req, res) => {
  try {
    const { error, value } = getShipmentSchemaValidator.validate(req.params);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const shipment = await Shipment.findOne({ _id: value.id, [req.user.role]: req.user.id });
    if (!shipment) return res.status(404).json({ success: false, message: "Shipment not found" });
    res.status(200).json({ success: true, message: "Shipment retrieved successfully", data: shipment });
  } catch (error) {
    console.error("Error : ", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const deleteShipment = async (req, res) => {
  try {
    const { error, value } = deleteShipmentSchemaValidator.validate(req.params);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    console.log({ _id: value.id, shipper: req.user.id })
    const shipment = await Shipment.findOneAndDelete({ _id: value.id, [req.user.role]: req.user.id });
    console.log(shipment, 'shipment-----')
    if (!shipment) return res.status(404).json({ success: false, message: "Shipment not found" });
    res.status(200).json({ success: true, message: "Shipment deleted successfully" });
  } catch (error) {
    console.error("Error : ", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};