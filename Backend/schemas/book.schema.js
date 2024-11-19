import mongoose, { Schema } from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    bookId: {
      type: Number,
      require: true,
      unique: true,
    },
    bookTitle: {
      type: String,
      require: true,
    },
    bookAuthor: {
      type: String,
      require: true,
    },
    bookGenre: {
      type: String,
      require: true,
    },
    bookDesc:{
      type:String,
      require:true,
    },
    image:{
      type:String,
      required:true,
    },
    availableCopies: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", BookSchema);
export default Book;
