// Importation des modules nécessaires
import express from "express"; // Framework pour créer le serveur web
const app = express();
import mongoose from "mongoose"; // ORM pour se connecter à MongoDB
import jwt from "jsonwebtoken"; // Génération et vérification de tokens JWT
import multer from "multer"; // Middleware pour gérer les téléchargements de fichiers
import path from "path"; // Module pour manipuler les chemins de fichiers
import cors from "cors"; // Middleware pour gérer le Cross-Origin Resource Sharing
import connectDB from "./src/config/db.config.js"; // Fonction pour se connecter à la base de données
import { type } from "os"; // Utilisation des fonctions du module OS

const port = process.env.PORT || 4000; // Définit le port du serveur

app.use(express.json()); // Permet la gestion des requêtes JSON
app.use(cors()); // Active le CORS pour permettre des requêtes depuis d'autres origines

// Connexion à la base de données MongoDB
connectDB();

// Route d'accueil pour vérifier que l'API fonctionne
app.get("/", (req, res) => {
  res.send("Express App is running");
});

// Démarrage du serveur
app.listen(port, (error) => {
  if (!error) {
    console.log(`Server is running on http://localhost:${port}`);
  } else {
    console.log("Error : " + error);
  }
});

// Configuration de multer pour gérer le stockage d'images
const storage = multer.diskStorage({
  destination: "./upload/images", // Dossier de destination des images
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(
        file.originalname
      )}` // Génération d'un nom de fichier unique
    );
  },
});
const upload = multer({ storage: storage }); // Création de l'instance multer avec le moteur de stockage

// Endpoint pour télécharger une image
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `/images/${req.file.filename}`, // Retourne l'URL de l'image
  });
});

// Route pour servir les images de manière statique
app.use("/images", express.static("upload/images"));

// Définition du modèle MongoDB pour les produits
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number },
  old_price: { type: Number },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// Endpoint pour ajouter un produit
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }

  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  await product.save(); // Sauvegarde du produit dans la base de données
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Endpoint pour supprimer un produit
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true, name: req.body.name });
});

// Endpoint pour récupérer tous les produits
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  res.send(products);
});

// Définition du modèle MongoDB pour les utilisateurs
const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
});

// Endpoint pour l'inscription d'un utilisateur
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: "existing user found with same email address",
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save(); // Sauvegarde de l'utilisateur dans la base de données
  const data = {
    user: {
      id: user.id,
    },
  };

  // Génération d'un token JWT pour l'utilisateur
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

// Endpoint pour la connexion de l'utilisateur
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong Password" });
    }
  } else {
    res.json({ success: false, errors: "Wrong Email Id" });
  }
});

// Endpoint pour obtenir la nouvelle collection de produits
app.get("/newcollection", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8); // Sélection des 8 derniers produits
  res.send(newcollection);
});

// Endpoint pour obtenir les produits populaires pour la catégorie femme
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4); // Sélection des produits populaires pour "femme"
  res.send(popular_in_women);
});

// Middleware pour authentifier l'utilisateur avec un token
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res
      .status(401)
      .send({ errors: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res
        .status(401)
        .send({ errors: "Please authenticate using valid token" });
    }
  }
};

// Endpoint pour ajouter un produit au panier de l'utilisateur
app.post("/addtocart", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Added");
});

// Endpoint pour retirer un produit du panier de l'utilisateur
app.post("/removefromcart", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Removed");
});

// Endpoint pour obtenir le panier de l'utilisateur
app.post("/getcart", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});
