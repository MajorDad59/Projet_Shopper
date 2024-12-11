import React from "react";
import "./Breadcrumb.css";
import arrow_icon from "../Assets/breadcrum_arrow.png";

// Composant Breadcrumb qui prend des props pour afficher un fil d'Ariane
const Breadcrumb = (props) => {
  // Déstructuration des props pour obtenir l'objet product
  const { product } = props;

  return (
    // Structure HTML du fil d'Ariane
    <div className="breadcrumb">
      HOME <img src={arrow_icon} alt="" />{" "}
      {/* Lien "HOME" avec icône de flèche */}
      SHOP <img src={arrow_icon} alt="" />{" "}
      {/* Lien "SHOP" avec icône de flèche */}
      {product.category} <img src={arrow_icon} alt="" />{" "}
      {/* Catégorie du produit */}
      {product.name} {/* Nom du produit */}
    </div>
  );
};

export default Breadcrumb;
