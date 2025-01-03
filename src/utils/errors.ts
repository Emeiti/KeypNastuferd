export class BookingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BookingError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const handleFirebaseError = (error: unknown): Error => {
  console.error('Firebase operation failed:', error);
  if (error instanceof Error) {
    return error;
  }
  return new Error('An unexpected error occurred');
};