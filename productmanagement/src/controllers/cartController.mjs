import mongoose from "mongoose";
import cartModel from "../models/cartModel.mjs";
import userModel from "../models/userModel.mjs";
import productModel from "../models/productModel.mjs";
const getCart = async (req, res)=>{
    try {
        const {userId} = req.params;
        if(!userId){
            return res.status(400).send({status: false, message: "enter user Id"});
        }
        let user = await userModel.findById(userId);
        if(user==null){
            return res.status(404).send({status: false, message: "user not found"});
        }
        const cart = await cartModel.find({userId: userId}).populate("items.productId");
        if(cart==null){
             return res.status(404).send({status: false, message: "cart not found"});
        }
        return res.status(200).send({status: true, message: "success", data: cart})
    } catch (error) {
        return res.status(500).send({status: false, err: error.message})
    }
}

const addToCart = async (req, res)=>{
    try {
        const { userId } = req.params;
        const { cartId, productId, quantity } = req.body;
        if(!userId){
            return res.status(400).send({status: false, message: "enter user Id"});
        }
        const user = await userModel.findById(userId)
        if(user==null){
            return res.status(404).send({status: false, message: "user not found"});
        }
        
        if(!cartId){
            return res.status(400).send({status: false, message: "enter cart Id"});
        }
        if(!productId){
            return res.status(400).send({status: false, message: "enter product Id"});
        }
        
        let product = await productModel.findOne({_id: productId, isDeleted: false});
        if(product==null){
            return res.status(404).send({status: false, message: "Product not found"})
        }

        let cart = await cartModel.findOne({_id: cartId, userId: userId});
        let qty = quantity? Number(quantity): 1;
        if(cart==null){
            let data = {}
            data.userId= userId;
            data.items = [{productId: productId, quantity: qty}]
            data.totalPrice = product.price*qty;
            data.totalItems = qty;
            
            const newCart = await cartModel.create(data).populate("items.productId");

            if(newCart==null){
                return res.status(500).send({status: false, message:"failed"});
            }

            return res.status(201).send({status: true, message:"Success", data: newCart})
        }
        
        cart = await cartModel.findOneAndUpdate({_id: cartId,userId, "items.productId": productId}, {$inc:{"items.$.quantity": qty, totalItems: qty, totalPrice: (product.price*qty)}},{new: true}).populate("items.productId");
        
        if(cart==null){
            cart = await cartModel.findOneAndUpdate({_id: cartId,userId}, {$push:{items: {productId, quantity: qty}}, $inc:{totalItems: qty, totalPrice: (product.price*qty)}},{new: true}).populate("items.productId");
        }

        return res.status(200).send({status: true, message: "Success", data: cart});
    } catch (error) {
        return res.status(500).send({status: false, err: error.message});
    }
}

const updateCart = async (req, res)=>{
    try {
        const {userId} = req.params;
        const { cartId, productId, removeProduct} = req.body;
        if(!userId){
            return res.status(400).send({status: false, message: "enter user Id"});
        }
        const user = await userModel.findById(userId)
        if(user==null){
            return res.status(404).send({status: false, message: "user not found"});
        }
        
        if(!cartId){
            return res.status(400).send({status: false, message: "enter cart Id"});
        }
        if(!productId){
            return res.status(400).send({status: false, message: "enter product Id"});
        }
        
        let product = await productModel.findOne({_id: productId, isDeleted: false});
        if(product==null){
            return res.status(404).send({status: false, message: "Product not found"})
        }

        let cart = await cartModel.findOne({_id: cartId, userId: userId});
        if(cart==null){
            return res.status(404).send({status: false, message: "cart not found"})
        }
        
        const item = cart.items.find(e=> e.productId.toString()=== productId);
        if(!item){
            return res.status(404).send({status: false, message: "item is not in cart"})
        }

        let newCart;
        if(Number(removeProduct)===0){
            newCart=await cartModel.findOneAndUpdate({_id: cartId},{$pull:{items:{productId}}, $inc:{totalItems: -item.quantity, totalPrice: -(product.price*item.quantity)}},{new: true}).populate("items.productId");

            return res.status(200).send({status: true, message: "Product removed  successfully"});
        }
        else{
            if(item.quantity==1){
                newCart=await cartModel.findOneAndUpdate({_id: cartId},{$pull:{items:{productId}}, $inc:{totalItems: -1, totalPrice: -product.price}},{new: true}).populate("items.productId");
            }
            else{
                newCart=await cartModel.findOneAndUpdate({_id: cartId, "items.productId": productId},{$inc:{"items.$.quantity": -1,totalItems: -1, totalPrice: -product.price}},{new: true}).populate("items.productId");
            }
        }
        
        if(newCart==null){
            return res.status(500).send({status: false, message: "failed"})
        }
        return res.status(200).send({status: true, message: "Product removed successfully", data: newCart})
    } catch (error) {
        return res.status(500).send({status: false, err: error.message});
    }
}

const deleteCart= async (req, res)=>{
    try {
        const { userId } = req.params;
        if(!userId){
            return res.status(400).send({status: false, message: "enter user Id"});
        }
        const user = await userModel.findById(userId)
        if(user==null){
            return res.status(404).send({status: false, message: "user not found"});
        }

        let cart = await cartModel.findOne({userId})
        if(cart==null){
            return res.status(404).send({status: false, message: "cart not found"});
        }
        
        cart = await cartModel.updateOne({userId:userId},{$set:{items: [], totalPrice: 0, totalItems:0}},{new: true})

        return res.status(200).send({status: true, message: "successful", data: cart});
    } catch (error) {
        return res.status(500).send({status: false, err: error.message});
    }
}

export { getCart, addToCart, updateCart, deleteCart}