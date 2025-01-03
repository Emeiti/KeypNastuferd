import { ValidationError } from './errors';

export const validateAmount = (amount: number): void => {
  if (isNaN(amount) || amount <= 0) {
    throw new ValidationError('Amount must be a positive number');
  }
};

export const validateBookingUpdate = (amount: number, comment: string): void => {
  validateAmount(amount);
  if (comment.length > 500) {
    throw new ValidationError('Comment is too long (maximum 500 characters)');
  }
};