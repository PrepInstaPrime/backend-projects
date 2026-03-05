import mongoose from "mongoose";
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      trim: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "UserId is required"],
      ref: "User",
    },

    ISBN: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true,
      match: [
        /^(?:ISBN(?:-13)?:?\s*)?(?=[0-9X]{10}$|(?=(?:[0-9]+[-\s]){3})[-\s0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[-\s]){4})[-\s0-9]{17}$)[0-9]{1,5}[-\s]?[0-9]+[-\s]?[0-9]+[-\s]?[0-9X]$/,
        "Invalid ISBN format",
      ],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    subcategory: {
      type: String,
      required: [true, "Subcategory is required"],
      trim: true,
    },

    reviews: {
      type: Number,
      default: 0,
      min: [0, "Reviews count cannot be negative"],
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    releasedAt: {
      type: Date,
      required: [true, "Release date is required"],
      validate: {
        validator: function (value) {
          return /^\d{4}-\d{2}-\d{2}$/.test(value.toISOString().split("T")[0]);
        },
        message: "releasedAt must be in YYYY-MM-DD format",
      },
    },
  },
  { timestamps: true },
);

const bookModel = mongoose.model("Book", bookSchema);

export default bookModel;
