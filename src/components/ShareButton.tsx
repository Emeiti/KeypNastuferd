import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { LANGUAGE_CONFIG } from '../utils/formatters';
import type { Language } from '../types';

interface ShareButtonProps {
  language: Language;
  teamShareId?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ language, teamShareId }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const translations = LANGUAGE_CONFIG[language].translations;

  const handleShare = async () => {
    if (!teamShareId) return;

    const shareUrl = `${window.location.origin}?team=${teamShareId}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="text-gray-600 hover:text-gray-900 transition-colors"
        disabled={!teamShareId}
      >
        <Share2 className="w-5 h-5" />
      </button>
      {showTooltip && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
          {translations.copied}
        </div>
      )}
    </div>
  );
};