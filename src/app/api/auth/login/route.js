import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserByUsername, findUserByEmail, verifyPassword } from '@/lib/db';

export async function POST(request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Username/email and password are required' }, { status: 400 });
    }

    // Find user by username or email
    let foundUser = findUserByUsername(identifier);
    if (!foundUser) {
      foundUser = findUserByEmail(identifier);
    }

    if (!foundUser) {
      return NextResponse.json({ error: 'Invalid username/email or password' }, { status: 401 });
    }

    // Verify hashed password
    const isValid = verifyPassword(password, foundUser.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid username/email or password' }, { status: 401 });
    }

    // Set HTTP-Only session cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'aethera_session',
      value: JSON.stringify({ username: foundUser.username, email: foundUser.email, name: foundUser.name }),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return NextResponse.json({
      success: true,
      user: {
        name: foundUser.name,
        email: foundUser.email,
        username: foundUser.username,
        isSubscribed: !!foundUser.isSubscribed
      }
    });

  } catch (e) {
    console.error('Login handler error', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
