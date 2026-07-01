const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface RetryOpts {
  intentos?: number;
  /** Espera base entre intentos; crece linealmente (espera * intento). */
  esperaMs?: number;
}

/**
 * Ejecuta `fn` reintentando ante error. Devuelve el resultado del primer
 * intento con éxito o lanza el último error si se agotan los intentos.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOpts = {},
): Promise<T> {
  const intentos = opts.intentos ?? 3;
  const esperaMs = opts.esperaMs ?? 400;
  let ultimoError: unknown;

  for (let i = 0; i < intentos; i++) {
    try {
      return await fn();
    } catch (e) {
      ultimoError = e;
      if (i < intentos - 1 && esperaMs > 0) await sleep(esperaMs * (i + 1));
    }
  }
  throw ultimoError;
}
