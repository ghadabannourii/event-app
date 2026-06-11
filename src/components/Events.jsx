// ============================================================
// FICHIER : Events.jsx
// ── Q4 : Chargement de la liste des événements ───────────────
// ── Q4 : Suppression d'un événement ──────────────────────────
//
// DEUX MÉTHODES DISPONIBLES :
//  ① Axios directement (méthode originale)    → lignes marquées [AXIOS]
//  ② Zustand store (méthode workshop)         → lignes marquées [ZUSTAND]
//
// Pour basculer : commenter/décommenter les blocs indiqués
// Les deux méthodes produisent exactement le même résultat visuel
// ============================================================

import { useEffect, useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import Event from "./Event";
import FavoriteList from "./FavoriteList"; // ← Q6 : liste des favoris

// ── [AXIOS] Import du service Axios ──────────────────────────
//import { getallEvents } from "../service/api";

// ── [ZUSTAND] Import du store Zustand ────────────────────────
import useEventStore from "../ZustandStores/useEventStore";

const Events = () => {
  const [show, setShow]       = useState(false); // alerte "booked"
  const [welcome, setWelcome] = useState(false); // alerte de bienvenue

  // ════════════════════════════════════════════════════════════
  // MÉTHODE ① — AXIOS (méthode originale des ateliers précédents)
  // ════════════════════════════════════════════════════════════
  // Pour utiliser cette méthode :
  //   1. Décommenter ce bloc
  //   2. Commenter le bloc ZUSTAND ci-dessous
  // ────────────────────────────────────────────────────────────
  /*
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getallEvents(); // GET /events
        setEvents(response.data);
      } catch (error) {
        console.error("Erreur chargement events :", error);
      }
    };
    fetchEvents();

    setWelcome(true);
    const timer = setTimeout(() => setWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const bookEvent = (index) => {
    const updated = [...events];
    if (updated[index].nbTickets > 0) {
      updated[index].nbParticipants++;
      updated[index].nbTickets--;
      setEvents(updated);
      setShow(true);
      setTimeout(() => setShow(false), 2000);
    }
  };

  const toggleLike = (index) => {
    const updated = [...events];
    updated[index].like = !updated[index].like;
    setEvents(updated);
  };

  // Callback passé à Event.jsx → filtre la liste locale après DELETE
  const handleDeleted = (deletedId) => {
    setEvents((prev) => prev.filter((e) => e.id !== deletedId));
  };
  */
  // ════════════════════════════════════════════════════════════


  // ════════════════════════════════════════════════════════════
  // MÉTHODE ② — ZUSTAND (méthode workshop Atelier 5)
  // ════════════════════════════════════════════════════════════
  // Pour utiliser cette méthode :
  //   1. Décommenter ce bloc
  //   2. Commenter le bloc AXIOS ci-dessus
  // ────────────────────────────────────────────────────────────

  // Lecture de l'état et des actions depuis le store Zustand
  const events            = useEventStore((state) => state.events);
  const fetchEvents       = useEventStore((state) => state.fetchEvents);
  const deleteEventObject = useEventStore((state) => state.deleteEventObject);

  useEffect(() => {
    fetchEvents(); // ← Q4 : appel au store (remplace axios.get direct)

    setWelcome(true);
    const timer = setTimeout(() => setWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Réservation : met à jour l'état LOCAL (optimistic update)
  // Note : pour persister en BDD, il faudrait appeler editEvent()
  const bookEvent = (index) => {
    const updated = [...events];
    if (updated[index].nbTickets > 0) {
      updated[index] = {
        ...updated[index],
        nbParticipants: updated[index].nbParticipants + 1,
        nbTickets: updated[index].nbTickets - 1,
      };
      // Met à jour le store avec la nouvelle liste
      useEventStore.getState().populateEvents(updated);
      setShow(true);
      setTimeout(() => setShow(false), 2000);
    }
  };

  const toggleLike = (index) => {
    const updated = [...events];
    updated[index] = { ...updated[index], like: !updated[index].like };
    useEventStore.getState().populateEvents(updated);
  };

  // ── Q4 : Suppression via Zustand ─────────────────────────
  // deleteEventObject appelle DELETE /events/:id ET met à jour le store
  // Plus besoin du callback onDeleted comme avec Axios !
  const handleDeleted = (deletedId) => {
    deleteEventObject(deletedId);
  };

  // ════════════════════════════════════════════════════════════

  return (
    <Container fluid className="px-4 py-4">
      {/* Alerte de bienvenue — disparaît après 3s */}
      {welcome && (
        <Alert variant="info" className="text-center">
          🎉 Hey welcome to Esprit Events
        </Alert>
      )}

      {/* Alerte de réservation réussie */}
      {show && (
        <Alert variant="success" className="text-center">
          ✅ You have booked an event
        </Alert>
      )}

      <h2 className="text-center mb-4 fw-bold">🎭 Upcoming Events</h2>

      <Row className="g-4 justify-content-center">
        {events.map((event, index) => (
          <Col key={event.id} xs={12} sm={6} md={4} lg={3}>
            <Event
              event={event}
              index={index}
              bookEvent={bookEvent}
              toggleLike={toggleLike}
              onDeleted={handleDeleted}
            />
          </Col>
        ))}
      </Row>

      {/* ── Q6 : Section liste des favoris ─────────────────── */}
      {/* Affichée sous la liste des événements sur la même page */}
      <FavoriteList />
    </Container>
  );
};

export default Events;
