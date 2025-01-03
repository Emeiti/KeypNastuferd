import React, { useState } from 'react';
import type { Player, Language } from '../types';
import { LANGUAGE_CONFIG } from '../utils/formatters';

interface NextUpFormProps {
  currentPlayer: Player | null;
  language: Language;
  onSubmit: (amount: number, comment: string, date: string) => Promise<void>;
  onSkipPlayer: () => Promise<void>;
}

export const NextUpForm: React.FC<NextUpFormProps> = ({ 
  currentPlayer, 
  language,
  onSubmit,
  onSkipPlayer
}) => {
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const translations = LANGUAGE_CONFIG[language].translations;

  if (!currentPlayer) {
    return (
      <div className="bg-primary rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-white mb-4">{translations.current}</h2>
        <p className="text-white">{translations.noPlayers}</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(Number(amount), comment, date);
      await onSkipPlayer(); // Make sure we rotate to next player
      setAmount('');
      setComment('');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Failed to submit booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-primary rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">{translations.current}</h2>
        <span 
          onClick={() => !isSubmitting && onSkipPlayer()}
          className="text-white hover:text-green-100 transition-colors cursor-pointer"
        >
          {translations.skip}
        </span>
      </div>
      <div className="space-y-6">
        <div className="text-3xl font-bold text-white text-left">
          {currentPlayer.name}
        </div>
        <div className="flex gap-6">
          <div className="flex-1">
            <label htmlFor="amount" className="block text-sm font-medium text-white mb-2">
              {translations.spent}
            </label>
            <div className="relative">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-12 rounded-md border-0 bg-white bg-opacity-90 text-gray-800 px-3 focus:ring-0 focus:outline-none text-lg font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                step="1"
                min="0"
                required
                disabled={isSubmitting}
                autoFocus
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800">
                {language === 'en' ? '$' : 'kr.'}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="date" className="block text-sm font-medium text-white mb-2">
              {translations.date}
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-12 rounded-md border-0 bg-white bg-opacity-90 text-gray-900 px-3 focus:ring-0 focus:outline-none"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-white mb-2">
            {translations.comment}
          </label>
          <input
            type="text"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-12 rounded-md border-0 bg-white bg-opacity-90 text-gray-900 px-3 focus:ring-0 focus:outline-none"
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !amount}
          className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-opacity-20 transition-colors disabled:text-opacity-0 disabled:cursor-not-allowed font-bold text-lg mt-4"
        >
          {translations.recordBooking}
        </button>
      </div>
    </form>
  );
};