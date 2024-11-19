import { create } from "zustand";

export const useBookStore = create((set) => ({
  books: [],
  filteredBooks:[],
  setFilteredBooks:(filteredBooks)=>set({filteredBooks}),
  setBooks: (books) => set({ books }),
  createBook: async (newBook,navigate) => {
    if (
      !newBook.bookId ||
      !newBook.bookTitle ||
      !newBook.bookAuthor ||
      !newBook.bookGenre ||
      !newBook.image||
      !newBook.availableCopies
    ) {
      return { success: false, message: "Please fill all the fields" };
    }
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });
      const data = await res.json();

      if (!data.success) {
        return { success: false, message: data.message };
      }
      set((state) => ({ books: [...state.books, data.data] }));
      if (navigate) navigate("/");
      return { success: true, message: "Book created successfully" };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  },
  fetchBook: async () => {
    const res = await fetch("/api/book");
    const data = await res.json();
    set({ books: data.data });
  },
  deleteBook: async (pid) => {
    const res = await fetch(`/api/book/${pid}`, {
      method: "DELETE",
    });
    const data = await res.json();
    console.log(data);
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({ books: state.books.filter((book) => book._id !== pid) }));
    return { success: true, message: data.message };
  },
  updateBook: async (pid, updatedBook) => {
    const res = await fetch(`/api/book/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBook),
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({
      books: state.books.map((book) => (book._id === pid ? data.data : book)),
    }));
  },
}));
