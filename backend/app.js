import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import connectDB from "./src/config/db.config.js";

// Importation des routes
import productRoutes from "./src/routes/productRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// Connexion à MongoDB
connectDB();

// Utilisation des routes
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

// Route d'accueil pour vérifier que l'API fonctionne
app.get("/", (_req, res) => res.send("Express App is running"));

// Démarrage du serveur
app.listen(port, (error) => {
  if (!error) {
    console.log(`Server is running on http://localhost:${port}`);
  } else {
    console.log("Error : " + error);
  }
});
