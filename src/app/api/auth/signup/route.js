import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserByUsername, findUserByEmail, saveUser } from '@/lib/db';

export async function POST(request) {
  try {
    const { name, email, username, password } = await request.json();

    if (!name || !email || !username || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (name.includes('@')) {
      return NextResponse.json({ error: 'Full Name cannot be an email address' }, { status: 400 });
    }

    if (username.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check duplicate username
    const existingUser = findUserByUsername(username);
    if (existingUser) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
    }

    // Check duplicate email
    const existingEmail = findUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
    }

    // Save user to local file database
    const savedUser = saveUser({ name, email, username, password });

    // Set HTTP-Only Session Cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'aethera_session',
      value: JSON.stringify({ username: savedUser.username, email: savedUser.email, name: savedUser.name }),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return NextResponse.json({
      success: true,
      user: {
        name: savedUser.name,
        email: savedUser.email,
        username: savedUser.username,
        isSubscribed: false
      }
    });

  } catch (e) {
    console.error("Signup handler error", e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
