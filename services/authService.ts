
import { createAuth0Client, Auth0Client, User } from '@auth0/auth0-spa-js';
import { getEnv } from './env';

let auth0Client: Auth0Client | null = null;
const ROLE_NAMESPACE = 'https://ranbeerraja.com/roles';

export const authService = {
  isConfigured: () => {
    return !!getEnv('VITE_AUTH0_DOMAIN') && !!getEnv('VITE_AUTH0_CLIENT_ID');
  },

  init: async () => {
    const domain = getEnv('VITE_AUTH0_DOMAIN');
    const clientId = getEnv('VITE_AUTH0_CLIENT_ID');

    if (!domain || !clientId) {
      console.error("Auth0 configuration is missing. Admin features disabled.");
      return null;
    }

    try {
      if (!auth0Client) {
        auth0Client = await createAuth0Client({
          domain,
          clientId,
          authorizationParams: {
            redirect_uri: window.location.origin,
            scope: 'openid profile email'
          },
          cacheLocation: 'localstorage',
          useRefreshTokens: true
        });
      }

      const query = window.location.search;
      if (query.includes("code=") && query.includes("state=")) {
        await auth0Client.handleRedirectCallback();
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, document.title, url.toString());
      }

      return auth0Client;
    } catch (error) {
      console.error("Auth0 Initialization failed:", error);
      return null;
    }
  },

  login: async () => {
    if (!authService.isConfigured()) {
      alert("Authentication system is not configured for this deployment.");
      return;
    }
    const client = auth0Client || await authService.init();
    if (!client) return;
    await client.loginWithRedirect();
  },

  logout: async () => {
    const client = auth0Client || await authService.init();
    if (!client) {
      window.location.href = window.location.origin;
      return;
    }
    await client.logout({
      logoutParams: { returnTo: window.location.origin }
    });
  },

  getUser: async (): Promise<User | undefined> => {
    const client = auth0Client || await authService.init();
    return await client?.getUser();
  },

  isAuthenticated: async (): Promise<boolean> => {
    const client = auth0Client || await authService.init();
    if (!client) return false;
    return await client.isAuthenticated();
  },

  isAdmin: async (): Promise<boolean> => {
    const client = auth0Client || await authService.init();
    if (!client) return false;
    
    const authenticated = await client.isAuthenticated();
    if (!authenticated) return false;

    const claims = await client.getIdTokenClaims();
    const roles = (claims?.[ROLE_NAMESPACE] as string[]) || [];
    
    return roles.includes('admin');
  }
};
