import React, { useState } from 'react';
import { User, Edit2, Save, Plus, Trash2 } from 'lucide-react';
import type { Player, Language } from '../types';
import { formatCurrency } from '../utils/currency';
import { LANGUAGE_CONFIG } from '../utils/formatters';

interface PlayerListProps {
  players: Player[];
  currentPlayerIndex: number;
  language: Language;
  onUpdatePlayerName: (playerId: string, newName: string) => void;
  onDeletePlayer: (playerId: string) => void;
  onAddPlayer: (name: string) => void;
}

export const PlayerList: React.FC<PlayerListProps> = ({ 
  players,
  currentPlayerIndex,
  language,
  onUpdatePlayerName,
  onDeletePlayer,
  onAddPlayer
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNames, setEditedNames] = useState<Record<string, string>>({});
  const [newPlayerName, setNewPlayerName] = useState('');
  const translations = LANGUAGE_CONFIG[language].translations;

  const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;

  const handleEditStart = () => {
    setIsEditing(true);
    const names = players.reduce((acc, player) => ({
      ...acc,
      [player.id]: player.name
    }), {});
    setEditedNames(names);
  };

  const handleSaveAll = () => {
    Object.entries(editedNames).forEach(([id, name]) => {
      if (name.trim() && name !== players.find(p => p.id === id)?.name) {
        onUpdatePlayerName(id, name.trim());
      }
    });
    setIsEditing(false);
    setNewPlayerName('');
  };

  const handleNameChange = (playerId: string, newName: string) => {
    setEditedNames(prev => ({
      ...prev,
      [playerId]: newName
    }));
  };

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  // Calculate max spent for difference
  const maxSpent = Math.max(...players.map(p => p.totalSpent));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <User className="w-5 h-5" />
          {translations.playersOrder}
        </h2>
        <button
          onClick={isEditing ? handleSaveAll : handleEditStart}
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          title={isEditing ? translations.saveChanges : translations.editPlayers}
        >
          {isEditing ? (
            <Save className="w-5 h-5" />
          ) : (
            <Edit2 className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="space-y-3">
        {players.map((player, index) => {
          const isCurrentPlayer = index === currentPlayerIndex;
          const difference = maxSpent - player.totalSpent;
          
          return (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                isCurrentPlayer ? 'bg-primary text-white' : 'bg-gray-50'
              }`}
            >
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedNames[player.id] || ''}
                    onChange={(e) => handleNameChange(player.id, e.target.value)}
                    className="px-2 py-1 border rounded bg-white text-gray-800"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-regular">
                      {player.name}
                    </span>
                    {index === nextPlayerIndex && (
                      <span className={`text-sm ${isCurrentPlayer ? 'text-white' : 'text-primary'}`}>
                        ({translations.next})
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!isEditing && (
                  <div className="flex items-center gap-4 min-w-[200px] justify-end">
                    {difference > 0 && (
                      <span className={`text-sm ${isCurrentPlayer ? 'text-white' : 'text-primary'}`}>
                        (-{formatCurrency(difference, language)})
                      </span>
                    )}
                    <span className={`min-w-[80px] text-right font-semibold text-lg ${
                      isCurrentPlayer ? 'text-white' : 'text-gray-800'
                    }`}>
                      {formatCurrency(player.totalSpent, language)}
                    </span>
                  </div>
                )}
                {isEditing && (
                  <button
                    onClick={() => onDeletePlayer(player.id)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors ml-4"
                    title={translations.deletePlayer}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {isEditing && (
        <div className="mt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder={translations.newPlayerName}
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <button
              onClick={handleAddPlayer}
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-primary hover:bg-opacity-100 transition-colors text-white"
            >
              <Plus className="w-4 h-4" />
              {translations.addPlayer}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};