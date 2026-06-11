// ============================================================
// FICHIER : RootLayout.jsx
// Layout principal partagé par toutes les routes
// Structure : <NavigationBar /> + <Outlet /> (contenu des routes enfants)
// <Suspense> gère le fallback pendant le chargement lazy des composants
// ============================================================

import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import NavigationBar from "./NavigationBar";

const RootLayout = () => {
  return (
    <>
      {/* NavigationBar toujours visible sur toutes les pages */}
      <NavigationBar />

      {/* Suspense : affiche "Loading..." pendant le chargement
          des composants importés en lazy (lazy(() => import(...)))   */}
      <Suspense fallback={<div className="text-center mt-5">Loading...</div>}>

        {/* Outlet : emplacement où s'affiche le composant de la route active
            Ex : /events → <Events />, /events/add → <AddEvent />, etc.  */}
        <Outlet />

      </Suspense>
    </>
  );
};

export default RootLayout;
