// ============================================================
// FICHIER : ZustandStores/useFavoriteStore.js
// ── Q6 : Store Zustand pour la liste des favoris ─────────────
//
// Ce store gère :
//  - La liste des événements favoris (favorites)
//  - L'ajout d'un favori (addFavorite) avec vérification doublon
//  - La suppression d'un favori (removeFavorite)
//  - Un helper pour vérifier si un événement est déjà favori (isFavorite)
//  - La persistance dans localStorage via le middleware persist
//
// Utilisation :
//  → Dans Event.jsx  : addFavorite / removeFavorite / isFavorite
//  → Dans FavoriteList.jsx : favorites / removeFavorite
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useFavoriteStore = create(
  persist(
    (set, get) => ({

      // ── STATE ───────────────────────────────────────────────
      favorites: [], // liste des événements ajoutés aux favoris

      // ── ACTION : addFavorite ────────────────────────────────
      // Ajoute un événement à la liste des favoris
      // Vérifie d'abord que l'événement n'est pas déjà présent
      // (évite les doublons si le bouton est cliqué plusieurs fois)
      addFavorite: (event) => {
        const alreadyIn = get().favorites.find((f) => f.id === event.id);
        if (!alreadyIn) {
          set((state) => ({
            favorites: [...state.favorites, event],
          }));
        }
      },

      // ── ACTION : removeFavorite ─────────────────────────────
      // Retire un événement de la liste des favoris par son id
      // Utilisé depuis le bouton "Retirer des Favoris" dans :
      //  → Event.jsx (bouton dans la carte)
      //  → FavoriteList.jsx (bouton dans la liste des favoris)
      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        }));
      },

      // ── HELPER : isFavorite ─────────────────────────────────
      // Retourne true si l'événement avec cet id est dans les favoris
      // Utilisé dans Event.jsx pour afficher "Ajouter" ou "Retirer"
      // selon l'état courant du favori
      isFavorite: (id) => {
        return get().favorites.some((f) => f.id === id);
      },

    }),
    {
      // ── Configuration du middleware persist ─────────────────
      // Les favoris survivent au refresh de la page grâce à localStorage
      name: "favorite-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useFavoriteStore;
