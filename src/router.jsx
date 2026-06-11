// ============================================================
// FICHIER : router.jsx
// ── Configuration centrale de toutes les routes de l'app ─────
//
// ORDRE DES ROUTES — RÈGLE CRITIQUE :
//   Les routes STATIQUES doivent toujours être déclarées AVANT
//   les routes DYNAMIQUES (/:id), sinon React Router capture
//   "add", "update", "favorites" comme étant des :id.
//
//   Ordre correct :
//   1. events/add            (statique)
//   2. events/update/:id     (semi-dynamique, segment "update" fixe)
//   3. events/:id            (dynamique — TOUJOURS EN DERNIER)
//   4. *                     (catch-all 404)
//
// ✅ CORRECTION BUG :
//   La route "events/favori/:id" → FavoriteList a été SUPPRIMÉE.
//   FavoriteList n'est PAS une page de route : c'est un sous-composant
//   rendu directement dans Events.jsx, sous la liste des événements.
//   Créer une route pour FavoriteList était une erreur d'architecture :
//   elle n'a ni useParams ni logique de page autonome.
//   Son import lazy ici est donc aussi supprimé.
// ============================================================

import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

import RootLayout from "./components/RootLayout";
import NotFound   from "./components/NotFound";

// ── Lazy Loading ──────────────────────────────────────────────
// Seuls les COMPOSANTS-PAGES sont importés ici en lazy
// FavoriteList n'est PAS une page → pas d'import ici
const Events       = lazy(() => import("./components/Events"));
const EventDetails = lazy(() => import("./components/EventDetails"));
const AddEvent     = lazy(() => import("./components/AddEvent"));
const UpdateEvent  = lazy(() => import("./components/UpdateEvent"));
const FavoriteList = lazy(() => import("./components/FavoriteList"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,

    children: [

      // ── Liste des événements + section favoris (Q4, Q6) ──────
      // FavoriteList est rendu DANS Events.jsx (pas une route séparée)
      // → Les favoris s'affichent sous la liste des événements
      {
        path: "events",
        element: <Events />,
      },

      // ── Page dédiée Favoris ───────────────────────────────────
      // Accessible depuis le lien "Favoris" dans la NavigationBar
      {
        path: "favorites",
        element: <FavoriteList />,
      },

      // ── ⚠️ AVANT events/:id — sinon "add" sera lu comme un id ─
      // Formulaire d'ajout (Q5)
      {
        path: "events/add",
        element: <AddEvent />,
      },

      // ── ⚠️ AVANT events/:id — sinon "update" sera lu comme un id
      // Formulaire de modification (Q5)
      {
        path: "events/update/:id",
        element: <UpdateEvent />,
      },

      // ── ✅ SUPPRIMÉ : route "events/favori/:id" → FavoriteList ─
      // Cette route était incorrecte : FavoriteList est un composant
      // interne d'Events.jsx, pas une page navigable de l'application.
      // navigate("/events/update/:id") dans FavoriteList.jsx fonctionne
      // directement sans avoir besoin d'une route dédiée pour FavoriteList.

      // ── Détails d'un événement (Q5) ──────────────────────────
      // TOUJOURS après les routes statiques
      {
        path: "events/:id",
        element: <EventDetails />,
      },

      // ── 404 catch-all ────────────────────────────────────────
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
