// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      error: string;
      message: string;
    }
    interface Locals {
      user: import('./hooks.server').UserReturnType;
    }
    interface PageData {
      flash?: {
        type: 'success' | 'error' | 'warning';
        message: string;
        title?: string;
        clearable?: boolean;
        timeout?: number;
      };
      urls?: import('$lib/server/schema/types').URLsType[];
    }
    // interface Platform {}
  }
}

export {};
