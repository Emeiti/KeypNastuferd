import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react';
import type { Player, Booking, Language } from '../types';
import { formatCurrency } from '../utils/currency';
import { LANGUAGE_CONFIG } from '../utils/formatters';
import { BookingItem } from './BookingItem';
import { useBookingEdit } from '../hooks/useBookingEdit';
import { useFirestore } from '../hooks/useFirestore';

interface StatisticsProps {
  players: Player[];
  bookings: Booking[];
  language: Language;
}

export const Statistics: React.FC<StatisticsProps> = ({ players, bookings, language }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [visibleBookings, setVisibleBookings] = useState(12);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [localBookings, setLocalBookings] = useState<Booking[]>(bookings);
  const { handleEditBooking } = useBookingEdit();
  const { deleteBooking } = useFirestore();
  const translations = LANGUAGE_CONFIG[language].translations;

  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  useEffect(() => {
    if (selectedBooking) {
      const amountInput = document.querySelector('input[type="number"]') as HTMLInputElement;
      if (amountInput) {
        amountInput.focus();
      }
    }
  }, [selectedBooking]);

  const filteredBookings = useMemo(() => {
    if (startDate && endDate) {
      return localBookings.filter(booking => 
        booking.date >= startDate && 
        booking.date <= endDate
      );
    }
    return localBookings;
  }, [localBookings, startDate, endDate]);

  const displayedBookings = filteredBookings.slice(0, visibleBookings);
  const hasMoreBookings = filteredBookings.length > visibleBookings;

  const loadMore = () => {
    setVisibleBookings(prev => prev + 12);
  };

  // Calculate max spent for showing differences
  const maxSpent = Math.max(...players.map(player => 
    filteredBookings
      .filter(booking => booking.playerId === player.id)
      .reduce((sum, booking) => sum + booking.amount, 0)
  ));

  const playerBalances = players.map(player => {
    const totalSpent = filteredBookings
      .filter(booking => booking.playerId === player.id)
      .reduce((sum, booking) => sum + booking.amount, 0);
    
    return {
      ...player,
      balance: totalSpent,
      difference: maxSpent - totalSpent
    };
  });

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await deleteBooking(bookingId);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const onEditBooking = async (bookingId: string, playerId: string, amount: number, comment: string, date: string) => {
    try {
      await handleEditBooking(bookingId, playerId, amount, comment, date);
      setSelectedBooking(null); // Close edit view after successful save
    } catch (error) {
      console.error('Error editing booking:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-xl font-semibold mb-4"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          {translations.statistics}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      
      {isExpanded && (
        <>
          <div className="mb-6 flex gap-4 items-end">
            <div>
              <label className="block text-sm text-gray-600 mb-1">{translations.from}</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`px-3 py-2 border rounded-md ${
                  startDate ? 'bg-primary text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert' : ''
                }`}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{translations.to}</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`px-3 py-2 border rounded-md ${
                  endDate ? 'bg-primary text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert' : ''
                }`}
              />
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {playerBalances.map(player => (
              <div key={player.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{player.name}</span>
                  <div className="flex items-center gap-4">
                    {player.difference > 0 && (
                      <span className="text-primary text-sm">
                        (-{formatCurrency(player.difference, language)})
                      </span>
                    )}
                    <span className="font-bold">
                      {formatCurrency(player.balance, language)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">
              {startDate && endDate ? translations.filteredBookings : translations.latestBookings}
            </h3>
            <div className="space-y-2">
              {displayedBookings.map((booking) => {
                const player = players.find(p => p.id === booking.playerId);
                return selectedBooking?.id === booking.id ? (
                  <BookingItem
                    key={booking.id}
                    booking={booking}
                    players={players}
                    language={language}
                    onEdit={onEditBooking}
                    onDelete={handleDeleteBooking}
                    onCancel={() => setSelectedBooking(null)}
                  />
                ) : (
                  <div key={booking.id} className="bg-gray-50 p-3 rounded-lg group">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">{player?.name}</span>
                        {booking.comment && (
                          <p className="text-sm text-gray-600 mt-1">{booking.comment}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(booking.amount, language)}</div>
                          <div className="text-sm text-gray-600">{booking.date}</div>
                        </div>
                        <button
                          className="p-1 text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          title={translations.edit}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {hasMoreBookings && (
              <button
                onClick={loadMore}
                className="w-full mt-4 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
              >
                {translations.showMore}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};