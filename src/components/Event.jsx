// ============================================================
// FICHIER : Event.jsx
// ── Q4 : Suppression via Zustand (ou Axios commenté) ─────────
// ── Q5 : Bouton Update → navigate("/events/update/:id") ──────
// ── Q6 : Boutons "Ajouter aux Favoris" / "Retirer des Favoris"
//
// DEUX MÉTHODES pour la suppression :
//  ① Axios directement  → bloc [AXIOS]   (commenté)
//  ② Zustand store      → bloc [ZUSTAND] (actif)
// ============================================================

import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Badge } from "react-bootstrap";

// ── [AXIOS] Import du service pour la suppression ────────────
//import { deleteEvent } from "../service/api";

// ── [ZUSTAND] Import des stores ──────────────────────────────
import useEventStore    from "../ZustandStores/useEventStore";
import useFavoriteStore from "../ZustandStores/useFavoriteStore";

// Props reçues depuis Events.jsx :
// event      → objet événement
// index      → position dans le tableau (pour bookEvent / toggleLike)
// bookEvent  → callback réservation
// toggleLike → callback like/dislike
// onDeleted  → callback pour notifier Events.jsx après suppression
const Event = ({ event, index, bookEvent, toggleLike, onDeleted }) => {
  const navigate = useNavigate();

  // ── [ZUSTAND] Actions favoris depuis le store ─────────────
  const addFavorite    = useFavoriteStore((state) => state.addFavorite);
  const removeFavorite = useFavoriteStore((state) => state.removeFavorite);
  const isFavorite     = useFavoriteStore((state) => state.isFavorite);

  // ── [ZUSTAND] Action suppression depuis le store ──────────
  const deleteEventObject = useEventStore((state) => state.deleteEventObject);

  // ════════════════════════════════════════════════════════════
  // MÉTHODE ① — Suppression avec AXIOS (méthode originale)
  // ════════════════════════════════════════════════════════════
  // Pour utiliser cette méthode :
  //   1. Décommenter ce bloc handleDelete
  //   2. Commenter le bloc handleDelete ZUSTAND ci-dessous
  // ────────────────────────────────────────────────────────────
  /*
  const handleDelete = async () => {
    if (window.confirm(`Supprimer "${event.name}" ?`)) {
      try {
        await deleteEvent(event.id);   // DELETE /events/:id via Axios
        onDeleted(event.id);           // informe Events.jsx → filtre la liste locale
      } catch (err) {
        console.error("Erreur suppression :", err);
      }
    }
  };
  */
  // ════════════════════════════════════════════════════════════


  // ════════════════════════════════════════════════════════════
  // MÉTHODE ② — Suppression avec ZUSTAND (méthode Atelier 5)
  // ════════════════════════════════════════════════════════════
  // deleteEventObject gère à la fois :
  //   → L'appel DELETE /events/:id via Axios
  //   → La mise à jour automatique du store (pas besoin de onDeleted)
  // onDeleted est quand même appelé pour rester compatible avec Events.jsx
  // ────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (window.confirm(`Supprimer "${event.name}" ?`)) {
      try {
        await deleteEventObject(event.id); // ← Q4 : suppression via store Zustand
        onDeleted(event.id);               // notifie Events.jsx (compatibilité)
      } catch (err) {
        console.error("Erreur suppression :", err);
      }
    }
  };
  // ════════════════════════════════════════════════════════════

  // ── Q6 : Toggle favori ───────────────────────────────────
  // Si déjà favori → retire | Sinon → ajoute
  const handleToggleFavorite = () => {
    if (isFavorite(event.id)) {
      removeFavorite(event.id);
    } else {
      addFavorite(event);
    }
  };

  return (
    <Card className="h-100 shadow border-0 rounded-3 overflow-hidden">
      {/* Image de l'événement — sold_out si plus de tickets */}
      <Card.Img
        variant="top"
        src={event.nbTickets === 0 ? "/images/sold_out.png" : event.img}
        style={{ height: "200px", objectFit: "cover" }}
      />

      <Card.Body className="d-flex flex-column p-3">

        {/* Nom cliquable → EventDetails (/events/:id) */}
        <Card.Title className="fw-bold fs-6 mb-2">
          <Link
            to={`/events/${event.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {event.name}
          </Link>
        </Card.Title>

        {/* Informations de l'événement */}
        <p className="mb-1 small">
          <strong>Price :</strong>{" "}
          <Badge bg="success">{event.price} DT</Badge>
        </p>
        <p className="mb-1 small">
          <strong>Number of tickets :</strong>{" "}
          <Badge bg={event.nbTickets <= 3 ? "danger" : "secondary"}>
            {event.nbTickets}
          </Badge>
        </p>
        <p className="mb-3 small">
          <strong>Number of participants :</strong> {event.nbParticipants}
        </p>

        {/* ── Boutons d'action ─────────────────────────────── */}
        <div className="mt-auto d-flex gap-2 flex-wrap">

          {/* ── Q6 : Bouton Ajouter/Retirer des Favoris ─────── */}
          {/* Le texte change dynamiquement selon isFavorite() */}
          <Button
            variant={isFavorite(event.id) ? "warning" : "outline-warning"}
            size="sm"
            onClick={handleToggleFavorite}
          >
            {isFavorite(event.id) ? "⭐ Retirer des Favoris" : "☆ Ajouter aux Favoris"}
          </Button>

          {/* Like / Dislike */}
          <Button
            variant={event.like ? "danger" : "outline-primary"}
            size="sm"
            onClick={() => toggleLike(index)}
          >
            {event.like ? "👎 Dislike" : "👍 Like"}
          </Button>

          {/* Réservation — désactivé si plus de tickets */}
          <Button
            variant="primary"
            size="sm"
            disabled={event.nbTickets === 0}
            onClick={() => bookEvent(index)}
          >
            🎟 Book
          </Button>

          {/* ── Q5 : Bouton Update → /events/update/:id ─────── */}
          <Button
            variant="warning"
            size="sm"
            onClick={() => navigate(`/events/update/${event.id}`)}
          >
            Update
          </Button>

          {/* ── Q4 : Bouton Delete → handleDelete ───────────── */}
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
          >
            Delete
          </Button>

        </div>
      </Card.Body>
    </Card>
  );
};

export default Event;
