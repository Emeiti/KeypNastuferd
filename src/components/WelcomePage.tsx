import React, { useState } from 'react';
// ... rest of imports

export const WelcomePage: React.FC<WelcomePageProps> = ({ language }) => {
  // ... existing code

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        {/* ... other elements */}
        <button
          type="button"
          onClick={handleAddPlayer}
          className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-primary hover:text-primary transition-colors"
          disabled={isSubmitting}
        >
          + {translations.addPlayer}
        </button>

        <button
          type="submit"
          disabled={isSubmitting || !teamName.trim()}
          className={`w-full py-3 px-4 rounded-md font-bold transition-colors ${
            isSubmitting || !teamName.trim()
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-primary text-white hover:bg-opacity-90'
          }`}
        >
          {isSubmitting ? translations.loading : translations.createButton}
        </button>
        {/* ... rest of the component */}
      </div>
    </div>
  );
};