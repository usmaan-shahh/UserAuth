import { User } from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { client } from "../mailtrap/mailTrapConfig.js";
import { sender } from "../mailtrap/mailTrapConfig.js";
import { verificationEmailTemplate } from "../mailtrap/verificationEmailTemplate.js";

export const signupRouteHandler = async (request, response) => {
  // Extract email, password, and name from request.body.
  const { email, password, name } = request.body;

  try {
    if (!email || !password || !name) {
      return response
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if the user already exists in the User collection
    const userAlreadyExists = await User.exists({ email }); //Find a document in the User collection where the email field is "example@email.com

    if (userAlreadyExists) {
      return response
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    // Hash the password using bcryptjs
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Generate a 6-Digit verification token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    //Create a newUser document in users collection
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await newUser.save();

    // Generate a JWT token for authentication
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { //The payload helps the server know who's making the request.
      expiresIn: "1h",
    });

        // Set token as an HTTP-only cookie
    response.cookie("authToken", token, {
      // "authToken" is the name of the cookie.
      // token is the value stored inside the cookie (usually a JWT token).
      httpOnly: true, // Prevent client-side access to the cookie
      secure: false,
      // secure: false allows cookies to be sent over HTTP (useful in development).
      // secure: true enforces cookies to be sent only over HTTPS (for security in production).
      sameSite: "strict", // Protect against CSRF attacks
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    //  E-mail verification code for signup starts:
    const recipient = [
      {
        email: newUser.email,
      },
    ];

    try {
      const response = await client.send({
        from: sender,
        to: recipient,
        subject: "Please Verify Your Email",
        html: verificationEmailTemplate.replace(
          "{verificationCode}",
          newUser.verificationToken
        ),
        category: "Email Verification",
      });
      console.log("Email sent successfully", response);
    } catch (error) {
      console.error("Error sending verification", error);
      throw new Error(`Error sending verification email ${error}`);
    }
    //  E-mail verification code for signup ends here

    // Send a success response with the newly created user (excluding the password).
    response.status(201).json({
      success: true,
      message: "User created successfully. Please verify your email.",
      newUser: { ...newUser._doc, password: undefined }, //._doc Removes Mongoose metadata and returns a clean JavaScript object.
    });
  } catch (error) {
    return response
      .status(500)
      .json({ success: false, message: error.message });
  }
};

//  The secret key "your_secret_key" is used to sign (encrypt) the token.
//  Payload → Contains user data (id, email).
