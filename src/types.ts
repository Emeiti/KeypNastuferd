export interface LanguageConfig {
  translations: {
    welcome: string;
    createTeam: string;
    teamName: string;
    addPlayers: string;
    createButton: string;
    current: string;
    skip: string;
    spent: string;
    comment: string;
    recordBooking: string;
    statistics: string;
    minPlayersError: string;
    createTeamError: string;
    newTeam: string;
    save: string;
    cancel: string;
    edit: string;
    showMore: string;
    from: string;
    to: string;
    umKomandi: string;
    latestBookings: string;
    filteredBookings: string;
    share: string;
    copied: string;
    loading: string;
    error: string;
    playersOrder: string;
    editPlayers: string; 
    saveChanges: string;
    deletePlayer: string;
    newPlayerName: string;
    addPlayer: string;
    next: string;
    noPlayers: string;
    date: string;
    flag: string;
    deleteBooking: string;
    
    // ... rest of existing translations ...
  };
  // ... other config properties
}

export interface Player {
  id: string;
  name: string;
  totalSpent: number;
  // Add any other properties that are relevant
}

export interface Booking {
  id: string;
  playerId: string;
  amount: number;
  comment: string;
  date: string;
  // Add any other properties that are relevant
}

export interface Team {
  id: string;
  name: string;
  players: string[]; // Adjust the type based on your data structure
  createdAt: Date;
  shareId: string;
  // Add any other properties that are relevant
}

export type Language = 'en' | 'fo' | 'da'; // Example languages, adjust as needed 