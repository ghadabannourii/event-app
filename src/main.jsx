// ============================================================
// QUESTION 2 & 3 : Injection du routeur dans l'application
// RouterProvider remplace <App /> et fournit le routeur
// à toute l'arborescence de composants
// ============================================================
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom"; // Q2 : import
import router from "./router"; // Q4 : notre config de routes
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Q3 : RouterProvider injecte le routeur dans l'app */}
    <RouterProvider router={router} />
  </React.StrictMode>
);