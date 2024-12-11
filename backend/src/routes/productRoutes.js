import express from "express";
import {
  addProduct,
  getAllProducts,
  newCollection,
  popularInWomen,
  removeProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/add", addProduct);
router.get("/all", getAllProducts);
router.post("/removeproduct", removeProduct);
router.get("/newcollection", newCollection);
router.get("/popularinwomen", popularInWomen);
router.post("/addtocart", addToCart);

export default router;
