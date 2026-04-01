import mongoose from "mongoose";
const reportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    propertyType:{
        type: String,
        required: true,
        enum: ["house", "apartment", "office", "shop", "other"],
        default: "other"
    },
    address:{
        type: String,
        required: true,
        default: "No address provided"
    },
    images:{
        type: [String],
        required: true,
        default: []
    },
    description:{
        type: String,
        required: true,
        default: "No description provided"
    },
    assignedTo:{
        type:String,
        required: true,
        enum: ["evaluator", "technician", "sideengineer","admin"],
        default: "admin"
    },
    updated:{
        type: Boolean,
        default: false
    },
    updatedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
},{timestamps: true});
const reportModel = mongoose.model("Report", reportSchema);
export default reportModel;