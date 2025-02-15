import { User } from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginRouteHandler = async (req, res) => {
  // Extract email and password from req.body.
  const { email, password } = req.body;

  try {
    // Check if a user with that email exists in the User collection.
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the entered password with the hashed password stored in the database.
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Update last login timestamp
    user.lastLogin = new Date();

    await user.save();

    // Generate a JWT token if authentication is successful.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 5. Set secure HTTP-only cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    // 6.Remove sensitive data before sending the response.
    const userData = user.toObject();
    delete userData.password;

    // 7. Send success response
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
