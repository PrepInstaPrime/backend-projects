import mongoose from "mongoose"
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currencyId: {
    type: String,
    default: "INR"
  },
  currencyFormat: {
    type: String,
    default: "₹"
  },
  isFreeShipping: {
    type: Boolean,
    default: false
  },
  productImage: {
    type: String,
    required: true
  },
  style: {
    type: String
  },
  availableSizes: {
    type: [String],
    enum: ["S","XS","M","X","L","XXL","XL"]
  },
  installments: {
    type: Number
  },
  deletedAt: {
    type: Date,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
},{timestamps:true})
const productModel = mongoose.model('products', productSchema);
export default productModel