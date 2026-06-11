// ============================================================
// FICHIER : EventDetails.jsx
// ── Q5 : Récupération des détails d'un événement par son ID ──
//
// DEUX MÉTHODES disponibles :
//  ① Axios directement   → bloc [AXIOS]   (commenté)
//  ② Zustand store       → bloc [ZUSTAND] (actif)
//
// Si l'événement n'existe pas → affiche "Event does not exist"
// ============================================================

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Badge, Container, Row, Col } from "react-bootstrap";

// ── [AXIOS] Import du service Axios ──────────────────────────
//import { getallEvents } from "../service/api";

// ── [ZUSTAND] Import du store ─────────────────────────────
import useEventStore from "../ZustandStores/useEventStore";

const EventDetails = () => {
  // useParams() extrait le :id depuis l'URL /events/:id
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [notFound, setNotFound] = useState(false);

  // ════════════════════════════════════════════════════════════
  // MÉTHODE ① — AXIOS (méthode originale)
  // ════════════════════════════════════════════════════════════
  // Pour utiliser cette méthode :
  //   1. Décommenter ce bloc
  //   2. Commenter le bloc ZUSTAND ci-dessous
  // ────────────────────────────────────────────────────────────
  /*
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getallEvents(id); // GET /events/:id
        setEvent(response.data);
      } catch (error) {
        setNotFound(true); // 404 → événement inexistant
      }
    };
    fetchEvent();
  }, [id]);
  */
  // ════════════════════════════════════════════════════════════


  // ════════════════════════════════════════════════════════════
  // MÉTHODE ② — ZUSTAND (méthode Atelier 5)
  // ════════════════════════════════════════════════════════════
  // On cherche l'événement directement dans le store (déjà chargé)
  // Plus besoin d'un useEffect ni d'un appel réseau supplémentaire !
  // Si l'id ne correspond à aucun événement → notFound = true
  // ────────────────────────────────────────────────────────────
  const events = useEventStore((state) => state.events);

  // find() cherche dans le store l'événement dont l'id correspond
  // Attention : event.id peut être un string ou un number selon json-server
  const event = events.find((e) => String(e.id) === String(id));

  useEffect(() => {
    // Si le store est chargé et que l'événement est introuvable → 404
    if (events.length > 0 && !event) {
      setNotFound(true);
    }
  }, [events, event]);
  // ════════════════════════════════════════════════════════════

  // ── Message requis si l'événement n'existe pas ───────────
  if (notFound) {
    return (
      <p className="text-center mt-5 text-danger fw-bold fs-5">
        Event does not exist
      </p>
    );
  }

  // Chargement en cours (store pas encore hydraté)
  if (!event) {
    return <p className="text-center mt-5 text-muted">Loading...</p>;
  }

  // ── Affichage des détails de l'événement ─────────────────
  return (
    <Container className="mt-4" style={{ maxWidth: "800px" }}>
      <Button
        variant="outline-secondary"
        size="sm"
        className="mb-3"
        onClick={() => navigate("/events")}
      >
        ← Back to Events
      </Button>

      <Row className="g-4 align-items-start">
        <Col md={5}>
          <img
            src={event.img}
            alt={event.name}
            style={{ width: "100%", borderRadius: "10px", objectFit: "cover" }}
          />
        </Col>

        <Col md={7}>
          <h2 className="fw-bold mb-3">{event.name}</h2>
          <p className="text-muted">{event.description}</p>
          <hr />
          <p>
            <strong>Price :</strong>{" "}
            <Badge bg="success" className="fs-6">{event.price} DT</Badge>
          </p>
          <p>
            <strong>Number of tickets :</strong>{" "}
            <Badge bg={event.nbTickets <= 3 ? "danger" : "secondary"}>
              {event.nbTickets}
            </Badge>
          </p>
          <p>
            <strong>Number of participants :</strong> {event.nbParticipants}
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default EventDetails;
