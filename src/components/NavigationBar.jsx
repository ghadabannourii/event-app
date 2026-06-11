// ============================================================
// FICHIER : Navbar.jsx
// ── Q8 : Bouton "Add New Event" → /events/add ────────────────
// Barre de navigation persistante (dans RootLayout)
// NavLink détecte automatiquement la route active (isActive)
// ============================================================

import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const NavigationBar = () => {
  // useNavigate : navigation programmatique (via onClick)
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow py-2">
      <Container>
        {/* Logo / Titre → retour à la racine "/" */}
        <Navbar.Brand as={NavLink} to="/" className="fw-bold fs-3 text-warning">
          MyEvents
        </Navbar.Brand>

        {/* Icône hamburger sur mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-2">

            {/* Lien "Events" → /events
                NavLink fournit isActive pour styler le lien actif */}
            <Nav.Link
              as={NavLink}
              to="/events"
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "#ffc107" : "white",
              })}
            >
              Events
            </Nav.Link>

            {/* ── Q8 : Bouton Add New Event → /events/add ─────── */}
            {/* Déclenche useNavigate pour accéder au formulaire AddEvent */}
            <Button
              variant="warning"
              size="sm"
              onClick={() => navigate("/events/add")}
            >
              + Add New Event
            </Button>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
