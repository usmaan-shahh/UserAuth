import bcryptjs from "bcryptjs";
import { client, sender } from "../mailtrap/mailTrapConfig.js";
import { passwordResetSuccessTemplate } from "../mailtrap/passwordResetSuccessTemplate.js";
import { User } from "../models/User.js";

export const resetPasswordRouteHandler = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validate input
    if (!token || typeof token !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Find and update user atomically
    const user = await User.findOneAndUpdate(
      {
        resetPasswordToken: token,
        resetPasswordExpiresAt: { $gt: Date.now() },
      },
      {
        $set: { password: await bcryptjs.hash(password, 10) },
        $unset: {
          resetPasswordToken: "",
          resetPasswordExpiresAt: "",
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Send response immediately
    res.json({
      success: true,
      message: "Password reset successful",
    });

    // Send email async after response
    try {
      await client.send({
        from: sender,
        to: [{ email: user.email }],
        subject: "Password reset successful",
        html: passwordResetSuccessTemplate,
        category: "password reset",
      });
      console.log("Password reset email sent successfully");
    } catch (emailError) {
      console.error("Error sending password reset email:", emailError);
    }
  } catch (error) {
    console.error("Error in resetting password:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
