import React from "react";
import "./admin.css";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import { Routes, Route } from "react-router-dom";
import AddProduct from "../../components/addProduct/addProduct.jsx";
import ListProduct from "../../components/listProduct/listProduct.jsx";

const admin = () => {
  return (
    <div className="admin">
      <Sidebar />
      <Routes>
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/listproduct" element={<ListProduct />} />
      </Routes>
    </div>
  );
};
export default admin;
