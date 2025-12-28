/**
 * Error Utilities
 */

import { ApiError } from '../api/client';

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 401 || error.status === 403;
  }

  return false;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 0;
  }

  return false;
}

/**
 * Handle API errors with user feedback
 */
export function handleApiError(error: unknown): {
  message: string;
  status: number;
  isAuthError: boolean;
  isNetworkError: boolean;
} {
  const message = getErrorMessage(error);
  const status = error instanceof ApiError ? error.status : 0;
  const authError = isAuthError(error);
  const networkError = isNetworkError(error);

  return {
    message,
    status,
    isAuthError: authError,
    isNetworkError: networkError,
  };
}


