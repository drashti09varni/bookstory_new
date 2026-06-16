import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserByUsername } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('aethera_session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ user: null });
    }

    const sessionData = JSON.parse(sessionCookie.value);
    const dbUser = findUserByUsername(sessionData.username);

    if (!dbUser) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        name: dbUser.name,
        email: dbUser.email,
        username: dbUser.username,
        isSubscribed: !!dbUser.isSubscribed
      }
    });
  } catch (e) {
    console.error('Session check error', e);
    return NextResponse.json({ user: null });
  }
}

