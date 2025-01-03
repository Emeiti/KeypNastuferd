import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import type { Player } from '../types';

interface EditPlayerNameProps {
  player: Player;
  onSave: (playerId: string, newName: string) => void;
}

export const EditPlayerName: React.FC<EditPlayerNameProps> = ({ player, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(player.name);

  const handleSave = () => {
    if (newName.trim()) {
      onSave(player.id, newName.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setNewName(player.name);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="px-2 py-1 border rounded text-sm"
          autoFocus
        />
        <button
          onClick={handleSave}
          className="p-1 text-green-600 hover:text-green-700"
          title="Save"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 text-red-600 hover:text-red-700"
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{player.name}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 text-gray-500 hover:text-gray-700"
        title="Edit name"
      >
        <Edit2 className="w-4 h-4" />
      </button>
    </div>
  );
};