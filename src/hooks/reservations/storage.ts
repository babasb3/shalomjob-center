
import { Reservation } from "./types";

// Fonction pour charger les réservations depuis le localStorage
export const loadReservations = (): Reservation[] => {
  const savedReservations = localStorage.getItem('reservations');
  if (savedReservations) {
    try {
      const parsed = JSON.parse(savedReservations);
      // Vérifier que chaque réservation a toutes les propriétés requises
      return parsed.map((reservation: any) => {
        // S'assurer que chaque réservation a une image
        if (!reservation.listingImage) {
          reservation.listingImage = "/placeholder.svg";
        }
        // S'assurer des autres champs nécessaires
        return {
          id: reservation.id || Math.random().toString(36).substr(2, 9),
          listingId: reservation.listingId || "",
          listingTitle: reservation.listingTitle || "Logement sans titre",
          listingLocation: reservation.listingLocation || "Emplacement non spécifié",
          listingImage: reservation.listingImage,
          guestName: reservation.guestName || "Invité",
          guestEmail: reservation.guestEmail || "email@exemple.com",
          checkIn: reservation.checkIn || new Date().toISOString(),
          checkOut: reservation.checkOut || new Date(Date.now() + 86400000).toISOString(),
          guests: reservation.guests || 1,
          totalPrice: reservation.totalPrice || 0,
          status: reservation.status || 'pending',
          createdAt: reservation.createdAt || new Date().toISOString(),
          notes: reservation.notes
        };
      });
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
      return [];
    }
  }
  // Si pas de réservations, retourner un tableau vide
  return [];
};

// Fonction pour sauvegarder les réservations
export const saveReservations = (reservations: Reservation[]) => {
  localStorage.setItem('reservations', JSON.stringify(reservations));
};
