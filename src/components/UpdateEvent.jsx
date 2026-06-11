// ============================================================
// FICHIER : FavoriteList.jsx
// ── Q6 : Affichage de la liste des favoris ───────────────────
//
// Ce composant lit directement le store useFavoriteStore
// Pas de méthode Axios équivalente (fonctionnalité 100% Zustand)
//
// Comportement :
//  - Si favorites est vide → "Aucun événement en favori."
//  - Sinon → grille de cartes avec bouton "Retirer des Favoris"
//
// Rendu dans Events.jsx, sous la liste des événements
// ============================================================

import { Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Badge } from "react-bootstrap";
import useFavoriteStore from "../ZustandStores/useFavoriteStore";

const FavoriteList = () => {
  const navigate = useNavigate();

  // ── Lecture du store favoris ──────────────────────────────
  // favorites     : liste des événements ajoutés aux favoris
  // removeFavorite : action pour retirer un favori
  const favorites      = useFavoriteStore((state) => state.favorites);
  const removeFavorite = useFavoriteStore((state) => state.removeFavorite);

  return (
    <div className="mt-5">
      {/* En-tête de la section favoris */}
      <h4 className="fw-bold mb-3">
        ⭐ Mes Favoris
      </h4>

      {/* ── Q6 : Message si la liste est vide ────────────── */}
      {/* Condition demandée par l'atelier : "Aucun événement en favori" */}
      {favorites.length === 0 ? (
        <p className="text-muted fst-italic">Aucun événement en favori.</p>
      ) : (
        // ── Grille des événements favoris ──────────────────
        <Row className="g-4">
          {favorites.map((event) => (
            <Col key={event.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow border-0 rounded-3 overflow-hidden">

                {/* Image de l'événement */}
                <Card.Img
                  variant="top"
                  src={event.nbTickets === 0 ? "/images/sold_out.png" : event.img}
                  style={{ height: "200px", objectFit: "cover" }}
                />

                <Card.Body className="d-flex flex-column p-3">

                  {/* Nom cliquable → EventDetails */}
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

                  {/* Boutons d'action */}
                  <div className="mt-auto d-flex gap-2 flex-wrap">

                    {/* ── Q6 : Retirer des favoris ───────── */}
                    {/* Appelle removeFavorite(id) dans le store */}
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => removeFavorite(event.id)}
                    >
                      ⭐ Retirer des Favoris
                    </Button>

                    {/* Réservation — désactivé si sold out */}
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={event.nbTickets === 0}
                    >
                      🎟 Book
                    </Button>

                    {/* Modification */}
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => navigate(`/events/update/${event.id}`)}
                    >
                      Update
                    </Button>

                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default FavoriteList;
