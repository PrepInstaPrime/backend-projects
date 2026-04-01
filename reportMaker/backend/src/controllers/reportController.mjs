import reportModel from "../models/reportModel.mjs";
const createReport = async (req, res) => {
    try {
        const { propertyType, address, description, assignedTo } = req.body;
        const { userId } = req.user;
        const report = await reportModel.create({ userId, propertyType, address, description, assignedTo });
        return res.status(201).send({ message: "Report created successfully", report });
    } catch (error) {
        if (error.message.includes("validation")) {
            return res.status(400).send({ message: "Validation failed", error: error.message });
        } else {
            return res.status(500).send({ message: "Internal server error" });
        }
    }
};
const getReports = async (req, res) => {
    try {
        let role = req.user.role;
        let reports = null;
        if (role === 'admin') {
            reports = await reportModel.find();
        } else {
            reports = await reportModel.find({ assignedTo: role });
        }
        return res.status(200).send({ message: "Reports found", reports });
    } catch (error) {
        return res.status(500).send({ message: "Internal server error" });
    }
};
const updateReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { propertyType, address, description } = req.body;
        const report = await reportModel.findByIdAndUpdate(reportId, { propertyType, address, description, updated: true, updatedBy: req.user.userId }, { new: true });
        return res.status(200).send({ message: "Report updated successfully", report });
    } catch (error) {
        if (error.message.includes("report not found")) {
            return res.status(400).send({ message: "Report not found" });
        } else if (error.message.includes("validation")) {
            return res.status(400).send({ message: "Validation failed", error: error.message });
        } else {
            return res.status(500).send({ message: "Internal server error" });
        }
    }
};
export { createReport, getReports, updateReport };