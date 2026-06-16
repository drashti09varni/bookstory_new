'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import styles from './BookCard.module.css';

export default function BookCard({ book }) {
  const { isSubscribed, isHydrated } = useApp();

  // High-fidelity fallback tags matching Kuku TV
  const fallbackTags = {
    'whispering-canopy': ['Revenge Plot', 'Mistaken Idea'],
    'echoes-neon': ['Secret Identity', 'Coming of Age'],
    'clockwork-cryptid': ['Sacrifice', 'Mistaken Identity'],
  };

  const tags = book.tags || fallbackTags[book.id] || ['Original', 'Story'];

  // High-fidelity views metrics
  const viewsCount = {
    'whispering-canopy': '82.1K',
    'echoes-neon': '172.9K',
    'clockwork-cryptid': '145.3K',
  }[book.id] || '50K';

  return (
    <Link href={`/book/${book.id}`} className={styles.card}>
      <div className={styles.coverWrapper}>
        <img 
          src={book.coverUrl} 
          alt={`${book.title} cover`} 
          className={styles.coverImage}
          loading="lazy"
        />
        
        {/* Golden Diamond Emblem for Premium */}
        {isHydrated && !isSubscribed && (
          <div className={styles.premiumBadge} title="Premium Access">
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        )}

        {/* Play count overlay (Bottom-Right) */}
        <div className={styles.viewsOverlay}>
          <svg width="9" height="9" fill="currentColor" viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '1px' }}>
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>{viewsCount}</span>
        </div>
      </div>

      <div className={styles.details}>
        <h3 className={styles.title}>{book.title}</h3>
        <div className={styles.tagsRow}>
          {tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
