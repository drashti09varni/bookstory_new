'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { books } from '@/data/books';
import Link from 'next/link';
import styles from './page.module.css';

export default function Library() {
  const { isSubscribed, readingProgress, openCheckout, isHydrated } = useApp();

  if (!isHydrated) {
    return (
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--border-color)',
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

  // Gate for Unsubscribed Users
  if (!isSubscribed) {
    return (
      <div className={styles.container}>
        <div className={styles.lockedContainer}>
          <div className={styles.lockWrapper}>
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className={styles.title}>Unlock Your Private Library</h2>
          <p className={styles.lockedText}>
            You need an active Access Pass to view your library dashboard, track reading progress, and read full stories. Start today for just ₹1.
          </p>
          <button onClick={openCheckout} className={`${styles.primaryBtn} glow-btn`} style={{ padding: '0.8rem 2rem', fontSize: '0.95rem' }}>
            Get Access Pass — Try for ₹1
          </button>
        </div>
      </div>
    );
  }

  // Gather Books with Active Reading Progress
  const progressEntries = Object.entries(readingProgress);
  const activeBooks = progressEntries
    .map(([id, progress]) => {
      const bookData = books.find(b => b.id === id);
      if (!bookData) return null;
      return {
        ...bookData,
        ...progress
      };
    })
    .filter(Boolean)
    // Sort by latest read
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const completedBooksCount = activeBooks.filter(b => b.scrollPercent >= 98).length;
  const inProgressBooksCount = activeBooks.length - completedBooksCount;

  // Gather Suggested Books (Books that haven't been started yet)
  const startedIds = activeBooks.map(b => b.id);
  const unstartedBooks = books.filter(b => !startedIds.includes(b.id));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Library</h1>
      </header>

      {/* Reading Statistics Cards */}
      <section className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className={styles.statDetails}>
            <span className={styles.statValue}>{books.length}</span>
            <span className={styles.statLabel}>Available Books</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: 'var(--accent-secondary)', backgroundColor: 'rgba(236,72,153,0.1)' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
          </div>
          <div className={styles.statDetails}>
            <span className={styles.statValue}>{inProgressBooksCount}</span>
            <span className={styles.statLabel}>In Progress</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: 'var(--success)', backgroundColor: 'rgba(16,185,129,0.1)' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
          </div>
          <div className={styles.statDetails}>
            <span className={styles.statValue}>{completedBooksCount}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
        </div>
      </section>

      {/* Recently Read / Active List */}
      <section>
        <h2 className={styles.sectionTitle}>Recently Read</h2>
        {activeBooks.length > 0 ? (
          <div className={styles.libraryList}>
            {activeBooks.map(book => {
              const currentChapterData = book.chapters[book.lastChapter] || book.chapters[0];
              const scrollPercentRounded = Math.round(book.scrollPercent);
              
              return (
                <div key={book.id} className={styles.progressRow}>
                  <div className={styles.miniCover}>
                    <img src={book.coverUrl} alt={book.title} className={styles.miniCoverImg} />
                  </div>
                  
                  <div className={styles.progressInfo}>
                    <div className={styles.progressMeta}>
                      <span>{book.genre}</span>
                      <span>•</span>
                      <span>By {book.author}</span>
                    </div>
                    <h3 className={styles.progressTitle}>{book.title}</h3>
                    
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Currently on: <strong style={{ color: 'var(--text-primary)' }}>{currentChapterData?.title}</strong>
                    </span>

                    <div className={styles.progressBarContainer}>
                      <div className={styles.progressBarOuter}>
                        <div 
                          className={styles.progressBarInner} 
                          style={{ width: `${scrollPercentRounded}%` }}
                        />
                      </div>
                      <span className={styles.progressPercent}>{scrollPercentRounded}%</span>
                    </div>
                  </div>

                  <div className={styles.progressAction}>
                    <Link href={`/read/${book.id}`} className={styles.primaryBtn}>
                      <span>Resume Reading</span>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.lockedContainer} style={{ background: 'var(--bg-secondary)', borderStyle: 'dashed' }}>
            <h3 style={{ fontWeight: '700' }}>Your dashboard is ready</h3>
            <p className={styles.lockedText}>
              You haven't started reading any stories yet. Pick one of our available books below to start tracking your reading journey!
            </p>
          </div>
        )}
      </section>

      {/* Suggested Reads / Unstarted Books */}
      {unstartedBooks.length > 0 && (
        <section style={{ marginTop: '1rem' }}>
          <h2 className={styles.sectionTitle}>
            {activeBooks.length > 0 ? 'Suggested Reads' : 'Explore Available Books'}
          </h2>
          <div className={styles.libraryList}>
            {unstartedBooks.map(book => (
              <div key={book.id} className={styles.progressRow}>
                <div className={styles.miniCover}>
                  <img src={book.coverUrl} alt={book.title} className={styles.miniCoverImg} />
                </div>
                
                <div className={styles.progressInfo}>
                  <div className={styles.progressMeta}>
                    <span>{book.genre}</span>
                    <span>•</span>
                    <span>By {book.author}</span>
                  </div>
                  <h3 className={styles.progressTitle}>{book.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxContent: '80%', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {book.description}
                  </p>
                </div>

                <div className={styles.progressAction}>
                  <Link href={`/read/${book.id}`} className={styles.primaryBtn}>
                    <span>Start Reading</span>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
