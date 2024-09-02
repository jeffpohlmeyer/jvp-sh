export type FlashType = {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  timeout?: number;
};
