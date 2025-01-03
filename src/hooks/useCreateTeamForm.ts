import { useState } from 'react';
import { useTeam } from './useTeam';
import type { Language } from '../types';
import { LANGUAGE_CONFIG } from '../utils/formatters';

export const useCreateTeamForm = (language: Language) => {
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { createTeam } = useTeam();

  const handleTeamNameChange = (value: string) => {
    setTeamName(value);
  };

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const handleAddPlayer = () => {
    setPlayers([...players, '']);
    // Focus new input after state update
    setTimeout(() => {
      const inputs = document.querySelectorAll('input[type="text"]');
      const lastInput = inputs[inputs.length - 1] as HTMLInputElement;
      lastInput.focus();
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const filledPlayers = players.filter(player => player.trim() !== '');
    if (filledPlayers.length < 2) {
      setError(LANGUAGE_CONFIG[language].translations.minPlayersError);
      setLoading(false);
      return;
    }

    try {
      const teamId = await createTeam(teamName, filledPlayers);
      if (teamId) {
        window.location.href = `/team?team=${teamId}`;
      } else {
        setError(LANGUAGE_CONFIG[language].translations.createTeamError);
      }
    } catch (err) {
      setError(LANGUAGE_CONFIG[language].translations.createTeamError);
    } finally {
      setLoading(false);
    }
  };

  return {
    teamName,
    players,
    loading,
    error,
    handleTeamNameChange,
    handlePlayerChange,
    handleAddPlayer,
    handleSubmit
  };
};