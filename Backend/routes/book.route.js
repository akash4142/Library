import {
  getAllBooks,
  addBook,
  deleteBook,
  updateBook,
  issueBook,
  returnBook,
} from "../authBooks/book.js";
import express from "express";
const router = express.Router();

router.get("/", getAllBooks);
router.post("/", addBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);
router.post("/issue",issueBook);
router.post("/return",returnBook)


export default router;
