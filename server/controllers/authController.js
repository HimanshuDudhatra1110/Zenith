import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Create a new user instance
    const user = new User({
      name,
      email,
      password,
      providers: ["local"],
    });
    // save the user
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // set token in httpOnly cookies
    res.cookie("token", token, {
      httpOnly: true, // prevent cookies from javascript access
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict", // Prevent CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    // send the response
    res.status(201).json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        diaryStreak: user.diaryStreak,
        habitScore: user.habitScore,
      },
      message: "User Registered successfully",
    });
  } catch (error) {
    console.error("Error registering user", error);

    res.status(500).json({ message: "Internal server error" });
  }
};

// login controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email })
      .select("+password")
      .select("-_id");
    if (!user) {
      return res.status(401).json({ message: "email not registered" });
    }

    // check if password is correct
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // set token in httpOnly cookies
    res.cookie("token", token, {
      httpOnly: true, // prevent cookies from javascript access
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict", // Prevent CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // send the response
    res.status(200).json({ user, message: "login successful" });
  } catch (error) {
    console.error("Error logging in user", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// logout controller
export const logoutController = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging in user", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
