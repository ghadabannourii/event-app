// ============================================================
// COMPOSANT NotFound
// Affiché automatiquement quand l'URL ne correspond à aucune route
// Utilise l'image notfound.jfif fournie dans les assets
// ============================================================
import notFoundImg from "/images/notfound.jfif";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <img src={notFoundImg} alt="404 Not Found" style={{ maxWidth: "100%" }} />
    </div>
  );
};

export default NotFound;