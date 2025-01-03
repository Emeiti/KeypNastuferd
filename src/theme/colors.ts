export const colors = {
  primary: '#3bcc86',
} as const;

export const withOpacity = (color: string, opacity: number) => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};