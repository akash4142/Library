import {
  getAllBooks,
  addBook,
  deleteBook,
  updateBook,
} from "../authBooks/book.js";
import express from "express";
const router = express.Router();

router.get("/", getAllBooks);
router.post("/", addBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;
