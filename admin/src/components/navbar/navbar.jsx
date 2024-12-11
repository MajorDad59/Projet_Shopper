import React from "react";
import "./navbar.css";
import navlogo from "../../assets/nav-logo.svg";
import navProfile from "../../assets/nav-profile.svg";

const navbar = () => {
  return (
    <div className="navbar">
      <img src={navlogo} className="nav-logo" alt="" />
      <img src={navProfile} className="nav-profile" alt="" />
    </div>
  );
};
export default navbar;
