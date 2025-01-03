import React, { useState, useCallback, Component, ErrorInfo, ReactNode } from 'react';
import { Share2, Plus } from 'lucide-react';
import { useFirestore } from './hooks/useFirestore';
import { usePlayerRotation } from './hooks/usePlayerRotation';
import { useBookings } from './hooks/useBookings';
import { PlayerList } from './components/PlayerList';
import { NextUpForm } from './components/NextUpForm';
import { Statistics } from './components/Statistics';
import { CreateTeam } from './components/CreateTeam';
import { Toast } from './components/Toast';
import type { Language } from './types';
import { LANGUAGE_CONFIG } from './utils/formatters';
import { useTeam } from './hooks/useTeam';
import { Header } from './components/Header';

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please check the console for details.</div>;
    }

    return this.props.children;
  }
}

// Add interface for Team
interface Team {
  id: string;
  name: string;
}

function App() {
  const [language] = useState<Language>('fo');
  const [showToast, setShowToast] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const teamId = params.get('team');
  
  const { players, bookings, loading, error, updatePlayerName, deletePlayer, addPlayer } = useFirestore();
  const { currentPlayerIndex, currentPlayer, rotateToNextPlayer } = usePlayerRotation(players);
  const { submitBooking } = useBookings(teamId, players);
  const { getTeam } = useTeam();
  const [teamName, setTeamName] = useState<string>('');
  const translations = LANGUAGE_CONFIG[language].translations;

  React.useEffect(() => {
    if (teamId) {
      getTeam(teamId).then((team: Team | null) => {
        if (team) {
          setTeamName(team.name);
        }
      });
    }
  }, [teamId, getTeam]);

  const handleBookingSubmit = useCallback(async (amount: number, comment: string, date: string) => {
    if (!currentPlayer) return;
    
    try {
      await submitBooking(currentPlayer.id, amount, comment, date);
    } catch (err) {
      console.error('Error submitting booking:', err);
    }
  }, [currentPlayer, submitBooking]);

  const handleNewTeam = () => {
    window.location.href = window.location.origin;
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}?team=${teamId}`;
    await navigator.clipboard.writeText(shareUrl);
    setShowToast(true);
  };

  if (!teamId) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-24">
            <Header />
          </div>
          <CreateTeam language={language} />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-gray-600">{translations.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-md w-full">
          <h2 className="font-semibold text-lg mb-2">{translations.error}</h2>
          <p className="mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Header />
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">{teamName}</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleNewTeam}
                className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {translations.createTeam}
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                {translations.share}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NextUpForm
              currentPlayer={currentPlayer}
              language={language}
              onSubmit={handleBookingSubmit}
              onSkipPlayer={rotateToNextPlayer}
            />
            <PlayerList
              players={players}
              currentPlayerIndex={currentPlayerIndex}
              language={language}
              onUpdatePlayerName={updatePlayerName}
              onDeletePlayer={deletePlayer}
              onAddPlayer={addPlayer}
            />
          </div>

          <Statistics 
            players={players} 
            bookings={bookings}
            language={language}
          />
        </div>
        <Toast 
          message={translations.copied} 
          isVisible={showToast} 
          onClose={() => setShowToast(false)} 
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;