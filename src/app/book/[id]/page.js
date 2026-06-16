'use client';

import React, { useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { books } from '@/data/books';
import Link from 'next/link';
import styles from './page.module.css';

export default function BookDetail({ params }) {
  const resolvedParams = React.use(params);
  const bookId = resolvedParams.id;
  const book = books.find(b => b.id === bookId);

  const { isSubscribed, openCheckout, isHydrated, readingProgress } = useApp();
  const previewRef = useRef(null);

  if (!book) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <h2>Story Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>
          The book you are looking for does not exist in our library.
        </p>
        <Link href="/" className={styles.primaryBtn} style={{ display: 'inline-flex', width: 'auto' }}>
          Back to Discover
        </Link>
      </div>
    );
  }

  const scrollToPreview = () => {
    if (previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get preview paragraphs (first chapter, first 2 paragraphs)
  const previewChapter = book.chapters[0];
  const previewParagraphs = previewChapter ? previewChapter.content.slice(0, 2) : [];

  // Reading progress variables
  const progress = readingProgress?.[bookId];
  const bookProgress = progress ? Math.min(100, Math.max(0, Math.round(((progress.lastChapter + (progress.scrollPercent / 100)) / book.chapters.length) * 100))) : 0;
  const currentChapter = progress ? (book.chapters[progress.lastChapter] || book.chapters[0]) : null;
  const chapterCleanTitle = currentChapter?.title?.split(':')[1]?.trim() || currentChapter?.title || (progress ? `Chapter ${progress.lastChapter + 1}` : '');

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backBtn}>
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back to Discover</span>
      </Link>

      <section className={styles.detailsHeader}>
        <div className={styles.coverWrapper}>
          <img src={book.coverUrl} alt={`${book.title} cover`} className={styles.coverImage} />
        </div>

        <div className={styles.info}>
          <div className={styles.metaRow}>
            <span className={styles.genreBadge}>{book.genre}</span>
            <div className={styles.rating}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{book.rating} / 5.0</span>
            </div>
          </div>

          <h1 className={styles.title}>{book.title}</h1>
          <p className={styles.author}>Written by {book.author}</p>
          
          <div className={styles.priceBadge}>
            <span style={{ marginRight: '4px', fontWeight: 'bold', fontSize: '1.1rem' }}>₹</span>
            <span>Try with ₹1 for one day</span>
          </div>

          <p className={styles.synopsis}>{book.description}</p>

          {isHydrated && isSubscribed && progress && (
            <div className={styles.progressCard}>
              <div className={styles.progressCardHeader}>
                <span className={styles.progressCardLabel}>Your Reading Progress</span>
                <span className={styles.progressCardPercent}>{bookProgress}%</span>
              </div>
              <div className={styles.progressCardBarOuter}>
                <div className={styles.progressCardBarInner} style={{ width: `${bookProgress}%` }} />
              </div>
              <div className={styles.progressCardFooter}>
                <span>On Chapter {progress.lastChapter + 1}: {chapterCleanTitle}</span>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            {isHydrated && isSubscribed ? (
              <Link href={`/read/${book.id}`} className={`${styles.primaryBtn} glow-btn`}>
                <span>{bookProgress > 0 ? `Resume Reading (${bookProgress}%)` : 'Start Reading'}</span>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <>
                <button onClick={openCheckout} className={`${styles.primaryBtn} glow-btn`}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Unlock Library — Try for ₹1</span>
                </button>
                <button onClick={scrollToPreview} className={styles.secondaryBtn}>
                  Read Free Preview
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Free Preview Section */}
      <section className={styles.previewSection} ref={previewRef}>
        <h2 className={styles.previewTitle}>Free Preview</h2>
        
        <div className={styles.previewCard}>
          <div className={styles.previewContent}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>{previewChapter?.title}</h3>
            
            {previewParagraphs.map((para, idx) => (
              <p key={idx} style={{ marginBottom: '1.25rem' }}>{para}</p>
            ))}

            {isHydrated && !isSubscribed && (
              <div className={styles.previewBlur}>
                <p className={styles.previewLockedText}>
                  Subscribe to unlock the rest of this chapter and all remaining stories.
                </p>
                <button onClick={openCheckout} className={`${styles.primaryBtn} glow-btn`}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Unlock Lifetime Access</span>
                </button>
              </div>
            )}

            {isHydrated && isSubscribed && previewChapter && (
              <>
                {previewChapter.content.slice(2).map((para, idx) => (
                  <p key={idx} style={{ marginBottom: '1.25rem' }}>{para}</p>
                ))}
                <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                  <Link href={`/read/${book.id}`} className={styles.primaryBtn} style={{ display: 'inline-flex' }}>
                    <span>Open in Story Reader</span>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
