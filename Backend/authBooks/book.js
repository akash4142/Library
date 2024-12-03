import mongoose from "mongoose";
import Book from "../schemas/book.schema.js";
import User from "../schemas/user.schema.js";

export const getAllBooks = async (req, res) => {
  try {
    const Allbooks = await Book.find({});
    res.status(200).json({ success: true, data: Allbooks });
  } catch (error) {
    return res.status(400).json({ success: false, message: error });
  }
};

export const getAllIssuedBooks = async (req, res) => {
  const {id} = req.params;
  if (mongoose.isValidObjectId(id)) {
  try {
     const user = await User.findOne({_id:id}).populate("borrowedBooks.book").exec();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const issuedBooksData = user.borrowedBooks.map(borrowedBook => ({
      bookTitle: borrowedBook.book.bookTitle,
      bookAuthor: borrowedBook.book.bookAuthor,
      issuedDate: borrowedBook.issuedDate,
      returnDate: borrowedBook.returnDate
    }));

    res.status(200).json({ success: true, data: issuedBooksData });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}else {
  return res.status(400).json({ success: false, message: "Invalid Book ID" });
}
};

export const addBook = async (req, res) => {
  const newBook = req.body;
  if (
    !newBook.bookId ||
    !newBook.bookTitle ||
    !newBook.bookAuthor ||
    !newBook.bookGenre ||
    !newBook.image ||
    !newBook.availableCopies
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please Fill all the fields" });
  }

  try {
    const savedBook = await new Book(newBook).save();
    res.status(200).json({
      success: true,
      message: "Book has been added to the database",
      data: savedBook,
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

export const issueBook = async (req, res) => {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all the fields." });
  }

  try {
    const user = await User.findOne({ _id: userId });
    const book = await Book.findOne({ _id: bookId });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    if (book.availableCopies <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Book not available" });
    }

    if (user.borrowedBooks.some((b) => b.book.toString() === bookId)) {
      return res
        .status(400)
        .json({ success: false, message: "Book already issued" });
    }

    user.borrowedBooks.push({ book: bookId });
    book.availableCopies = parseInt(book.availableCopies, 10) + 1;

    user.notifications.push({
      message:`Book titled "${book.bookTitle}" has been issued to you`,
      type:"ISSUE",
    });

    await user.save();
    await book.save();

    return res
      .status(200)
      .json({ success: true, message: "Book issued successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const returnBook = async (req, res) => {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all the fields." });
  }

  try {
    const user = await User.findOne({ _id: userId });
    const book = await Book.findOne({ _id: bookId });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    const borrowedBookIndex = user.borrowedBooks.findIndex(
      (b) => b.book.toString() === bookId
    );

    if (borrowedBookIndex === -1) {
      return res
        .status(400)
        .json({ success: false, message: "Book not borrowed" });
    }

    // Remove the book from the user's borrowedBooks list
    user.borrowedBooks.splice(borrowedBookIndex, 1);

    // Increment the available copies of the book
    book.availableCopies = parseInt(book.availableCopies, 10) + 1;

    user.notifications.push({
      message:`book titled "${book.bookTitle}" has been returned.`,
      type:"RETURN",
    })
    await user.save();
    await book.save();

    return res
      .status(200)
      .json({ success: true, message: "Book returned successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



