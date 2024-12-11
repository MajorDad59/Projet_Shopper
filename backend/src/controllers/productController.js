import Product from "../models/product.js";

export const addProduct = async (req, res) => {
  const product = new Product(req.body);
  await product.save(); // Sauvegarde du produit dans la base de données
  res.json({ success: true, product });
};

export const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

// Autres fonctions comme removeProduct, newCollection, popularInWomen
// Endpoint pour supprimer un produit
export const removeProduct = async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true, name: req.body.name });
};

// Endpoint pour obtenir la nouvelle collection de produits
export const newCollection = async (req, res) => {
  const products = await Product.find({});
  const newCollection = products.slice(1).slice(-8); // Sélection des 8 derniers produits
  res.json(newCollection);
};

// Endpoint pour obtenir les produits populaires pour la catégorie femme
export const popularInWomen = async (req, res) => {
  const products = await Product.find({ category: "women" });
  const popularInWomen = products.slice(0, 4); // Sélection des produits populaires pour "femme"
  res.json(popularInWomen);
};
