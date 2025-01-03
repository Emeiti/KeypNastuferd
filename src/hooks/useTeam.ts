import { useState, useCallback } from 'react';
import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Team } from '../types';

export const useTeam = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTeam = useCallback(async (name: string, initialPlayers: string[]) => {
    setLoading(true);
    try {
      // Generate a unique team ID
      const teamId = crypto.randomUUID();
      const teamRef = doc(db, 'teams', teamId);

      // Create team document
      await setDoc(teamRef, {
        name,
        createdAt: serverTimestamp(),
      });

      // Add initial players
      const playersCollection = collection(teamRef, 'players');
      await Promise.all(
        initialPlayers.map(async (playerName, index) => {
          const playerDoc = doc(playersCollection);
          await setDoc(playerDoc, {
            name: playerName,
            totalSpent: 0,
            order: index,
            createdAt: serverTimestamp(),
            isDeleted: false
          });
        })
      );

      return teamId;
    } catch (err) {
      console.error('Error creating team:', err);
      setError('Failed to create team');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTeam = useCallback(async (teamId: string): Promise<Team | null> => {
    try {
      const teamRef = doc(db, 'teams', teamId);
      const teamDoc = await getDoc(teamRef);
      
      if (!teamDoc.exists()) {
        return null;
      }

      return {
        id: teamDoc.id,
        name: teamDoc.data().name,
        players: [],  // Add required Team properties
        createdAt: teamDoc.data().createdAt,
        shareId: teamId
      } as Team;
    } catch (err) {
      console.error('Error getting team:', err);
      return null;
    }
  }, []);

  return {
    createTeam,
    getTeam,
    loading,
    error
  };
};