import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Player } from '../types';

export const usePlayerRotation = (players: Player[]) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const params = new URLSearchParams(window.location.search);
  const teamId = params.get('team');

  // Listen to current player index from Firestore
  useEffect(() => {
    if (!teamId) return;

    const unsubscribe = onSnapshot(doc(db, 'teams', teamId), (doc) => {
      if (doc.exists()) {
        const index = doc.data().currentPlayerIndex ?? 0;
        setCurrentPlayerIndex(index);
      }
    });

    return () => unsubscribe();
  }, [teamId]);

  const rotateToNextPlayer = useCallback(async () => {
    if (!teamId || players.length === 0) return;
    
    try {
      // Get the latest team document to ensure we have the current index
      const teamDoc = await getDoc(doc(db, 'teams', teamId));
      const currentIndex = teamDoc.exists() ? (teamDoc.data().currentPlayerIndex ?? 0) : 0;
      const nextIndex = (currentIndex + 1) % players.length;
      
      // Update the current player index in Firestore
      await updateDoc(doc(db, 'teams', teamId), {
        currentPlayerIndex: nextIndex
      });
    } catch (err) {
      console.error('Error updating current player:', err);
      throw err; // Propagate error to handle it in the UI
    }
  }, [teamId, players]);

  return {
    currentPlayerIndex,
    currentPlayer: players[currentPlayerIndex] || null,
    rotateToNextPlayer,
  };
};