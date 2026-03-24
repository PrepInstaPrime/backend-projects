// This module was implemented by my friend Amlan Das Karmakar 
// I only integrated it into the project
import Books from '../models/bookModels.mjs';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import config from '../../config.mjs';

const s3 = new S3Client({
    credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretAccessKey,
        bucket: config.bucketName
    },
    region: config.region
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.bucketName,
        key: (req, file, cb) => {
            cb(null, `books/${Date.now()}-${file.originalname}`);
        }
    })
});

const uploadCoverImage = (req, res) => new Promise((resolve, reject) => {
    upload.single('coverImage')(req, res, (err) => {
        if (err) {
            reject(err);
            return;
        }
        resolve();
    });
});

const getAll = async (req, res) => {
    try {
        const filter = { isDeleted: false };

        if (req.query?.userId) {
            filter.userId = req.query.userId;
        }

        if (req.query?.category) {
            filter.category = req.query.category;
        }

        if (req.query?.subcategory) {
            filter.subcategory = req.query.subcategory;
        }

        const books = await Books.find(filter).select({
            title: 1,
            excerpt: 1,
            userId: 1,
            category: 1,
            releasedAt: 1,
            reviews: 1
        });

        if (books.length === 0) {
            res.status(404).json({ status: false, message: 'No books found' });
            return;
        }

        res.status(200).json({
            status: true,
            message: 'Books list',
            data: books
        });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch books' });
    }
};

const getById = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await Books.findById(bookId);
        // const book = await Books.findById(bookId).populate('reviewsData');

        if (!book) {
            res.status(404).json({ status: false, message: 'Book not found' });
            return;
        }

        if (book.coverImage) {
            const coverImageKey = book.coverImage.includes('.amazonaws.com/')
                ? book.coverImage.split('.amazonaws.com/')[1]
                : book.coverImage;

            const command = new GetObjectCommand({
                Bucket: config.aws.bucketName,
                Key: coverImageKey
            });

            book.coverImage = await getSignedUrl(s3, command, { expiresIn: 3600 });
        }

        res.status(200).json({ status: true, message: 'Book details', data: book });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch book', error: error.message });
    }
};

const add = async (req, res) => {
    try {
        if(!req?.userId) {
            res.status(401).json({ status: false, message: 'Please login to add a book' });
            return;
        }

        await uploadCoverImage(req, res);

        const doc = {
            title: req.body.title,
            excerpt: req.body.excerpt,
            userId: req.userId,
            ISBN: req.body.ISBN,
            category: req.body.category,
            subcategory: req.body.subcategory,
            releasedAt: req.body.releasedAt
        };

        if (req.file) {
            doc.coverImage = req.file.location;
        }
        
        const newBook = await Books.create(doc);
        res.status(201).json({ status: true, message: 'Book created successfully', data: newBook });
    } catch (error) {
        const message = error?.message?.toLowerCase()?.includes('upload')
            ? 'File upload failed'
            : 'Failed to create book';
        res.status(500).json({ status: false, message, error: error.message });
    }
};

const update = async (req, res) => {
    try {
        if(!req.params?.id) {
            res.status(400).json({ status: false, message: 'Book ID is required' });
            return;
        }

        const target = {
            _id: req.params.id,
            isDeleted: false,
            userId: req.userId
        };

        const allowedFields = ['title', 'excerpt', 'ISBN', 'releasedAt'];
        const updateData = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }

        const updatedBook = await Books.findOneAndUpdate(target, updateData, { returnDocument: 'after' });

        if (!updatedBook) {
            res.status(404).json({ status: false, message: 'Book not found' });
            return;
        }
        
        res.status(200).json({ status: true, message: 'Book updated successfully', data: updatedBook });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to update book' });
    }
};

const remove = async (req, res) => {
    try {
        if(!req.params?.id) {
            res.status(400).json({ status: false, message: 'Book ID is required' });
            return;
        }

        const target = {
            _id: req.params.id,
            isDeleted: false,
            userId: req.userId
        };

        const deletedBook = await Books.findOneAndUpdate(target, { isDeleted: true, deletedAt: new Date() }, { new: true });
        if (!deletedBook) {
            res.status(404).json({ status: false, message: 'Book not found' });
            return;
        }

        res.status(200).json({ status: true, message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to delete book' });
    }
};

export { getAll, getById, add, update, remove };