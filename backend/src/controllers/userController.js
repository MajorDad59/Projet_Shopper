import User from "../models/User.js";

export const registerUser = async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json({ success: true, user });
};

export const loginUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user && user.password === req.body.password) {
    // JWT Token generation and response
  } else {
    res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });
  }
};

// Fonctions pour addToCart, removeFromCart, getCart
