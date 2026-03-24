import mongoose from 'mongoose';
const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, "UserId is required"],
        unique: true,
        ref: "users"
    },
    items: [{
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "products",
            required: [true, "ProductId is mandatory"]
        },
        quantity: {
            type: Number,
            min: 1
        }
    }],
    totalPrice: {
        type: Number,
        required: [true, "Total price is mandatory"]
    },
    totalItems: {
        type: Number,
        required: [true, "Total Items is mandatory"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, {timestamps: true})

const cartModel = mongoose.model('carts', cartSchema);
export default cartModel;