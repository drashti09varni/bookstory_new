import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserProgress, updateUserProgress } from '@/lib/db';

// Helper to authenticate the session
async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('aethera_session');
    
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }
    
    return JSON.parse(sessionCookie.value);
  } catch (e) {
    console.error('Session authentication error inside progress API:', e);
    return null;
  }
}

// GET /api/progress - Retrieve user's reading progress
export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const progress = getUserProgress(sessionUser.username);
    return NextResponse.json({ success: true, progress });
  } catch (e) {
    console.error('GET progress error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/progress - Update user's reading progress
export async function POST(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { bookId, lastChapter, scrollPercent } = body;
    
    // Input Validation
    if (typeof bookId !== 'string' || !bookId.trim()) {
      return NextResponse.json({ error: 'Invalid book ID' }, { status: 400 });
    }
    
    const lastChapterInt = parseInt(lastChapter, 10);
    if (isNaN(lastChapterInt) || lastChapterInt < 0) {
      return NextResponse.json({ error: 'Invalid chapter index' }, { status: 400 });
    }
    
    const scrollPercentFloat = parseFloat(scrollPercent);
    if (isNaN(scrollPercentFloat) || scrollPercentFloat < 0 || scrollPercentFloat > 100) {
      return NextResponse.json({ error: 'Invalid scroll percentage' }, { status: 400 });
    }
    
    const updatedProgress = updateUserProgress(
      sessionUser.username,
      bookId,
      lastChapterInt,
      scrollPercentFloat
    );
    
    return NextResponse.json({ success: true, progress: updatedProgress });
  } catch (e) {
    console.error('POST progress error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
