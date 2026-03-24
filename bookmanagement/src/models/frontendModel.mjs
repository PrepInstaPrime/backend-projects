import mongoose, { mongo } from "mongoose";
const frontendSchema = new mongoose.Schema({
    imageURL: String
})

const frontendModel = mongoose.model("frontend", frontendSchema)
export default frontendModel; 