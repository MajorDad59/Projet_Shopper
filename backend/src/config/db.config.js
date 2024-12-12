// Importation des modules nécessaires
import mongoose from "mongoose"; // Module pour interagir avec MongoDB
import dotenv from "dotenv"; // Module pour charger les variables d'environnement

// Charger les variables d'environnement depuis un fichier .env
dotenv.config();

// Fonction pour se connecter à la base de données
const connectDB = () => {
  try {
    // Connexion à MongoDB en utilisant l'URI défini dans les variables d'environnement
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Option pour utiliser le nouvel analyseur d'URL de MongoDB
      useUnifiedTopology: true, // Option pour utiliser le moteur d'unification de topologie
    });
  } catch (error) {
    // Affiche l'erreur si la connexion échoue et arrête le processus
    console.log(`Erreur de connexion : ${error.message}`);
    process.exit(1); // 1 indique une erreur fatale
  }

  // Récupération de la connexion active
  const dbConnection = mongoose.connection;

  // Événement déclenché lorsque la base de données est connectée avec succès
  dbConnection.once("open", () => {
    console.log("Connexion à la base de données réussie !");
  });

  // Gestion des erreurs pendant la connexion
  dbConnection.on("error", (err) => {
    console.log(`Erreur de connexion : ${err}`);
  });
};

// Exportation de la fonction pour être utilisée dans d'autres parties de l'application
export default connectDB;
