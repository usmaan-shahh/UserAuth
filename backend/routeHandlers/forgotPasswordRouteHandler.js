

import { User } from "../models/User.js";
import crypto from "crypto";

export const forgetPasswordRoutehandler = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "USER NOT FOUND" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset token generated",
      resetToken, // In a real application, you would send this token via email to the user.
    });
  } catch (error) {
    console.error("Error in forgetPasswordRoutehandler:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
