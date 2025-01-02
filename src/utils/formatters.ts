import { Language, LanguageConfig } from '../types';

export const LANGUAGE_CONFIG: Record<Language, LanguageConfig> = {
  fo: {
    flag: '🇫🇴',
    name: 'Føroyskt',
    currencySymbol: 'kr.',
    thousandsSeparator: '.',
    decimalSeparator: ',',
    translations: {
      welcome: 'Næstuferð',
      createTeam: 'Stovna bólk',
      teamName: 'Navn á bólki',
      addPlayers: 'Persónur',
      createButton: 'Stovna bólk',
      current: '',
      skip: 'Hoppa um',
      spent: 'Brúkt:',
      comment: 'Viðmerking',
      recordBooking: 'Skráseta bóking',
      statistics: 'Hagtøl',
      showMore: 'Vís meira',
      from: 'Frá',
      to: 'Til',
      umKomandi: 'Keyp Næstuferð er eitt einfalt amboð, ið ger tað lætt at halda skil á, hvør skal gjalda næstu ferð. Samstundis sæst eisini, hvussu nógv tann einstaki hevur goldið.',
      latestBookings: 'Seinastu bókingar',
      filteredBookings: 'Sílaðar bókingar',
      share: 'Deil',
      copied: 'Avritað!',
      loading: 'Løðir...',
      error: 'Villa',
      playersOrder: '',
      editPlayers: 'Broyt',
      saveChanges: 'Goym',
      deletePlayer: 'Strika',
      newPlayerName: 'Nýtt navn',
      addPlayer: 'Ein afturat',
      next: 'Næstur',
      noPlayers: 'Ongin skrásettur',
      minPlayersError: 'Í minsta lagi 2 persónar skulu vera við',
      createTeamError: 'Villa í at stovna bólk. Royn aftur.',
      newTeam: 'Nýtt',
      date: 'Dagfesting',
      save: 'Goym',
      cancel: 'Angra',
      edit: 'Broyt',
      deleteBooking: 'Strika bóking'
    }
  },
  en: {
    flag: '🇬🇧',
    name: 'English',
    currencySymbol: '$',
    thousandsSeparator: ',',
    decimalSeparator: '.',
    translations: {
      welcome: 'Welcome',
      createTeam: 'Create a Group',
      teamName: 'Group Name',
      addPlayers: 'Person',
      createButton: 'Create Group',
      current: '',
      skip: 'Skip',
      spent: 'Spent:',
      comment: 'Comment',
      recordBooking: 'Record',
      statistics: 'Statistics',
      showMore: 'Show More',
      from: 'From',
      to: 'To',
      umKomandi: 'Keyp Næstuferð is a simple tool that makes it easy to keep track of who should pay next time. At the same time, it also shows how much each individual has paid.',
      latestBookings: 'Latest Bookings',
      filteredBookings: 'Filtered Bookings',
      share: 'Share',
      copied: 'Copied!',
      loading: 'Loading...',
      error: 'An error occurred',
      playersOrder: '',
      editPlayers: 'Edit',
      saveChanges: 'Save Changes',
      deletePlayer: 'Delete',
      newPlayerName: 'New Name',
      addPlayer: 'Add Player',
      next: 'Next',
      noPlayers: 'No Persons',
      minPlayersError: 'At least 2 persons are required',
      createTeamError: 'Error creating group. Please try again.',
      newTeam: 'New',
      date: 'Date',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit'
    }
  },
  da: {
    flag: '🇩🇰',
    name: 'Dansk',
    currencySymbol: 'kr.',
    thousandsSeparator: '.',
    decimalSeparator: ',',
    translations: {
      welcome: 'Velkommen',
      createTeam: 'Opret Gruppe',
      teamName: 'Gruppenavn',
      addPlayers: 'Person',
      createButton: 'Opret',
      current: '',
      skip: 'Spring over',
      spent: 'Brugt:',
      comment: 'Kommentar',
      recordBooking: 'Registrer Booking',
      statistics: 'Statistik',
      showMore: 'Vis mere',
      from: 'Fra',
      to: 'Til',
      umKomandi: 'Keyp Næstuferð er et simpelt værktøj, der gør det nemt at holde styr på, hvem der skal betale næste gang. Samtidig viser det også, hvor meget hver enkelt har betalt.',
      latestBookings: 'Seneste Bookinger',
      filteredBookings: 'Filtrerede Bookinger',
      share: 'Del',
      copied: 'Kopieret!',
      loading: 'Indlæser...',
      error: 'Der opstod en fejl',
      playersOrder: '',
      editPlayers: 'Rediger',
      saveChanges: 'Gem Ændringer',
      deletePlayer: 'Slet',
      newPlayerName: 'Nyt Navn',
      addPlayer: 'Tilføj Spiller',
      next: 'Næste',
      noPlayers: 'Ingen personer',
      minPlayersError: 'Mindst 2 personer er påkrævet',
      createTeamError: 'Fejl ved oprettelse af gruppen. Prøv igen.',
      newTeam: 'Ny',
      date: 'Dato',
      save: 'Gem',
      cancel: 'Annuller',
      edit: 'Rediger'
    }
  }
};