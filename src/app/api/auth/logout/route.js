import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'aethera_session',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0 // Immediately expires the cookie
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Logout handler error', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
