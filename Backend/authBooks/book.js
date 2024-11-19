import mongoose from "mongoose";
import Book from "../schemas/book.schema.js";

export const getAllBooks = async (req, res) => {
  try {
    const Allbooks = await Book.find({});
    res.status(200).json({ success: true, data: Allbooks });
  } catch (error) {
    return res.status(400).json({ success: false, message: error });
  }
};

export const addBook = async (req, res) => {
  const newBook = req.body;
  if (
    !newBook.bookId ||
    !newBook.bookTitle ||
    !newBook.bookAuthor ||
    !newBook.bookGenre ||
    !newBook.image||
    !newBook.availableCopies
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please Fill all the fields" });
  }

  
  try {
    const savedBook = await new Book(newBook).save();
    res
      .status(200)
      .json({ 
        success: true, 
        message: "Book has been added to the database",
        data:savedBook, 
      });
  } catch (error) {
    return res.status(400).json({ success: false, message: error });
  }
};

export const deleteBook = async (req, res) => {
  const { id } = req.params;

  if (mongoose.isValidObjectId(id)) {
    try {
      await Book.findByIdAndDelete(id);
      res
        .status(200)
        .json({ success: true, message: "Book has been deleted " });
    } catch (error) {
      return res.status(400).json({ success: false, message: error });
    }
  } else {
    return res.status(400).json({ success: false, message: "Invalid Book ID" });
  }
};

export const updateBook = async (req, res) => {
  const { id } = req.params;
  const updateBook = req.body;

  if (mongoose.isValidObjectId(id)) {
    try {
      const updatedBook = await Book.findByIdAndUpdate(id, updateBook, {
        new: true,
      });
      res.status(200).json({ success: true, data: updatedBook });
    } catch (error) {
      return res.status(400).json({ success: false, data: "Server error" });
    }
  } else {
    return res.status(400).json({ success: false, data: "Invalid ID" });
  }
};
