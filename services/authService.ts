
import { createAuth0Client, Auth0Client } from '@auth0/auth0-spa-js';

let auth0Client: Auth0Client | null = null;

export const authService = {
  init: async () => {
    // Fix: Use process.env for environment variables to avoid Property 'env' does not exist on type 'ImportMeta' errors
    // Providing hardcoded fallbacks from the user's screenshot to ensure immediate functionality
    const domain = process.env.VITE_AUTH0_DOMAIN || 'dev-ae5koudevlvws20s.us.auth0.com';
    const clientId = process.env.VITE_AUTH0_CLIENT_ID || 'BK80v0IJpx4UuaemCQ2pAcaJR0HJuZAx';

    if (!domain || !clientId) {
      console.error("Auth0 configuration missing. Check VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID.");
      return null;
    }

    try {
      if (!auth0Client) {
        auth0Client = await createAuth0Client({
          domain,
          clientId,
          authorizationParams: {
            redirect_uri: window.location.origin
          },
          cacheLocation: 'localstorage',
          useRefreshTokens: true
        });
      }

      // Handle the redirect callback if we are coming back from Auth0 login
      const query = window.location.search;
      if (query.includes("code=") && query.includes("state=")) {
        await auth0Client.handleRedirectCallback();
        // Clean up the URL
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, document.title, url.toString());
      }

      return auth0Client;
    } catch (error) {
      console.error("Auth0 initialization error:", error);
      return null;
    }
  },

  login: async () => {
    const client = auth0Client || await authService.init();
    if (!client) {
      console.error("Login aborted: Auth0 client failed to initialize.");
      return;
    }
    await client.loginWithRedirect();
  },

  logout: async () => {
    const client = auth0Client || await authService.init();
    if (!client) return;
    await client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  },

  getUser: async () => {
    const client = auth0Client || await authService.init();
    return await client?.getUser();
  },

  isAuthenticated: async () => {
    const client = auth0Client || await authService.init();
    if (!client) return false;
    
    const authenticated = await client.isAuthenticated();
    if (!authenticated) return false;

    const user = await client.getUser();
    
    // Admin access check: Email match for Ranbeer Raja
    const roles = user?.['https://ranbeerraja.com/roles'] || [];
    const isAdmin = roles.includes('admin') || user?.email === 'ranbeerraja1@gmail.com';
    
    return isAdmin;
  }
};
