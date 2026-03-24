import Order from "../models/orderModel.mjs"
import cartModel from "../models/cartModel.mjs"
import userModel from "../models/userModel.mjs"
const createOrder = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await userModel.findById(userId)
    if (!user) {
      return res.status(404).send({status: false,message: "User not found"})
    }
    const cart = await cartModel.findOne({ userId })
    if (!cart || cart.items.length === 0) {
      return res.status(400).send({status: false,message: "Cart is empty"})
    }
    const totalQuantity = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    )
    const orderData = {
      userId: cart.userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      totalItems: cart.totalItems,
      totalQuantity: totalQuantity
    }
    const order = await Order.create(orderData)
    cart.items = []
    cart.totalItems = 0
    cart.totalPrice = 0
    await cart.save()
    res.status(200).send({status: true,message: "Order created successfully",data: order})
  } catch (err) {
    res.status(500).send({status: false,message: err.message})
  }
}
const updateOrder = async (req, res) => {
  try {
    const { userId } = req.params
    const { orderId, status } = req.body
    const order = await Order.findOne({
      _id: orderId,
      userId: userId,
      isDeleted: false
    })
    if (!order) {
      return res.status(404).send({status: false,message: "Order not found"})
    }
    if (status === "canceled" && !order.cancellable) {
      return res.status(400).send({status: false,message: "Order cannot be cancelled"})
    }
    order.status = status 
    await order.save()
    res.status(200).send({status: true,message: "Order updated successfully",data: order})
  } catch (err) {
    res.status(500).send({status: false,message: err.message})
  }
}
export { createOrder, updateOrder }