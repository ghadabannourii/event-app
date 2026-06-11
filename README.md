# 📚 Guide d'Examen — React + Zustand
### ESPRIT 2024-2025 | Binary Legends

---

## 📋 Table des matières

1. [Setup & Installation](#1-setup--installation)
2. [Structure du projet](#2-structure-du-projet)
3. [Routing — React Router v6](#3-routing--react-router-v6)
4. [Service Axios (api.js)](#4-service-axios-apijs)
5. [Zustand — Concepts & Store](#5-zustand--concepts--store)
6. [useEventStore.js — Store des événements](#6-useeventstorejs--store-des-événements)
7. [useFavoriteStore.js — Store des favoris](#7-usefavoritestorejs--store-des-favoris)
8. [Composants — Code complet](#8-composants--code-complet)
9. [Récapitulatif des questions atelier](#9-récapitulatif-des-questions-atelier)
10. [Erreurs fréquentes à éviter](#10-erreurs-fréquentes-à-éviter)
11. [Commandes utiles](#11-commandes-utiles)

---

## 1. Setup & Installation

### Créer un projet Vite + React
```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
```

### Installer toutes les dépendances du projet
```bash
# React Router (navigation)
npm install react-router-dom

# Axios (requêtes HTTP)
npm install axios

# React Bootstrap (composants UI)
npm install react-bootstrap bootstrap

# JSON Server (faux backend REST)
npm install -g json-server

# Zustand (state management global)
npm install zustand

# Middleware persist pour Zustand (localStorage)
# Note : persist est INCLUS dans zustand depuis v4, pas besoin d'install séparé
# mais si l'atelier demande explicitement :
npm install zustand/middleware
```

### Démarrer le projet
```bash
# Terminal 1 — Démarrer le serveur React (Vite)
npm run dev

# Terminal 2 — Démarrer json-server (faux backend)
json-server --watch db.json --port 3001

# Accès : http://localhost:5173  (React)
#         http://localhost:3001/events  (API REST)
```

---

## 2. Structure du projet

```
src/
├── components/
│   ├── RootLayout.jsx       ← NavBar + Outlet (layout commun)
│   ├── NavigationBar.jsx    ← Barre de navigation
│   ├── Events.jsx           ← Liste des événements
│   ├── Event.jsx            ← Carte d'un événement
│   ├── EventDetails.jsx     ← Détails d'un événement
│   ├── AddEvent.jsx         ← Formulaire d'ajout
│   ├── UpdateEvent.jsx      ← Formulaire de modification
│   ├── FavoriteList.jsx     ← Liste des favoris (Zustand)
│   └── NotFound.jsx         ← Page 404
├── ZustandStores/
│   ├── useEventStore.js     ← Store global des événements
│   └── useFavoriteStore.js  ← Store global des favoris
├── service/
│   └── api.js               ← Toutes les requêtes Axios
├── router.jsx               ← Configuration des routes
└── main.jsx                 ← Point d'entrée
```

### db.json (fichier json-server)
```json
{
  "events": [
    {
      "id": "1",
      "name": "Concert Live",
      "description": "Description ici",
      "img": "/images/event1.jpg",
      "price": 50,
      "nbTickets": 200,
      "nbParticipants": 150,
      "like": false
    }
  ]
}
```

---

## 3. Routing — React Router v6

### main.jsx — Point d'entrée
```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

### router.jsx — Configuration des routes
```jsx
import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import RootLayout from "./components/RootLayout";
import NotFound from "./components/NotFound";

// Lazy loading = chargement à la demande (meilleures performances)
const Events       = lazy(() => import("./components/Events"));
const EventDetails = lazy(() => import("./components/EventDetails"));
const AddEvent     = lazy(() => import("./components/AddEvent"));
const UpdateEvent  = lazy(() => import("./components/UpdateEvent"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "events",              element: <Events /> },
      { path: "events/add",          element: <AddEvent /> },      // ⚠️ AVANT events/:id
      { path: "events/update/:id",   element: <UpdateEvent /> },   // ⚠️ AVANT events/:id
      { path: "events/:id",          element: <EventDetails /> },
      { path: "*",                   element: <NotFound /> },
    ],
  },
]);

export default router;
```

> ⚠️ **RÈGLE IMPORTANTE** : Les routes statiques (`/add`, `/update/:id`) doivent TOUJOURS être déclarées AVANT les routes dynamiques (`/:id`), sinon React Router interprétera "add" comme un id.

### RootLayout.jsx — Layout commun
```jsx
import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import NavigationBar from "./NavigationBar";

const RootLayout = () => (
  <>
    <NavigationBar />
    <Suspense fallback={<div className="text-center mt-5">Loading...</div>}>
      <Outlet />   {/* Contenu de la route active s'affiche ici */}
    </Suspense>
  </>
);

export default RootLayout;
```

### Hooks de navigation utiles
```jsx
import { useNavigate, useParams, NavLink, Link } from "react-router-dom";

// useNavigate → navigation programmatique
const navigate = useNavigate();
navigate("/events");           // redirection simple
navigate(`/events/${id}`);     // avec paramètre
navigate(-1);                  // retour arrière

// useParams → lire les paramètres de l'URL
const { id } = useParams();    // /events/:id → id = "123"

// NavLink → lien avec style actif automatique
<NavLink to="/events" style={({ isActive }) => ({ color: isActive ? "gold" : "white" })}>
  Events
</NavLink>

// Link → lien simple sans style actif
<Link to={`/events/${event.id}`}>Voir détails</Link>
```

---

## 4. Service Axios (api.js)

```javascript
// service/api.js
import axios from "axios";

const url = "http://localhost:3001/events";

// GET tous les événements OU un seul par id
export const getallEvents = async (id) => {
  id = id || "";
  return await axios.get(`${url}/${id}`);
  // Sans id → GET /events       (retourne tableau)
  // Avec id → GET /events/:id   (retourne un objet)
};

// POST — ajouter un événement
export const addEvent = async (event) => {
  return await axios.post(url, event);
};

// PUT — modifier un événement
export const editEvent = async (id, event) => {
  return await axios.put(`${url}/${id}`, event);
};

// DELETE — supprimer un événement
export const deleteEvent = async (id) => {
  return await axios.delete(`${url}/${id}`);
};
```

### Utilisation dans un composant (méthode Axios directe)
```jsx
import { getallEvents, addEvent, editEvent, deleteEvent } from "../service/api";

// Récupérer tous les événements
useEffect(() => {
  const fetch = async () => {
    const response = await getallEvents();
    setEvents(response.data);  // response.data = tableau JSON
  };
  fetch();
}, []);

// Récupérer un seul événement
const response = await getallEvents(id);
setEvent(response.data);  // response.data = objet JSON

// Ajouter
await addEvent(formData);

// Modifier
await editEvent(id, formData);

// Supprimer
await deleteEvent(id);
```

---

## 5. Zustand — Concepts & Store

### Pourquoi Zustand ?

| Problème avec useState seul | Solution Zustand |
|---|---|
| État local → pas partageable entre composants | Store global accessible partout |
| Prop drilling (passer props de parent en enfant) | Import direct du store dans n'importe quel composant |
| Perte des données au refresh | `persist` middleware → sauvegarde dans localStorage |
| Appels Axios dispersés dans chaque composant | Actions centralisées dans le store |

### Syntaxe de base
```javascript
import { create } from "zustand";

const useMonStore = create((set, get) => ({
  // ── STATE ──
  maListe: [],
  erreur: "",

  // ── ACTIONS synchrones ──
  setListe: (liste) => set({ maListe: liste }),

  // ── ACTIONS asynchrones ──
  fetchListe: async () => {
    const response = await axios.get("/api/data");
    set({ maListe: response.data });
  },

  // ── HELPER (lecture seule, pas de set) ──
  estPresent: (id) => get().maListe.some((item) => item.id === id),
}));

export default useMonStore;
```

### Utilisation dans un composant
```jsx
import useMonStore from "../ZustandStores/useMonStore";

const MonComposant = () => {
  // Sélectionner une valeur du store
  const maListe   = useMonStore((state) => state.maListe);

  // Sélectionner une action du store
  const fetchListe = useMonStore((state) => state.fetchListe);
  const setListe   = useMonStore((state) => state.setListe);

  useEffect(() => {
    fetchListe(); // appel au store qui fait l'appel API
  }, []);

  return <div>{maListe.length} éléments</div>;
};
```

### Middleware persist (localStorage)
```javascript
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useMonStore = create(
  persist(
    (set) => ({
      donnees: [],
      setDonnees: (d) => set({ donnees: d }),
    }),
    {
      name: "ma-cle-localstorage",  // nom de la clé dans localStorage
      getStorage: () => localStorage,
    }
  )
);
```

---

## 6. useEventStore.js — Store des événements

```javascript
// ZustandStores/useEventStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getallEvents, addEvent, editEvent, deleteEvent } from "../service/api";

const useEventStore = create(
  persist(
    (set) => ({

      // ── STATE ──────────────────────────────────────────────
      events: [],
      errors: "",

      // ── Remplacer toute la liste (utilisé pour bookEvent/toggleLike)
      populateEvents: (events) => set({ events }),

      // ── Charger tous les événements depuis l'API ────────────
      fetchEvents: async () => {
        try {
          const response = await getallEvents();
          set({ events: response.data, errors: null });
        } catch (error) {
          set({ errors: error.message });
        }
      },

      // ── Ajouter un événement ────────────────────────────────
      addEventObject: async (event) => {
        try {
          const response = await addEvent(event);
          set((state) => ({
            events: [...state.events, response.data],
            errors: null,
          }));
        } catch (error) {
          set({ errors: error.message });
        }
      },

      // ── Modifier un événement ───────────────────────────────
      updateEventObject: async (id, updatedEvent) => {
        try {
          const response = await editEvent(id, updatedEvent);
          set((state) => ({
            events: state.events.map((item) =>
              item.id === response.data.id ? response.data : item
            ),
            errors: null,
          }));
        } catch (error) {
          set({ errors: error.message });
        }
      },

      // ── Supprimer un événement ──────────────────────────────
      deleteEventObject: async (id) => {
        try {
          await deleteEvent(id);
          set((state) => ({
            events: state.events.filter((item) => item.id !== id),
            errors: null,
          }));
        } catch (error) {
          set({ errors: error.message });
        }
      },

    }),
    {
      name: "event-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useEventStore;
```

---

## 7. useFavoriteStore.js — Store des favoris

```javascript
// ZustandStores/useFavoriteStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useFavoriteStore = create(
  persist(
    (set, get) => ({

      // ── STATE ──────────────────────────────────────────────
      favorites: [],

      // ── Ajouter aux favoris (sans doublon) ─────────────────
      addFavorite: (event) => {
        const alreadyIn = get().favorites.find((f) => f.id === event.id);
        if (!alreadyIn) {
          set((state) => ({ favorites: [...state.favorites, event] }));
        }
      },

      // ── Retirer des favoris ────────────────────────────────
      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        }));
      },

      // ── Vérifier si un événement est favori ────────────────
      // get() permet de lire le state courant sans déclencher un re-render
      isFavorite: (id) => get().favorites.some((f) => f.id === id),

    }),
    {
      name: "favorite-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useFavoriteStore;
```

---

## 8. Composants — Code complet

### Events.jsx
```jsx
import { useEffect, useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import Event from "./Event";
import FavoriteList from "./FavoriteList";
import useEventStore from "../ZustandStores/useEventStore";

const Events = () => {
  const [show, setShow]       = useState(false);
  const [welcome, setWelcome] = useState(false);

  const events            = useEventStore((state) => state.events);
  const fetchEvents       = useEventStore((state) => state.fetchEvents);
  const deleteEventObject = useEventStore((state) => state.deleteEventObject);

  useEffect(() => {
    fetchEvents();
    setWelcome(true);
    const timer = setTimeout(() => setWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const bookEvent = (index) => {
    const updated = [...events];
    if (updated[index].nbTickets > 0) {
      updated[index] = {
        ...updated[index],
        nbParticipants: updated[index].nbParticipants + 1,
        nbTickets: updated[index].nbTickets - 1,
      };
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

  const handleDeleted = (deletedId) => {
    deleteEventObject(deletedId);
  };

  return (
    <Container fluid className="px-4 py-4">
      {welcome && <Alert variant="info" className="text-center">🎉 Hey welcome to Esprit Events</Alert>}
      {show    && <Alert variant="success" className="text-center">✅ You have booked an event</Alert>}

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

      <FavoriteList />
    </Container>
  );
};

export default Events;
```

### Event.jsx
```jsx
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Badge } from "react-bootstrap";
import useEventStore    from "../ZustandStores/useEventStore";
import useFavoriteStore from "../ZustandStores/useFavoriteStore";

const Event = ({ event, index, bookEvent, toggleLike, onDeleted }) => {
  const navigate = useNavigate();

  const addFavorite       = useFavoriteStore((state) => state.addFavorite);
  const removeFavorite    = useFavoriteStore((state) => state.removeFavorite);
  const isFavorite        = useFavoriteStore((state) => state.isFavorite);
  const deleteEventObject = useEventStore((state) => state.deleteEventObject);

  const handleDelete = async () => {
    if (window.confirm(`Supprimer "${event.name}" ?`)) {
      await deleteEventObject(event.id);
      onDeleted(event.id);
    }
  };

  const handleToggleFavorite = () => {
    isFavorite(event.id) ? removeFavorite(event.id) : addFavorite(event);
  };

  return (
    <Card className="h-100 shadow border-0 rounded-3 overflow-hidden">
      <Card.Img
        variant="top"
        src={event.nbTickets === 0 ? "/images/sold_out.png" : event.img}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column p-3">
        <Card.Title className="fw-bold fs-6 mb-2">
          <Link to={`/events/${event.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            {event.name}
          </Link>
        </Card.Title>

        <p className="mb-1 small"><strong>Price :</strong> <Badge bg="success">{event.price} DT</Badge></p>
        <p className="mb-1 small">
          <strong>Number of tickets :</strong>{" "}
          <Badge bg={event.nbTickets <= 3 ? "danger" : "secondary"}>{event.nbTickets}</Badge>
        </p>
        <p className="mb-3 small"><strong>Number of participants :</strong> {event.nbParticipants}</p>

        <div className="mt-auto d-flex gap-2 flex-wrap">
          <Button variant={isFavorite(event.id) ? "warning" : "outline-warning"} size="sm" onClick={handleToggleFavorite}>
            {isFavorite(event.id) ? "⭐ Retirer des Favoris" : "☆ Ajouter aux Favoris"}
          </Button>
          <Button variant={event.like ? "danger" : "outline-primary"} size="sm" onClick={() => toggleLike(index)}>
            {event.like ? "👎 Dislike" : "👍 Like"}
          </Button>
          <Button variant="primary" size="sm" disabled={event.nbTickets === 0} onClick={() => bookEvent(index)}>
            🎟 Book
          </Button>
          <Button variant="warning" size="sm" onClick={() => navigate(`/events/update/${event.id}`)}>
            Update
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Event;
```

### EventDetails.jsx
```jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Badge, Container, Row, Col } from "react-bootstrap";
import useEventStore from "../ZustandStores/useEventStore";

const EventDetails = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [notFound, setNotFound] = useState(false);

  const events = useEventStore((state) => state.events);
  const event  = events.find((e) => String(e.id) === String(id));

  useEffect(() => {
    if (events.length > 0 && !event) setNotFound(true);
  }, [events, event]);

  if (notFound) return <p className="text-center mt-5 text-danger fw-bold fs-5">Event does not exist</p>;
  if (!event)   return <p className="text-center mt-5 text-muted">Loading...</p>;

  return (
    <Container className="mt-4" style={{ maxWidth: "800px" }}>
      <Button variant="outline-secondary" size="sm" className="mb-3" onClick={() => navigate("/events")}>
        ← Back to Events
      </Button>
      <Row className="g-4 align-items-start">
        <Col md={5}>
          <img src={event.img} alt={event.name} style={{ width: "100%", borderRadius: "10px", objectFit: "cover" }} />
        </Col>
        <Col md={7}>
          <h2 className="fw-bold mb-3">{event.name}</h2>
          <p className="text-muted">{event.description}</p>
          <hr />
          <p><strong>Price :</strong> <Badge bg="success" className="fs-6">{event.price} DT</Badge></p>
          <p><strong>Number of tickets :</strong> <Badge bg={event.nbTickets <= 3 ? "danger" : "secondary"}>{event.nbTickets}</Badge></p>
          <p><strong>Number of participants :</strong> {event.nbParticipants}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default EventDetails;
```

### AddEvent.jsx
```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useEventStore from "../ZustandStores/useEventStore";

const AddEvent = () => {
  const navigate       = useNavigate();
  const addEventObject = useEventStore((state) => state.addEventObject);

  const [formData, setFormData] = useState({
    name: "", description: "", price: 0, nbTickets: 0, nbParticipants: 0, like: false, img: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addEventObject(formData);
    navigate("/events");
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h3>Add a new Event</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className="form-control" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input className="form-control" type="number" name="price" value={formData.price} onChange={handleChange} min="0" />
        </div>
        <div className="mb-3">
          <label className="form-label">Number of Tickets</label>
          <input className="form-control" type="number" name="nbTickets" value={formData.nbTickets} onChange={handleChange} min="0" />
        </div>
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input className="form-control" type="file" name="img" onChange={handleChange} />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Add an Event</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/events")}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
```

### UpdateEvent.jsx
```jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useEventStore from "../ZustandStores/useEventStore";

const UpdateEvent = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const events            = useEventStore((state) => state.events);
  const updateEventObject = useEventStore((state) => state.updateEventObject);

  const [formData, setFormData] = useState({ name: "", description: "", price: 0, nbTickets: 0, img: "" });

  useEffect(() => {
    const existing = events.find((e) => String(e.id) === String(id));
    if (existing) setFormData(existing);
  }, [id, events]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateEventObject(id, formData);
    navigate("/events");
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h3>Modify {formData.name}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className="form-control" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input className="form-control" type="number" name="price" value={formData.price} onChange={handleChange} min="0" />
        </div>
        <div className="mb-3">
          <label className="form-label">Number of Tickets</label>
          <input className="form-control" type="number" name="nbTickets" value={formData.nbTickets} onChange={handleChange} min="0" />
        </div>
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input className="form-control" type="file" name="img" onChange={handleChange} />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-warning">Update</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/events")}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEvent;
```

### FavoriteList.jsx
```jsx
import { Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Badge } from "react-bootstrap";
import useFavoriteStore from "../ZustandStores/useFavoriteStore";

const FavoriteList = () => {
  const navigate       = useNavigate();
  const favorites      = useFavoriteStore((state) => state.favorites);
  const removeFavorite = useFavoriteStore((state) => state.removeFavorite);

  return (
    <div className="mt-5">
      <h4 className="fw-bold mb-3">⭐ Mes Favoris</h4>

      {favorites.length === 0 ? (
        <p className="text-muted fst-italic">Aucun événement en favori.</p>
      ) : (
        <Row className="g-4">
          {favorites.map((event) => (
            <Col key={event.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow border-0 rounded-3 overflow-hidden">
                <Card.Img variant="top" src={event.nbTickets === 0 ? "/images/sold_out.png" : event.img} style={{ height: "200px", objectFit: "cover" }} />
                <Card.Body className="d-flex flex-column p-3">
                  <Card.Title className="fw-bold fs-6 mb-2">
                    <Link to={`/events/${event.id}`} style={{ textDecoration: "none", color: "inherit" }}>{event.name}</Link>
                  </Card.Title>
                  <p className="mb-1 small"><strong>Price :</strong> <Badge bg="success">{event.price} DT</Badge></p>
                  <p className="mb-1 small">
                    <strong>Number of tickets :</strong>{" "}
                    <Badge bg={event.nbTickets <= 3 ? "danger" : "secondary"}>{event.nbTickets}</Badge>
                  </p>
                  <p className="mb-3 small"><strong>Number of participants :</strong> {event.nbParticipants}</p>
                  <div className="mt-auto d-flex gap-2 flex-wrap">
                    <Button variant="warning" size="sm" onClick={() => removeFavorite(event.id)}>⭐ Retirer des Favoris</Button>
                    <Button variant="primary" size="sm" disabled={event.nbTickets === 0}>🎟 Book</Button>
                    <Button variant="warning" size="sm" onClick={() => navigate(`/events/update/${event.id}`)}>Update</Button>
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
```

### NavigationBar.jsx
```jsx
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const NavigationBar = () => {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow py-2">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold fs-3 text-warning">
          MyEvents
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-2">
            <Nav.Link
              as={NavLink}
              to="/events"
              style={({ isActive }) => ({ fontWeight: isActive ? "bold" : "normal", color: isActive ? "#ffc107" : "white" })}
            >
              Events
            </Nav.Link>
            <Button variant="warning" size="sm" onClick={() => navigate("/events/add")}>
              + Add New Event
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
```

---

## 9. Récapitulatif des questions atelier

| Q | Description | Fichier(s) modifié(s) | Méthode clé |
|---|---|---|---|
| Q1 | Installer Zustand | Terminal | `npm install zustand` |
| Q2 | Créer les fichiers stores vides | `ZustandStores/` | Structure dossier |
| Q3 | Implémenter useEventStore.js | `useEventStore.js` | `create()` + `persist()` |
| Q4 | Charger + supprimer via store | `Events.jsx`, `Event.jsx` | `fetchEvents()`, `deleteEventObject()` |
| Q5 | Ajouter + modifier via store | `AddEvent.jsx`, `UpdateEvent.jsx`, `EventDetails.jsx` | `addEventObject()`, `updateEventObject()` |
| Q6 | Store favoris + liste favoris | `useFavoriteStore.js`, `FavoriteList.jsx`, `Event.jsx` | `addFavorite()`, `removeFavorite()`, `isFavorite()` |

---

## 10. Erreurs fréquentes à éviter

### ❌ Erreur 1 — Ordre des routes
```jsx
// ❌ MAUVAIS : /:id capture "add" avant la route /add
{ path: "events/:id",        element: <EventDetails /> },
{ path: "events/add",        element: <AddEvent /> },

// ✅ BON : routes statiques en premier
{ path: "events/add",        element: <AddEvent /> },
{ path: "events/update/:id", element: <UpdateEvent /> },
{ path: "events/:id",        element: <EventDetails /> },
```

### ❌ Erreur 2 — Comparer les ids (string vs number)
```jsx
// ❌ Peut échouer si l'un est string et l'autre number
events.find((e) => e.id === id)

// ✅ Toujours convertir les deux en string
events.find((e) => String(e.id) === String(id))
```

### ❌ Erreur 3 — Muter le state directement avec Zustand
```javascript
// ❌ MAUVAIS : mutation directe
set((state) => { state.events.push(newEvent); })

// ✅ BON : créer un nouveau tableau
set((state) => ({ events: [...state.events, newEvent] }))
```

### ❌ Erreur 4 — Oublier e.preventDefault() dans handleSubmit
```jsx
// ❌ La page se recharge et perd les données
const handleSubmit = async (e) => {
  await addEventObject(formData);
};

// ✅
const handleSubmit = async (e) => {
  e.preventDefault();   // ← indispensable !
  await addEventObject(formData);
};
```

### ❌ Erreur 5 — Utiliser get() au lieu de set() pour lire l'état dans une action
```javascript
// ❌ Dans le store, pour lire l'état dans une action synchrone
addFavorite: (event) => {
  if (!favorites.includes(event)) { ... }  // favorites n'existe pas ici !
}

// ✅ Utiliser get() pour lire l'état courant
addFavorite: (event) => {
  const alreadyIn = get().favorites.find((f) => f.id === event.id);
  if (!alreadyIn) { set(...) }
}
```

### ❌ Erreur 6 — Oublier Suspense autour des composants lazy
```jsx
// ❌ Sans Suspense, les composants lazy crashent
const Events = lazy(() => import("./components/Events"));
// ...
<Outlet />  // ← crash si Events est lazy sans Suspense

// ✅
<Suspense fallback={<div>Loading...</div>}>
  <Outlet />
</Suspense>
```

---

## 11. Commandes utiles

```bash
# ═══════════════════════════════════════════
# DÉMARRAGE DU PROJET
# ═══════════════════════════════════════════

# Démarrer Vite (frontend React)
npm run dev

# Démarrer json-server (backend simulé) sur port 3001
json-server --watch db.json --port 3001

# Démarrer les deux en même temps (si configuré dans package.json)
npm run start:all


# ═══════════════════════════════════════════
# INSTALLATION DES DÉPENDANCES
# ═══════════════════════════════════════════

npm install react-router-dom    # Routing
npm install axios               # Requêtes HTTP
npm install react-bootstrap bootstrap  # UI
npm install zustand             # State management
npm install json-server -g      # Faux backend REST


# ═══════════════════════════════════════════
# VÉRIFICATION DE L'API (json-server)
# ═══════════════════════════════════════════

# Lire tous les événements
GET  http://localhost:3001/events

# Lire un événement par id
GET  http://localhost:3001/events/1

# Ajouter un événement
POST http://localhost:3001/events
Body: { "name": "...", "price": 10, ... }

# Modifier un événement
PUT  http://localhost:3001/events/1
Body: { "name": "Nouveau nom", ... }

# Supprimer un événement
DELETE http://localhost:3001/events/1


# ═══════════════════════════════════════════
# BUILD PRODUCTION
# ═══════════════════════════════════════════

npm run build     # Génère le dossier dist/
npm run preview   # Prévisualiser le build


# ═══════════════════════════════════════════
# DÉPANNAGE
# ═══════════════════════════════════════════

# Port déjà utilisé → changer le port de json-server
json-server --watch db.json --port 3002

# Vider le localStorage (réinitialiser le store persist)
# Dans la console du navigateur :
localStorage.clear()

# Voir ce qui est stocké dans localStorage
# Dans la console du navigateur :
console.log(localStorage.getItem("event-storage"))
console.log(localStorage.getItem("favorite-storage"))
```

---

## 🗺️ Schéma de flux des données

```
┌─────────────────────────────────────────────────────────┐
│                    COMPOSANTS REACT                      │
│                                                          │
│  Events.jsx ──────► useEventStore.fetchEvents()          │
│  Event.jsx  ──────► useEventStore.deleteEventObject()    │
│  AddEvent   ──────► useEventStore.addEventObject()       │
│  UpdateEvent ─────► useEventStore.updateEventObject()    │
│  EventDetails ────► useEventStore.events (find)          │
│  Event.jsx  ──────► useFavoriteStore.addFavorite()       │
│  FavoriteList ────► useFavoriteStore.favorites           │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  ZUSTAND STORES                          │
│                                                          │
│  useEventStore    → events[], fetchEvents, CRUD...       │
│  useFavoriteStore → favorites[], add/remove/check        │
│                                                          │
│  [persist] ──────────────────────────────────────────►  │
│              localStorage["event-storage"]               │
│              localStorage["favorite-storage"]            │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                SERVICE AXIOS (api.js)                    │
│                                                          │
│  getallEvents()  → GET  /events ou /events/:id           │
│  addEvent()      → POST /events                          │
│  editEvent()     → PUT  /events/:id                      │
│  deleteEvent()   → DELETE /events/:id                    │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
              json-server (db.json) :3001
```
