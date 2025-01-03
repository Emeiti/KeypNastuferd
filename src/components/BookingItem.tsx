import React, { useState, useEffect } from 'react';
import { Check, X, Trash2 } from 'lucide-react';
import type { Booking, Player, Language } from '../types';
import { LANGUAGE_CONFIG } from '../utils/formatters';

interface BookingItemProps {
  booking: Booking;
  players: Player[];
  language: Language;
  onEdit: (bookingId: string, playerId: string, amount: number, comment: string, date: string) => Promise<void>;
  onCancel: () => void;
  onDelete?: (bookingId: string) => Promise<void>;
}

export const BookingItem: React.FC<BookingItemProps> = ({ 
  booking, 
  players, 
  language, 
  onEdit,
  onCancel,
  onDelete 
}) => {
  const translations = LANGUAGE_CONFIG[language].translations;
  const [editedAmount, setEditedAmount] = useState(booking.amount);
  const [editedComment, setEditedComment] = useState(booking.comment);
  const [editedDate, setEditedDate] = useState(booking.date);
  const [editedPlayerId, setEditedPlayerId] = useState(booking.playerId);

  const handleSave = async () => {
    console.log('Save triggered with values:', {
      bookingId: booking.id,
      playerId: editedPlayerId,
      amount: editedAmount,
      comment: editedComment,
      date: editedDate
    });

    try {
      await onEdit(booking.id, editedPlayerId, editedAmount, editedComment, editedDate);
      console.log('Save completed successfully');
    } catch (error) {
      console.error('Error in handleSave:', error);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      console.log('Key pressed:', e.key);
      if (e.key.toLowerCase() === 'v') {
        console.log('V key detected, triggering save');
        handleSave();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [editedAmount, editedComment, editedDate, editedPlayerId]);

  return (
    <div className="flex items-center gap-4 py-2 border-b last:border-b-0 bg-white p-3 rounded-lg">
      <select
        value={editedPlayerId}
        onChange={(e) => setEditedPlayerId(e.target.value)}
        className="px-2 py-1 border rounded"
      >
        {players.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <input
        type="number"
        value={editedAmount}
        onChange={(e) => setEditedAmount(Number(e.target.value))}
        className="w-24 px-2 py-1 border rounded"
      />
      <input
        type="text"
        value={editedComment}
        onChange={(e) => setEditedComment(e.target.value)}
        className="flex-1 px-2 py-1 border rounded"
      />
      <input
        type="date"
        value={editedDate}
        onChange={(e) => setEditedDate(e.target.value)}
        className="w-32 px-2 py-1 border rounded"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          className="p-1 text-green-600 hover:text-green-700"
          title={translations.save}
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={onCancel}
          className="p-1 text-red-600 hover:text-red-700"
          title={translations.cancel}
        >
          <X className="w-4 h-4" />
        </button>
        {onDelete && (
          <button
            onClick={() => onDelete(booking.id)}
            className="p-1 text-red-600 hover:text-red-700"
            title={translations.deleteBooking}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};