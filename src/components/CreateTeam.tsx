import React from 'react';
import { Plus } from 'lucide-react';
import { LANGUAGE_CONFIG } from '../utils/formatters';
import type { Language } from '../types';
import { useCreateTeamForm } from '../hooks/useCreateTeamForm';

interface CreateTeamProps {
  language: Language;
}

export const CreateTeam: React.FC<CreateTeamProps> = ({ language }) => {
  const translations = LANGUAGE_CONFIG[language].translations;
  const {
    teamName,
    players,
    loading,
    error,
    handleTeamNameChange,
    handlePlayerChange,
    handleAddPlayer,
    handleSubmit
  } = useCreateTeamForm(language);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-8 text-gray-600 text-base">
        <p>{translations.umKomandi}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-base text-gray-800 font-semibold mb-2">
            {translations.teamName}
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTeamNameChange(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
            required
          />
        </div>

        <div className="space-y-3">
  {players.map((player, index) => (
    <input
      key={index}
      type="text"
      value={player}
      onChange={(e) => handlePlayerChange(index, e.target.value)}
      placeholder={`${translations.addPlayers} ${index + 1}`}
      className="w-full px-3 py-2 border rounded-md focus:ring-0 focus:border-primary"
    />
  ))}
</div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleAddPlayer}
            className="flex-1 py-2 px-4 text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {translations.addPlayers}
          </button>

          <button
            type="submit"
            disabled={loading || !teamName.trim()}
            className="flex-1 py-2 px-4 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? translations.loading : 'Upprætta'}
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}
      </form>
    </div>
  );
};