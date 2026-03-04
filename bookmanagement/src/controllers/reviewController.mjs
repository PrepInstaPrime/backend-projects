import mongoose from "mongoose";
import reviewModel from "../models/reviewModel.mjs";
import bookModel from "../models/bookModel.mjs";
const createReview = async (req, res)=>{
    try {
        let {bookId} = req.params;
        if(!mongoose.Types.ObjectId.isValid(bookId)){
                    return res.status(400).send({status: false, message:"book id is invalid"})
                }

        let book= await bookModel.findOne({_id: bookId, isDeleted: false});
        if(book==null){
            return res.status(404)
        .send({status: false, message: "book not found"});
        }

        let data = req.body;
        data.bookId = bookId;
        data.reviewedAt= Date.now()
        let review = await reviewModel.create(data)
        if(review===null){
            return res.status(500)
        .send({status: false, message: "internal server error"});
        }
        book = await bookModel.findByIdAndUpdate({_id: bookId}, {$inc:
            { reviews: 1}}, {returnDocument: "after"})
        
        book = book.toObject();
        book.reviewsData = review;
        return res.status(201)
        .send({status: true, message: "Review added successfully", data: book});
    } catch (error) {
        return res.status(500)
        .send({message: "failed", err:error.message});
    }
}

const updateReview = async (req, res)=>{
    try {
        let {bookId, reviewId} = req.params;
        
        let book= await bookModel.findOne({_id: bookId, isDeleted: false});

        if(book==null){
            return res.status(404)
        .send({status: false, message: "book not found"});
        }
        
        let data = req.body;
        let review = await reviewModel.findById({_id: reviewId});
        if(review==null){
            return res.status(404)
        .send({status: false, message: "review not found"});
        }

        review =await reviewModel.findByIdAndUpdate({_id: reviewId}, data);
        if(review==null){
            return res.status(500)
        .send({status: false, message: "internal server error"});
        }
        
        let allReviews = await reviewModel.find({ bookId })
        let resBook = {...book.toObject(), 
            reviewsData: allReviews
        }

        return res.status(200)
        .send({status: true, message: "Books list", data: resBook});
    } catch (error) {
        return res.status(500)
        .send({message: "failed", err:error.message});
    }
}

const deleteReview = async (req, res)=>{
    try {
        let {bookId, reviewId} = req.params;
        
        let review = await reviewModel.findById({_id: reviewId});
        if(review==null){
            return res.status(404)
        .send({status: false, message: "review not found"});
        }

        let book= await bookModel.findOne({_id: bookId});
        if(book==null){
            return res.status(404)
        .send({status: false, message: "book not found"});
        }
        
        review = await reviewModel.findByIdAndUpdate({_id: reviewId}, {isDeleted: true})
        if(review==null){
            return res.status(500)
        .send({status: false, message: "internal server error"});
        }

        await bookModel.findByIdAndUpdate({_id: bookId}, {$inc: {reviews: -1}});

        return res.status(200)
        .send({status: true, message: "Review has been deleted"});
    } catch (error) {
        return res.status(500)
        .send({message: "failed", err:error.message});
    }
}

export {createReview, updateReview, deleteReview}