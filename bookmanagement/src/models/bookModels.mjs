// This module was implemented by my friend Amlan Das Karmakar 
// I only integrated it into the project
import {Schema, model} from 'mongoose';

const bookSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            unique: true,
            trim: true
        },
        excerpt: {
            type: String,
            required: [true, 'Excerpt is required']
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required']
        },
        ISBN: {
            type: String,
            required: [true, 'ISBN is required'],
            unique: true
        },
        coverImage: {
            type: String,
            comment: 'URL of the book cover image'
        },
        category: {
            type: String,
            required: [true, 'Category is required']
        },
        subcategory: {
            type: String,
            required: [true, 'Subcategory is required']
        },
        reviews: {
            type: Number,
            default: 0,
            comment: 'Holds number of reviews of this book'
        },
        reviewsData: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Review'
            }
        ],
        releasedAt: {
            type: Date,
            required: [true, 'Release date is required in YYYY-MM-DD format']
        },
        deletedAt: {
            type: Date
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        
    },
    {
        timestamps: true
    }
);

const Book = model('Book', bookSchema);

export default Book;