// ============================================================
// FICHIER : ZustandStores/useEventStore.js
// ── Q3 : Store Zustand global pour la gestion des événements ─
//
// Ce store centralise :
//  - L'état (events, errors)
//  - Les actions CRUD (fetchEvents, addEventObject, updateEventObject, deleteEventObject)
//  - La persistance via localStorage (middleware "persist")
//
// Pourquoi Zustand ?
//  → Remplace le useState local + les appels Axios dispersés dans chaque composant
//  → L'état est partagé globalement sans prop drilling ni Context
//  → persist() fait survivre les données au refresh de la page
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getallEvents, addEvent, editEvent, deleteEvent } from "../service/api";

const useEventStore = create(
  persist(
    (set) => ({

      // ── STATE ───────────────────────────────────────────────
      events: [],  // liste complète des événements
      errors: "",  // message d'erreur (null = pas d'erreur)

      // ── ACTION : populateEvents ─────────────────────────────
      // Remplace directement la liste (utile pour les tests ou reset)
      populateEvents: (events) => set({ events }),

      // ── Q4 : fetchEvents — Chargement initial depuis l'API ──
      // Remplace useEffect + axios.get dans Events.jsx
      // Appelé une seule fois au montage du composant Events
      fetchEvents: async () => {
        try {
          const response = await getallEvents(); // GET /events
          set({ events: response.data, errors: null });
        } catch (error) {
          set({ errors: error.message });
        }
      },

      // ── Q5 : addEventObject — Ajout d'un événement ─────────
      // Remplace addEvent(formData) dans AddEvent.jsx
      // POST /events puis mise à jour du store (pas de rechargement)
      addEventObject: async (event) => {
        try {
          const response = await addEvent(event);       // POST /events
          set((state) => ({
            events: [...state.events, response.data],   // ajoute au store
            errors: null,
          }));
        } catch (error) {
          set({ errors: error.message });
        }
      },

      // ── Q5 : updateEventObject — Modification d'un événement
      // Remplace editEvent(id, formData) dans UpdateEvent.jsx
      // PUT /events/:id puis met à jour l'élément dans le store
      updateEventObject: async (id, updatedEvent) => {
        try {
          const response = await editEvent(id, updatedEvent); // PUT /events/:id
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

      // ── Q4 : deleteEventObject — Suppression d'un événement ─
      // Remplace deleteEvent(id) dans Event.jsx
      // DELETE /events/:id puis retire l'élément du store
      deleteEventObject: async (id) => {
        try {
          await deleteEvent(id);                         // DELETE /events/:id
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
      // ── Configuration du middleware persist ─────────────────
      // name  : clé utilisée dans localStorage
      // getStorage : indique d'utiliser localStorage (et non sessionStorage)
      name: "event-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useEventStore;
