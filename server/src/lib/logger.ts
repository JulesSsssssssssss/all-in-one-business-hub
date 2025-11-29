export function createLogger(module: string) {
  return {
    info: (message: string, data?: unknown) => {
      console.log(`[${module}] ℹ️ ${message}`, data ?? '');
    },
    error: (message: string, error?: unknown) => {
      console.error(`[${module}] ❌ ${message}`, error ?? '');
    },
    warn: (message: string, data?: unknown) => {
      console.warn(`[${module}] ⚠️ ${message}`, data ?? '');
    },
    debug: (message: string, data?: unknown) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[${module}] 🐛 ${message}`, data ?? '');
      }
    },
  };
}
