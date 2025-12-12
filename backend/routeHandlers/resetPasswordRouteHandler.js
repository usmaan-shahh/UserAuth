import bcryptjs from "bcryptjs";


import { User } from "../models/User.js";

export const resetPasswordRouteHandler = async (req, res) => {
  // Extracts the token from req.params.
  // Extracts the new password from req.body.
  const { token } = req.params;
  const { password } = req.body;
  try {
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

    res.json({
      success: true,
      message: "Password reset successful",
    });

    try {
      await client.send({
        from: sender,
        to: [{ email: user.email }],
        subject: "Password reset successful",
        html: passwordResetSuccessTemplate,
        category: "password reset",
      });
      console.log("Password-Changed email sent successfully");
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
