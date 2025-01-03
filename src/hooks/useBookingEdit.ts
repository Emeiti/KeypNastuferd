import { useCallback } from 'react';
import { doc, runTransaction } from 'firebase/firestore';
import { db } from '../firebase/config';
import { validateBookingUpdate } from '../utils/validation';
import { BookingError, handleFirebaseError } from '../utils/errors';

export const useBookingEdit = () => {
  const params = new URLSearchParams(window.location.search);
  const teamId = params.get('team');

  const handleEditBooking = useCallback(async (
    bookingId: string,
    playerId: string,
    newAmount: number,
    newComment: string,
    newDate: string
  ) => {
    if (!teamId) {
      throw new BookingError('Team ID is required');
    }

    try {
      validateBookingUpdate(newAmount, newComment);

      await runTransaction(db, async (transaction) => {
        // First, do all reads
        const bookingRef = doc(db, `teams/${teamId}/bookings`, bookingId);
        const bookingDoc = await transaction.get(bookingRef);
        
        if (!bookingDoc.exists()) {
          throw new BookingError('Booking not found');
        }

        const oldAmount = bookingDoc.data().amount;
        const oldPlayerId = bookingDoc.data().playerId;

        const oldPlayerRef = doc(db, `teams/${teamId}/players`, oldPlayerId);
        const oldPlayerDoc = await transaction.get(oldPlayerRef);

        const newPlayerRef = doc(db, `teams/${teamId}/players`, playerId);
        const newPlayerDoc = await transaction.get(newPlayerRef);

        // Then, do all writes
        if (oldPlayerDoc.exists()) {
          const oldTotal = oldPlayerDoc.data().totalSpent || 0;
          transaction.update(oldPlayerRef, { 
            totalSpent: oldTotal - oldAmount 
          });
        }

        if (newPlayerDoc.exists()) {
          const newTotal = newPlayerDoc.data().totalSpent || 0;
          transaction.update(newPlayerRef, { 
            totalSpent: newTotal + newAmount 
          });
        }

        transaction.update(bookingRef, {
          playerId,
          amount: newAmount,
          comment: newComment,
          date: newDate
        });
      });
    } catch (error) {
      throw handleFirebaseError(error);
    }
  }, [teamId]);

  return { handleEditBooking };
};