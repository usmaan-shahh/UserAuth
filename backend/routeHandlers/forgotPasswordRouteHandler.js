import { User } from "../models/User";

export const forgetPasswordRoutehandler = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "USER NOT FOUND" });
    }
  } catch (error) {}
};
