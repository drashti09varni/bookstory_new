import { NextResponse } from 'next/server';
import { findUserByUsername } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username || username.length < 3) {
      return NextResponse.json({ available: false, error: 'Username must be at least 3 characters' });
    }

    const existing = findUserByUsername(username);
    return NextResponse.json({ available: !existing });
  } catch (e) {
    console.error('Check username error', e);
    return NextResponse.json({ available: false, error: 'Server error' }, { status: 500 });
  }
}
