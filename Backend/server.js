import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import bookRoutes from "./routes/book.route.js";
import userRoutes from "./routes/user.route.js";
import path from "path";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());


const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1800000,
    },
  })
);

connectDB();

app.use("/api/book/", bookRoutes);
app.use("/api/user/", userRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server is listening on the port  :" + PORT);
});
