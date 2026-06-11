// ============================================================
// FICHIER : UpdateEvent.jsx
//
// ── ATELIER 3/4 — Q9  : Formulaire de mise à jour d'un événement
//                        avec invocation du service web (Axios)
// ── ATELIER 5   — Q5  : Ré-implémenter la modification avec Zustand
//
// DEUX MÉTHODES disponibles :
//  ① Axios directement  → bloc [AXIOS]   (commenté)
//  ② Zustand store      → bloc [ZUSTAND] (actif)
//
// Fonctionnement :
//   1. On récupère l'id depuis l'URL via useParams
//   2. On pré-remplit le formulaire avec les données existantes
//   3. On soumet → appel API → redirection vers /events
// ============================================================

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ── [AXIOS] Import du service Axios ──────────────────────────
// Atelier 3/4 — Q9 : service web editEvent
import { getallEvents, editEvent } from "../service/api";

// ── [ZUSTAND] Import du store ─────────────────────────────
// Atelier 5 — Q5 : store Zustand
import useEventStore from "../ZustandStores/useEventStore";

const UpdateEvent = () => {
  const { id }   = useParams();   // récupère l'id depuis /events/update/:id
  const navigate = useNavigate();

  // État du formulaire — mêmes champs que AddEvent
  const [formData, setFormData] = useState({
    name:           "",
    description:    "",
    price:          0,
    nbTickets:      0,
    nbParticipants: 0,
    img:            "",
    like:           false,
  });

  // ── [ZUSTAND] Action de modification depuis le store ──────
  // Atelier 5 — Q5
  const events             = useEventStore((state) => state.events);
  const updateEventObject  = useEventStore((state) => state.updateEventObject);


  // ════════════════════════════════════════════════════════════
  // MÉTHODE ① — Pré-remplissage avec AXIOS
  // ════════════════════════════════════════════════════════════
  // Atelier 3/4 — Q9 : getallEvents(id) → GET /events/:id
  // Pour utiliser cette méthode :
  //   1. Décommenter ce useEffect
  //   2. Commenter le useEffect ZUSTAND ci-dessous
  // ────────────────────────────────────────────────────────────
  /*
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getallEvents(id); // GET /events/:id
        setFormData(response.data);
      } catch (err) {
        console.error("Erreur chargement événement :", err);
      }
    };
    fetchEvent();
  }, [id]);
  */
  // ════════════════════════════════════════════════════════════


  // ════════════════════════════════════════════════════════════
  // MÉTHODE ② — Pré-remplissage avec ZUSTAND
  // ════════════════════════════════════════════════════════════
  // Atelier 5 — Q5 : on cherche l'événement directement dans le store
  // Pas besoin d'appel réseau → les données sont déjà en mémoire
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    const found = events.find((e) => String(e.id) === String(id));
    if (found) {
      setFormData(found);
    }
  }, [id, events]);
  // ════════════════════════════════════════════════════════════


  // Gestionnaire générique : met à jour le champ correspondant
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  // ════════════════════════════════════════════════════════════
  // MÉTHODE ① — Soumission avec AXIOS
  // ════════════════════════════════════════════════════════════
  // Atelier 3/4 — Q9 : editEvent(id, formData) → PUT /events/:id
  // Pour utiliser cette méthode :
  //   1. Décommenter ce bloc handleSubmit
  //   2. Commenter le bloc handleSubmit ZUSTAND ci-dessous
  // ────────────────────────────────────────────────────────────
  /*
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editEvent(id, formData); // PUT /events/:id via Axios
      navigate("/events");
    } catch (err) {
      console.error("Erreur modification :", err);
    }
  };
  */
  // ════════════════════════════════════════════════════════════


  // ════════════════════════════════════════════════════════════
  // MÉTHODE ② — Soumission avec ZUSTAND
  // ════════════════════════════════════════════════════════════
  // Atelier 5 — Q5 : updateEventObject gère :
  //   → PUT /events/:id via Axios
  //   → Mise à jour automatique du store (liste des événements)
  // ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEventObject(id, formData); // ← Q5 : modification via store Zustand
      navigate("/events");
    } catch (err) {
      console.error("Erreur modification :", err);
    }
  };
  // ════════════════════════════════════════════════════════════


  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h3>Modify {formData.name}</h3>

      <form onSubmit={handleSubmit}>

        {/* Nom de l'événement */}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Prix */}
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            className="form-control"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
          />
        </div>

        {/* Nombre de tickets */}
        <div className="mb-3">
          <label className="form-label">Number of Tickets</label>
          <input
            className="form-control"
            type="number"
            name="nbTickets"
            value={formData.nbTickets}
            onChange={handleChange}
            min="0"
          />
        </div>

        {/* Image */}
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            className="form-control"
            type="file"
            name="img"
            onChange={handleChange}
          />
        </div>

        {/* Boutons d'action */}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-warning">
            Update
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/events")}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default UpdateEvent;
