
import { User } from "../models/User.js";

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  // Validate the verification code
  if (!code || typeof code !== "string" || code.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Invalid verification code",
    });
  }

  try {
    // Atomically find and update the user to prevent race conditions
    const updatedUser = await User.findOneAndUpdate(
      {
        verificationToken: code,
        verificationTokenExpiresAt: { $gt: Date.now() },
        isVerified: false, // Ensure user is not already verified
      },

      {
        $set: { isVerified: true }, //$set	Updates/creates fields
        $unset: {
          // $unset: Removes fields entirely
          verificationToken: "",
          verificationTokenExpiresAt: "",
        },
      },

      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    // Send response first to improve client perceived performance
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

    // Send welcome email asynchronously after response
    const recipient = [{ email: updatedUser.email }];

    client
      .send({
        from: sender,
        to: recipient,
        template_uuid: "7de73e73-3df2-4986-b0e1-78622ccfd749",
        template_variables: {
          name: updatedUser.name,
          company_info_name: "Auth Company",
        },
      })
      .then((emailResponse) => {
        console.log("Welcome email sent successfully", emailResponse);
      })
      .catch((emailError) => {
        console.error("Error sending welcome email", emailError);
      });
  } catch (error) {
    console.error("Error verifying email", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Best Practises

// 1.)Use $unset for Permanent Removal
// 2.)Use findOneAndUpdate (as in the code) for atomic updates.
// 3.)When MongoDB executes a findOneAndUpdate (or any atomic write operation like updateOne), it locks the document for the duration of the update to ensure atomicity
// 4.)This prevents other operations from modifying the same document concurrently.
