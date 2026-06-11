// ============================================================
// FICHIER : router.jsx
// Rôle : Configuration centrale de toutes les routes de l'app
// Utilisé par main.jsx via <RouterProvider router={router} />
// ============================================================

import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

import RootLayout from "./components/RootLayout";
import NotFound from "./components/NotFound";

// ── Lazy Loading ─────────────────────────────────────────────
// Chaque composant est chargé uniquement quand sa route est visitée
// → améliore les performances (bundle splitting)
const Events       = lazy(() => import("./components/Events"));
const EventDetails = lazy(() => import("./components/EventDetails"));
const AddEvent     = lazy(() => import("./components/AddEvent"));
const UpdateEvent  = lazy(() => import("./components/UpdateEvent"));

const router = createBrowserRouter([
  {
    // ── Route racine ─────────────────────────────────────────
    // RootLayout contient la NavBar + <Outlet /> (routes enfants)
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />, // affiché si erreur de navigation

    children: [

      // ── Q5 : Liste des événements (GET /events) ──────────────
      {
        path: "events",
        element: <Events />,
      },

      // ── Q7 : Formulaire d'ajout (POST /events) ───────────────
      // ⚠️ IMPORTANT : "events/add" doit être AVANT "events/:id"
      // Sinon React Router interpréterait "add" comme un :id
      {
        path: "events/add",
        element: <AddEvent />,
      },

      // ── Q9 : Formulaire de modification (PUT /events/:id) ────
      // Doit aussi être avant "events/:id" pour éviter tout conflit
      {
        path: "events/update/:id",
        element: <UpdateEvent />,
      },

      // ── Q6 : Détails d'un événement (GET /events/:id) ────────
      // Placé APRÈS les routes statiques (/add, /update/:id)
      // pour éviter qu'elles soient capturées comme des :id
      {
        path: "events/:id",
        element: <EventDetails />,
      },

      // ── Catch-all : toute route inconnue → 404 ───────────────
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
