import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const missingVars: string[] = [];
  
  if (!process.env.MONGODB_URI) missingVars.push('MONGODB_URI');
  if (!process.env.NEXTAUTH_SECRET) missingVars.push('NEXTAUTH_SECRET');
  if (!process.env.GOOGLE_CLIENT_ID) missingVars.push('GOOGLE_CLIENT_ID');
  if (!process.env.GOOGLE_CLIENT_SECRET) missingVars.push('GOOGLE_CLIENT_SECRET');
  if (!process.env.NEXTAUTH_URL) missingVars.push('NEXTAUTH_URL');

  const errorMessage = missingVars.length > 0
    ? `Missing environment variables: ${missingVars.join(', ')}. Please add these in Vercel Settings → Environment Variables.`
    : 'Authentication error. Please check server logs.';

  return NextResponse.json(
    {
      error: 'Configuration Error',
      message: errorMessage,
      missingVariables: missingVars,
    },
    { status: 500 }
  );
}

