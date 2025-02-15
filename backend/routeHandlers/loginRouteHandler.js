import { User } from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
export const loginRouteHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userLoggedIn = await User.findOne({ email });
    if (!userLoggedIn) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcryptjs.compare(
      password,
      userLoggedIn.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: userLoggedIn._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    userLoggedIn.lastLogin = new Date();

    await userLoggedIn.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfuly",
      userLoggedIn: { ...userLoggedIn._doc, password: undefined },
    });
  } catch (error) {
    console.log("error in login ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
