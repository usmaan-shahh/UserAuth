export const logoutRouteHandler = async (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ success: true, message: "logged out successfully" });
};
