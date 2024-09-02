export type Message = {
  type: 'error' | 'success';
  title?: string;
  text: string;
};
