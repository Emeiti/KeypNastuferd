export interface Player {
  id: string;
  name: string;
  totalSpent: number;
  sessionId?: string;
  createdAt?: any;
}

export interface Team {
  id: string;
  name: string;
  players: string[];
  createdAt: string;
  shareId: string;
  sessionId?: string;
  isActive?: boolean;
}

export interface Booking {
  id: string;
  playerId: string;
  sessionId: string;
  date: string;
  amount: number;
  comment: string;
  timestamp?: any;
}

export type Language = 'en' | 'fo' | 'da';

export interface LanguageConfig {
  flag: string;
  name: string;
  currencySymbol: string;
  thousandsSeparator: string;
  decimalSeparator: string;
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
    showMore: string;
    from: string;
    to: string;
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
    umKomandi: string;
    minPlayersError: string;
    createTeamError: string;
    newTeam: string;
    date: string;
    save: string;
    cancel: string;
    edit: string;
  };
}