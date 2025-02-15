import { client, sender } from "../mailtrap/mailTrapConfig.js";
import { passwordResetRequestTemplate } from "../mailtrap/passwordResetRequestTemplate.js";
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

    const recipient = [{ email: user.email }];

    try {
      await client.send({
        from: sender,
        to: recipient,
        subject: "RESET YOUR PASSWORD",
        html: passwordResetRequestTemplate.replace(
          "{ resetLink }",
          `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        ),
        category: "password reset",
      });

      return res.json({ success: true, message: "Reset email sent" });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return res
        .status(500)
        .json({ success: false, message: "Email sending failed" });
    }
  } catch (error) {
    console.error("Error in forgetPasswordRoutehandler:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
