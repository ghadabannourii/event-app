// ============================================================
// FICHIER : AddEvent.jsx
// ── Q5 : Formulaire d'ajout d'un événement ───────────────────
//
// DEUX MÉTHODES disponibles :
//  ① Axios directement  → bloc [AXIOS]   (commenté)
//  ② Zustand store      → bloc [ZUSTAND] (actif)
//
// Après ajout → redirection vers /events via useNavigate
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── [AXIOS] Import du service Axios ──────────────────────────
//import { addEvent } from "../service/api";

// ── [ZUSTAND] Import du store ─────────────────────────────
import useEventStore from "../ZustandStores/useEventStore";

const AddEvent = () => {
  const navigate = useNavigate();

  // État du formulaire — un objet pour tous les champs
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    nbTickets: 0,
    nbParticipants: 0,
    like: false,
    img: "",
  });

  // ── [ZUSTAND] Récupération de l'action d'ajout ────────────
  const addEventObject = useEventStore((state) => state.addEventObject);

  // Gestionnaire générique : met à jour le champ correspondant
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ════════════════════════════════════════════════════════════
  // MÉTHODE ① — Soumission avec AXIOS (méthode originale)
  // ════════════════════════════════════════════════════════════
  // Pour utiliser cette méthode :
  //   1. Décommenter ce bloc handleSubmit
  //   2. Commenter le bloc handleSubmit ZUSTAND ci-dessous
  // ────────────────────────────────────────────────────────────
  /*
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEvent(formData);  // POST /events via Axios
      navigate("/events");
    } catch (err) {
      console.error("Erreur ajout :", err);
    }
  };
  */
  // ════════════════════════════════════════════════════════════


  // ════════════════════════════════════════════════════════════
  // MÉTHODE ② — Soumission avec ZUSTAND (méthode Atelier 5)
  // ════════════════════════════════════════════════════════════
  // addEventObject gère :
  //   → POST /events via Axios
  //   → Mise à jour automatique du store (liste des événements)
  // ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEventObject(formData); // ← Q5 : ajout via store Zustand
      navigate("/events");
    } catch (err) {
      console.error("Erreur ajout :", err);
    }
  };
  // ════════════════════════════════════════════════════════════

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h3>Add a new Event to your Event List</h3>

      <form onSubmit={handleSubmit}>

        {/* Nom de l'événement */}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            name="name"
            value={formData.name}
            placeholder="Enter a Name"
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
            placeholder="Enter description"
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
          <button type="submit" className="btn btn-primary">
            Add an Event
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

export default AddEvent;
