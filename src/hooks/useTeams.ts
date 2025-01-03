import { useState, useCallback } from 'react';
import { 
  collection, 
  doc,
  getDoc,
  writeBatch,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Team, Player, Booking } from '../types';

export const useTeams = () => {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTeam = async (name: string, playerNames: string[]): Promise<string | null> => {
    try {
      setLoading(true);
      const teamId = Math.random().toString(36).substr(2, 12);
      const batch = writeBatch(db);
      
      // Create team document
      const teamRef = doc(db, 'teams', teamId);
      batch.set(teamRef, {
        name,
        createdAt: serverTimestamp(),
        currentPlayerIndex: 0
      });

      // Create players subcollection
      playerNames
        .filter(name => name.trim())
        .forEach((playerName, index) => {
          const playerRef = doc(collection(db, 'teams', teamId, 'players'));
          batch.set(playerRef, {
            name: playerName.trim(),
            totalSpent: 0,
            order: index,
            createdAt: serverTimestamp()
          });
        });

      await batch.commit();
      return teamId;
    } catch (error) {
      console.error('Error creating team:', error);
      setError('Failed to create team');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadTeam = useCallback(async (teamId: string) => {
    if (!teamId) return false;
    
    try {
      setLoading(true);
      setError(null);

      // Get team data
      const teamRef = doc(db, 'teams', teamId);
      const teamDoc = await getDoc(teamRef);
      
      if (!teamDoc.exists()) {
        setError('Team not found');
        return false;
      }

      // Get initial data
      const playersRef = collection(db, 'teams', teamId, 'players');
      const playersSnapshot = await getDocs(query(playersRef, orderBy('order')));
      const loadedPlayers = playersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Player[];

      const bookingsRef = collection(db, 'teams', teamId, 'bookings');
      const bookingsSnapshot = await getDocs(query(bookingsRef, orderBy('timestamp', 'desc')));
      const loadedBookings = bookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];

      // Set up real-time listeners with proper error handling
      const unsubPlayers = onSnapshot(
        query(playersRef, orderBy('order')),
        (snapshot) => {
          const updatedPlayers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Player[];
          setPlayers(updatedPlayers);
        },
        (error) => {
          console.error('Players listener error:', error);
        }
      );

      const unsubBookings = onSnapshot(
        query(bookingsRef, orderBy('timestamp', 'desc')),
        (snapshot) => {
          const updatedBookings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Booking[];
          setBookings(updatedBookings);
        },
        (error) => {
          console.error('Bookings listener error:', error);
        }
      );

      setPlayers(loadedPlayers);
      setBookings(loadedBookings);
      setCurrentTeam({
        id: teamId,
        ...teamDoc.data()
      } as Team);
      setLoading(false);

      return () => {
        unsubPlayers();
        unsubBookings();
      };
    } catch (error) {
      console.error('Error loading team:', error);
      setError('Failed to load team');
      setLoading(false);
      return false;
    }
  }, []);

  return {
    currentTeam,
    players,
    bookings,
    loading,
    error,
    createTeam,
    loadTeam
  };
};