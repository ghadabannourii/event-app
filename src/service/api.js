// ============================================================
// FICHIER : service/api.js
// ── Q4 : Service Axios — couche d'accès à l'API json-server ──
// Toutes les requêtes HTTP vers http://localhost:3001/events
// sont centralisées ici pour être réutilisables dans les composants
// ============================================================

import axios from "axios";

// URL de base du serveur json-server (démarré sur le port 3001)
// Commande de démarrage : json-server --watch db.json --port 3001
const url = "http://localhost:3001/events";

// ── Q5 : GET tous les événements OU un seul par id ────────────
// Si id est fourni  → GET /events/:id (utilisé par EventDetails & UpdateEvent)
// Si id est absent  → GET /events     (utilisé par Events)
export const getallEvents = async (id) => {
  id = id || "";                           // id vide = récupère tous les events
  return await axios.get(`${url}/${id}`);  // retourne la promesse Axios
};

// ── Q7 : POST — ajouter un nouvel événement ───────────────────
// body : objet { name, description, price, nbTickets, img, ... }
export const addEvent = async (event) => {
  return await axios.post(url, event);
};

// ── Q9 : PUT — modifier un événement existant ────────────────
// id    : identifiant de l'événement à modifier
// event : objet avec les nouvelles valeurs
export const editEvent = async (id, event) => {
  return await axios.put(`${url}/${id}`, event);
};

// ── Q12 : DELETE — supprimer un événement par son id ─────────
export const deleteEvent = async (id) => {
  return await axios.delete(`${url}/${id}`);
};
