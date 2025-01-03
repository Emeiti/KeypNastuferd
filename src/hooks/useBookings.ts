import { useCallback } from 'react';
import { collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Player } from '../types';

export const useBookings = (teamId: string | null, players: Player[]) => {
  const submitBooking = useCallback(async (playerId: string, amount: number, comment: string, date: string) => {
    if (!teamId) return;

    try {
      const batch = writeBatch(db);
      
      // Add booking to nested collection
      const bookingRef = doc(collection(db, `teams/${teamId}/bookings`));
      batch.set(bookingRef, {
        playerId,
        amount,
        comment,
        timestamp: serverTimestamp(),
        date: date
      });

      // Update player total in nested collection
      const playerRef = doc(db, `teams/${teamId}/players`, playerId);
      const currentTotal = players.find(p => p.id === playerId)?.totalSpent || 0;
      batch.update(playerRef, {
        totalSpent: currentTotal + amount
      });

      await batch.commit();
    } catch (err) {
      console.error('Error submitting booking:', err);
      throw err;
    }
  }, [teamId, players]);

  return { submitBooking };
};