import mongoose from "mongoose"
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  totalQuantity: {
    type: Number,
    required: true
  },
  cancellable: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ["pending", "completed", "canceled"],
    default: "pending"
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true })
export default mongoose.model("Order", orderSchema)