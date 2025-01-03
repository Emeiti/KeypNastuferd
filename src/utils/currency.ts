import { Language } from '../types';
import { LANGUAGE_CONFIG } from './formatters';

export const formatCurrency = (amount: number, language: Language): string => {
  const config = LANGUAGE_CONFIG[language];
  const formattedNumber = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandsSeparator);

  return language === 'en'
    ? `${config.currencySymbol}${formattedNumber}`
    : `${formattedNumber} ${config.currencySymbol}`;
};