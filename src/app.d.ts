// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      error: string;
      message: string;
    }
    interface Locals {
      user: import('$lib/server/db/schema/postgres').UserType | null;
      session: import('$lib/server/db/schema/postgres').SessionType | null;
    }
    interface PageData {
      flash?: {
        type: 'success' | 'error' | 'warning';
        message: string;
        title?: string;
        clearable?: boolean;
        timeout?: number;
      };
      urls?: import('$lib/server/schema/postgres').URLsType[];
    }
    // interface Platform {}
  }
  namespace Superforms {
    import('./lib/types/super-forms').Message;
  }
}

export {};
