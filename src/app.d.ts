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
      // auth: import('lucia').AuthRequest;
    }
    interface PageData {
      flash?: {
        type: 'success' | 'error' | 'warning';
        message: string;
        title?: string;
        clearable?: boolean;
      };
      urls?: import('$lib/server/schema/types').URLsType[];
    }
    // interface Platform {}
  }
}

// declare global {
//   namespace Lucia {
//     type Auth = import('$lib/server/lucia').Auth;
//     type DatabaseUserAttributes = {
//       username: string;
//     };
//     type DatabaseSessionAttributes = {};
//   }
// }

export {};
