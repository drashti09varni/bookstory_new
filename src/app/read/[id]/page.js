'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { books } from '@/data/books';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReaderSettings from '@/components/ReaderSettings';
import styles from './page.module.css';

export default function Reader({ params }) {
  const resolvedParams = React.use(params);
  const bookId = resolvedParams.id;
  const book = books.find(b => b.id === bookId);
  const router = useRouter();

  const { isSubscribed, readingProgress, updateProgress, readerSettings, isHydrated } = useApp();
  
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [scrollRestored, setScrollRestored] = useState(false);
  
  const scrollContainerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Security Gate: Redirect to details page if not subscribed
  useEffect(() => {
    if (isHydrated && !isSubscribed) {
      router.replace(`/book/${bookId}`);
    }
  }, [isHydrated, isSubscribed, bookId, router]);

  // Load initial chapter index from progress history
  useEffect(() => {
    if (isHydrated && readingProgress[bookId]) {
      const savedChapter = readingProgress[bookId].lastChapter || 0;
      if (book && savedChapter >= 0 && savedChapter < book.chapters.length) {
        setCurrentChapterIdx(savedChapter);
      }
    }
  }, [isHydrated, bookId, book]);

  // Restore scroll position when chapter is loaded
  useEffect(() => {
    if (isHydrated && !scrollRestored && scrollContainerRef.current) {
      const savedProgress = readingProgress[bookId];
      if (savedProgress && savedProgress.lastChapter === currentChapterIdx) {
        const savedPercent = savedProgress.scrollPercent || 0;
        
        // Wait for rendering to complete so layout height is accurate
        const timer = setTimeout(() => {
          const container = scrollContainerRef.current;
          if (container) {
            const scrollHeight = container.scrollHeight - container.clientHeight;
            container.scrollTop = (savedPercent / 100) * scrollHeight;
            setScrollPercent(savedPercent);
            setScrollRestored(true);
          }
        }, 150);
        return () => clearTimeout(timer);
      } else {
        // If no progress matches this chapter, consider restoration done (start at top)
        setScrollRestored(true);
      }
    }
  }, [isHydrated, currentChapterIdx, bookId, scrollRestored]);

  // Scroll to top when changing chapters
  const handleChapterChange = (index) => {
    if (index >= 0 && index < book.chapters.length) {
      setCurrentChapterIdx(index);
      setScrollPercent(0);
      setScrollRestored(false); // trigger scroll restore or top scroll
      
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      
      // Update progress immediately to bookmark the new chapter
      updateProgress(bookId, index, 0);
    }
  };

  // Track and Save Scroll Progress
  const handleScroll = (e) => {
    if (!scrollRestored) return; // avoid saving temporary positions during load
    
    const container = e.target;
    const scrollableHeight = container.scrollHeight - container.clientHeight;
    
    if (scrollableHeight <= 0) return;
    
    const currentPercent = (container.scrollTop / scrollableHeight) * 100;
    setScrollPercent(currentPercent);

    // Throttle writing progress to context (localStorage) to optimize performance
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      updateProgress(bookId, currentChapterIdx, currentPercent);
    }, 400);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  if (!isHydrated || !isSubscribed || !book) {
    return (
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#070a13' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(255,255,255,0.08)',
          borderTopColor: 'var(--accent-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style jsx>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const currentChapter = book.chapters[currentChapterIdx];
  const isFirstChapter = currentChapterIdx === 0;
  const isLastChapter = currentChapterIdx === book.chapters.length - 1;

  // Resolve theme CSS variables based on active reader settings
  const readerThemeClass = `reader-theme-${readerSettings.theme}`;
  const fontFamilyValue = readerSettings.fontFamily === 'serif' ? 'var(--font-merriweather), serif' : 'var(--font-inter), sans-serif';

  return (
    <div className={`${styles.readerWrapper} ${readerThemeClass}`}>
      {/* Top Navigation & Settings Header */}
      <div className={styles.topBar}>
        {/* Progress bar at the bottom of the sticky header */}
        <div 
          className={styles.progressIndicatorBar} 
          style={{ width: `${scrollPercent}%` }}
        />

        <Link href={`/book/${book.id}`} className={styles.backBtn}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Exit Reader</span>
        </Link>

        <span className={styles.chapterTitle}>
          {currentChapterIdx + 1} of {book.chapters.length} : {currentChapter?.title.split(':')[1]?.trim() || currentChapter?.title}
        </span>

        <button 
          onClick={() => setShowSettings(!showSettings)} 
          className={`${styles.settingsToggle} ${showSettings ? styles.activeSettings : ''}`}
          title="Reader Customization"
          aria-label="Format reader"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 3v18M3 12h18" />
            <circle cx="12" cy="7" r="3" fill="var(--reader-bg)" />
            <circle cx="12" cy="17" r="3" fill="var(--reader-bg)" />
          </svg>
        </button>
      </div>

      {/* Settings Tray */}
      {showSettings && (
        <div className={styles.settingsContainer}>
          <ReaderSettings />
        </div>
      )}

      {/* Main Scrollable Reading Area */}
      <div 
        className={styles.scrollContainer} 
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        <article 
          className={styles.storyContent}
          style={{ 
            fontFamily: fontFamilyValue, 
            fontSize: `${readerSettings.fontSize}px` 
          }}
        >
          <header className={styles.titleHeader}>
            <div className={styles.bookTitle}>{book.title}</div>
            <h1 className={styles.chapterHeading}>{currentChapter?.title}</h1>
            <div style={{ width: '60px', height: '2px', background: 'var(--accent-primary)', margin: '1.5rem auto 0', borderRadius: '1px' }} />
          </header>

          {currentChapter?.content.map((para, idx) => (
            <p key={idx} className={styles.paragraph}>{para}</p>
          ))}
        </article>
      </div>

      {/* Bottom Footer Navigation */}
      <div className={styles.footer}>
        <button 
          onClick={() => handleChapterChange(currentChapterIdx - 1)}
          disabled={isFirstChapter}
          className={styles.navBtn}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous Chapter</span>
        </button>

        {isLastChapter ? (
          <Link href="/library" className={styles.navBtn} style={{ borderColor: 'var(--success)', color: 'var(--success)' }}>
            <span>Complete Story</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
          </Link>
        ) : (
          <button 
            onClick={() => handleChapterChange(currentChapterIdx + 1)}
            className={styles.navBtn}
          >
            <span>Next Chapter</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
