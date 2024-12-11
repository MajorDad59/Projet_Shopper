import express from "express";
import { fetchUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Utilisation de fetchUser sur des routes sécurisées comme /addtocart, /removefromcart

// Endpoint pour ajouter un produit au panier de l'utilisateur
export const addToCart = fetchUser, async (req, res) => {
  const userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.json(addToCart);
};



export default router;
