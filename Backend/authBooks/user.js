import mongoose from "mongoose";
import User from "../schemas/user.schema.js";

export const createNewUser = async (req, res) => {
  const user = req.body;

  // Check if all required fields are provided
  if (!user.userId || !user.userName || !user.userEmail || !user.userPassword) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the required fields.",
    });
  }

  if (!user.userRole) {
    user.userRole = "user";
  }

  // Check if the user already exists by email or userId
  try {
    const userExist = await User.findOne({ userEmail: user.userEmail });
    if (userExist) {
      return res.status(409).json({
        success: false,
        message: "User exists with this email. Try using a new email.",
      });
    }

    // Optionally check for unique userId if necessary
    const userIdExist = await User.findOne({ userId: user.userId });
    if (userIdExist) {
      return res.status(409).json({
        success: false,
        message: "User exists with this userId. Try using a new userId.",
      });
    }

    // Create a new user
    const newUser = new User(user);
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: newUser, // Optionally, return the newly created user
    });
  } catch (error) {
    console.error("Error while creating user:", error); // Log the error for debugging
    return res.status(500).json({
      success: false,
      message: "Server error while creating user.",
      error: error.message, // Optionally include the error message
    });
  }
};

export const login = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  if (!userEmail || !userPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ userEmail });
    if (!user || user.userPassword !== userPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials." });
    }

    req.session.user = {
      id: user._id,
      role: user.role,
    };
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      role: user.role,
      data:user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const logout = async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ success: false, message: "Logout Failed" });
    }
    res.clearCookie("connect.sid");
    res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  });
};

export const authenticateSession = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: "Unathorized" });
  }
  next();
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Server Error" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updateUser = req.body;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    await User.findByIdAndUpdate(id, updateUser, {
      new: true,
    });
    return res.status(200).json({ success: true, data: updateUser });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid Id" });
    }
    await User.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Server Error" });
  }
};
