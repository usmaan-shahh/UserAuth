import { client, sender } from "../mailtrap/mailTrapConfig";
import { passwordResetRequestTemplate } from "../mailtrap/passwordResetRequestTemplate";
import { User } from "../models/User";
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

    const recipient = [
      {
        email: user.email,
      },
    ];
    const newResetLink = ` ${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    try {
      const response = await client.send({
        from: sender,
        to: recipient,
        subject: "RESET YOUR PASSWORD",
        html: passwordResetRequestTemplate.replace(
          "{ resetLink }",
          newResetLink
        ),
        category: "password reset",
      });
    } catch (error) {
      console.error("Error sending password reset email, error");
      throw new Error(`Error sending password reset email: ${error}`);
    }
  } catch (error) {}
};
