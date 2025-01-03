import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc,
  query, 
  orderBy, 
  updateDoc,
  addDoc,
  serverTimestamp,
  writeBatch,
  onSnapshot,
  getDocs,
  where,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Player, Booking } from '../types';

export const useFirestore = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = new URLSearchParams(window.location.search);
  const teamId = params.get('team');

  useEffect(() => {
    if (!teamId) {
      setLoading(false);
      return;
    }

    const unsubscribers: (() => void)[] = [];

    try {
      // Players listener
      const playersQuery = query(
        collection(db, `teams/${teamId}/players`),
        orderBy('createdAt')
      );

      const unsubPlayers = onSnapshot(playersQuery, {
        next: async (snapshot) => {
          const loadedPlayers = await Promise.all(snapshot.docs
            .filter(doc => !doc.data().isDeleted)
            .map(async (doc) => {
              // Calculate total from bookings
              const bookingsQuery = query(
                collection(db, `teams/${teamId}/bookings`),
                where('playerId', '==', doc.id)
              );
              const bookingsSnap = await getDocs(bookingsQuery);
              const totalSpent = bookingsSnap.docs.reduce((sum, bookingDoc) => 
                sum + bookingDoc.data().amount, 0
              );

              return {
                id: doc.id,
                name: doc.data().name,
                totalSpent,
                createdAt: doc.data().createdAt
              };
            }));
          setPlayers(loadedPlayers);
          setLoading(false);
        },
        error: (err) => {
          console.error('Error in players listener:', err);
          setError('Failed to load players data');
          setLoading(false);
        }
      });

      // Bookings listener
      const bookingsQuery = query(
        collection(db, `teams/${teamId}/bookings`),
        orderBy('timestamp', 'desc')
      );

      const unsubBookings = onSnapshot(bookingsQuery, {
        next: (snapshot) => {
          const loadedBookings = snapshot.docs.map(doc => ({
            id: doc.id,
            playerId: doc.data().playerId,
            amount: doc.data().amount,
            comment: doc.data().comment || '',
            date: doc.data().date,
            timestamp: doc.data().timestamp
          }));
          setBookings(loadedBookings);
        },
        error: (err) => {
          console.error('Error in bookings listener:', err);
        }
      });

      unsubscribers.push(unsubPlayers, unsubBookings);
    } catch (err) {
      console.error('Error setting up listeners:', err);
      setError('Failed to load data');
      setLoading(false);
    }

    return () => unsubscribers.forEach(unsub => unsub());
  }, [teamId]);

  const addBooking = useCallback(async (playerId: string, amount: number, comment: string, date: string) => {
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
        date
      });

      // Update player total in nested collection
      const playerRef = doc(db, `teams/${teamId}/players`, playerId);
      const currentTotal = players.find(p => p.id === playerId)?.totalSpent || 0;
      batch.update(playerRef, {
        totalSpent: currentTotal + amount
      });

      await batch.commit();

      // Update local state immediately
      setBookings(prevBookings => [
        {
          id: bookingRef.id,
          playerId,
          amount,
          comment,
          date,
          timestamp: new Date() // or serverTimestamp() if you want to use the server time
        },
        ...prevBookings
      ]);
    } catch (err) {
      console.error('Error submitting booking:', err);
      throw err;
    }
  }, [teamId, players]);

  const deletePlayer = useCallback(async (playerId: string) => {
    if (!teamId) return;

    try {
      const batch = writeBatch(db);
      
      // Mark player as deleted instead of actually deleting
      const playerRef = doc(db, `teams/${teamId}/players`, playerId);
      batch.update(playerRef, { isDeleted: true });
      
      // Delete all bookings for this player
      const bookingsRef = collection(db, `teams/${teamId}/bookings`);
      const bookingsQuery = query(bookingsRef, where('playerId', '==', playerId));
      const bookingsSnapshot = await getDocs(bookingsQuery);
      
      bookingsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Update current player index if needed
      const teamRef = doc(db, 'teams', teamId);
      const teamDoc = await getDoc(teamRef);
      const currentIndex = teamDoc.exists() ? (teamDoc.data().currentPlayerIndex ?? 0) : 0;
      
      if (players.findIndex(p => p.id === playerId) <= currentIndex) {
        const newIndex = Math.max(0, (currentIndex - 1)) % Math.max(1, players.length - 1);
        batch.update(teamRef, { currentPlayerIndex: newIndex });
      }

      await batch.commit();
    } catch (err) {
      console.error('Error deleting player:', err);
      throw err;
    }
  }, [teamId, players]);

  const updatePlayerName = useCallback(async (playerId: string, newName: string) => {
    if (!teamId) return;

    try {
      await updateDoc(doc(db, `teams/${teamId}/players`, playerId), { 
        name: newName
      });
    } catch (err) {
      console.error('Error updating player name:', err);
      throw err;
    }
  }, [teamId]);

  const addPlayer = useCallback(async (name: string) => {
    if (!teamId) return;

    try {
      await addDoc(collection(db, `teams/${teamId}/players`), {
        name,
        totalSpent: 0,
        createdAt: serverTimestamp(),
        isDeleted: false
      });
    } catch (err) {
      console.error('Error adding player:', err);
      throw err;
    }
  }, [teamId]);

  const deleteBooking = useCallback(async (bookingId: string) => {
    if (!teamId) return;

    try {
      const batch = writeBatch(db);
      
      // Get the booking details first
      const bookingRef = doc(db, `teams/${teamId}/bookings`, bookingId);
      const bookingDoc = await getDoc(bookingRef);
      
      if (!bookingDoc.exists()) {
        throw new Error('Booking not found');
      }

      const bookingData = bookingDoc.data();
      
      // Update player total
      const playerRef = doc(db, `teams/${teamId}/players`, bookingData.playerId);
      const playerDoc = await getDoc(playerRef);
      
      if (playerDoc.exists()) {
        const currentTotal = playerDoc.data().totalSpent || 0;
        batch.update(playerRef, {
          totalSpent: currentTotal - bookingData.amount
        });
      }

      // Delete the booking
      batch.delete(bookingRef);
      
      await batch.commit();

      // Update local state
      setBookings(prevBookings => prevBookings.filter(b => b.id !== bookingId));
    } catch (err) {
      console.error('Error deleting booking:', err);
      throw err;
    }
  }, [teamId]);

  return {
    players,
    bookings,
    loading,
    error,
    addBooking,
    updatePlayerName,
    deletePlayer,
    addPlayer,
    deleteBooking
  };
};