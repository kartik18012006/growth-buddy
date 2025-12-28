// Optimized session check - non-blocking
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

let sessionCache: { session: any; timestamp: number } | null = null;
const CACHE_TTL = 5 * 1000; // 5 seconds cache

export async function getCachedSession() {
  const now = Date.now();
  
  // Return cached session if still valid
  if (sessionCache && (now - sessionCache.timestamp) < CACHE_TTL) {
    return sessionCache.session;
  }
  
  // Fetch fresh session
  try {
    const session = await getServerSession(authOptions);
    sessionCache = {
      session,
      timestamp: now,
    };
    return session;
  } catch (error) {
    // Return cached session if fetch fails
    if (sessionCache) {
      return sessionCache.session;
    }
    return null;
  }
}

