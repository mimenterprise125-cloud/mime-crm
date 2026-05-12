/**
 * Safe async utilities to prevent infinite loading states
 * and ensure requests don't hang indefinitely
 */

/**
 * Wraps an async function with timeout protection
 * @param promise - The async operation (Promise)
 * @param timeoutMs - Timeout in milliseconds (default: 10000)
 * @param errorMessage - Custom error message
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 10000,
  errorMessage: string = "Operation timed out"
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}

/**
 * Wraps async function with retry logic
 * @param asyncFn - The async function to execute
 * @param maxRetries - Maximum number of retries
 * @param delayMs - Delay between retries in milliseconds
 */
export async function withRetry<T>(
  asyncFn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await asyncFn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError || new Error("Max retries exceeded");
}

/**
 * Combines timeout and retry protection
 * @param asyncFn - The async function to execute
 * @param options - Configuration options
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  options: {
    timeoutMs?: number;
    maxRetries?: number;
    retryDelayMs?: number;
    onTimeout?: () => void;
    onError?: (error: Error) => void;
  } = {}
): Promise<T> {
  const {
    timeoutMs = 10000,
    maxRetries = 2,
    retryDelayMs = 500,
    onTimeout,
    onError,
  } = options;

  try {
    return await withRetry(
      () => withTimeout(asyncFn(), timeoutMs, "Async operation timed out"),
      maxRetries,
      retryDelayMs
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("timed out")) {
      onTimeout?.();
    }
    onError?.(error as Error);
    throw error;
  }
}

/**
 * Ensures loading state never gets stuck
 * Used in components to force completion after max time
 */
export function createLoadingGuard(
  setLoading: (loading: boolean) => void,
  maxTimeMs: number = 15000
) {
  const timeoutId = setTimeout(() => {
    console.warn(`Loading guard triggered - forcing loading state to false after ${maxTimeMs}ms`);
    setLoading(false);
  }, maxTimeMs);

  return () => clearTimeout(timeoutId);
}

/**
 * Safe fetch wrapper with timeout and retry
 */
export async function safeFetch(
  url: string,
  options: RequestInit & { timeoutMs?: number } = {}
): Promise<Response> {
  const { timeoutMs = 10000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...fetchOptions, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
