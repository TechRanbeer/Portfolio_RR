
/**
 * Safe environment variable accessor.
 * Checks process.env, import.meta.env, and window.env.
 */
export const getEnv = (key: string): string | undefined => {
  try {
    // Check process.env (Node/Webpack/CommonJS)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
    // Check import.meta.env (Vite/ESM)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
    // Check window (Browser Global)
    if (typeof window !== 'undefined' && (window as any)._env_ && (window as any)._env_[key]) {
      return (window as any)._env_[key];
    }
  } catch (e) {
    // Fail silently
  }
  return undefined;
};
