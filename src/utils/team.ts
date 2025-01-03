import { 
  collection, 
  query, 
  where, 
  serverTimestamp, 
  writeBatch, 
  doc, 
  getDocs,
  limit,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Team } from '../types';

export const createNewTeam = async (name: string, playerNames: string[]): Promise<Team> => {
  try {
    const teamId = Math.random().toString(36).substr(2, 12);
    const batch = writeBatch(db);
    
    // Create team document with nested players collection
    const teamRef = doc(db, 'teams', teamId);
    const teamData = {
      name,
      createdAt: serverTimestamp(),
      isActive: true,
      currentPlayerIndex: 0
    };
    
    batch.set(teamRef, teamData);

    // Create players as a subcollection
    const playerIds = playerNames
      .filter(name => name.trim())
      .map((playerName, index) => {
        const playerId = Math.random().toString(36).substr(2, 12);
        const playerRef = doc(db, `teams/${teamId}/players`, playerId);
        batch.set(playerRef, {
          name: playerName.trim(),
          totalSpent: 0,
          order: index,
          createdAt: serverTimestamp()
        });
        return playerId;
      });

    await batch.commit();

    return {
      id: teamId,
      name,
      players: playerIds,
      shareId: teamId,
      createdAt: new Date().toISOString(),
      isActive: true
    };
  } catch (error) {
    console.error('Error creating team:', error);
    throw new Error('Failed to create team');
  }
};

export const loadTeamByShareId = async (shareId: string): Promise<Team | null> => {
  try {
    const teamRef = doc(db, 'teams', shareId);
    const teamSnap = await getDocs(query(collection(db, `teams/${shareId}/players`), orderBy('order')));
    
    if (!teamSnap.empty) {
      const teamDoc = await teamRef.get();
      const teamData = teamDoc.data();

      return {
        id: shareId,
        name: teamData?.name || '',
        players: teamSnap.docs.map(doc => doc.id),
        shareId,
        createdAt: teamData?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        isActive: true
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error loading team:', error);
    return null;
  }
};