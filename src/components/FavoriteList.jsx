// ============================================================
// FICHIER : FavoriteList.jsx
// ── Q6 : Affichage de la liste des favoris ───────────────────
//
// Utilisé comme page dédiée à /favorites (via NavigationBar)
// ET comme sous-composant dans Events.jsx
//
// Comportement :
//  - Si favorites est vide → "Aucun événement en favori."
//  - Sinon → grille de cartes avec boutons Retirer / Update
// ============================================================

import { Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Container, Card, Button, Badge } from "react-bootstrap";
import useFavoriteStore from "../ZustandStores/useFavoriteStore";

const FavoriteList = () => {
  const navigate = useNavigate();

  // Lecture du store favoris
  const favorites      = useFavoriteStore((state) => state.favorites);
  const removeFavorite = useFavoriteStore((state) => state.removeFavorite);

  return (
    <Container fluid className="mt-5 px-4">
      <h4 className="fw-bold mb-3">⭐ Mes Favoris</h4>

      {/* Message si la liste est vide */}
      {favorites.length === 0 ? (
        <p className="text-muted fst-italic">Aucun événement en favori.</p>
      ) : (
        <Row className="g-4">
          {favorites.map((event) => (
            <Col key={event.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow border-0 rounded-3 overflow-hidden">

                {/* Image */}
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

                  {/* Infos */}
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

                  {/* Boutons */}
                  <div className="mt-auto d-flex gap-2 flex-wrap">

                    {/* ✅ CORRECTION : stopPropagation empêche la navigation
                        vers /events/:id causée par le <Link> dans Card.Title */}
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(event.id);
                      }}
                    >
                      ⭐ Retirer des Favoris
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      disabled={event.nbTickets === 0}
                      onClick={(e) => e.stopPropagation()}
                    >
                      🎟 Book
                    </Button>

                    {/* ✅ CORRECTION : stopPropagation + navigate correct
                        AVANT : onClick={() => navigate(...)  → le clic remontait
                        au <Link> du titre → naviguait vers /events/:id au lieu
                        de /events/update/:id
                        APRÈS : e.stopPropagation() bloque la remontée → OK */}
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/events/update/${event.id}`);
                      }}
                    >
                      ✏️ Update
                    </Button>

                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default FavoriteList;
