'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import styles from './RankedBookRow.module.css';

export default function RankedBookRow({ book, rank }) {
  const { isSubscribed, isHydrated } = useApp();

  // Define some high-fidelity mock tag metrics if not in data
  const fallbackTags = {
    'whispering-canopy': ['Sacrifice', 'Mistaken Identity'],
    'echoes-neon': ['Secret Identity', 'Coming of Age'],
    'clockwork-cryptid': ['Mystery', 'Love Triangle'],
  };

  const tags = book.tags || fallbackTags[book.id] || ['Original', 'Story'];

  // High-fidelity views metrics
  const viewsCount = {
    'whispering-canopy': '91,939',
    'echoes-neon': '8,945,654',
    'clockwork-cryptid': '2,271,202',
  }[book.id] || '104,500';

  return (
    <Link href={`/book/${book.id}`} className={styles.row}>
      <div className={styles.coverContainer}>
        <img 
          src={book.coverUrl} 
          alt={`${book.title} cover`} 
          className={styles.coverImg}
          loading="lazy"
        />
        <div className={styles.rankNumber}>{rank}</div>
      </div>

      <div className={styles.details}>
        <div className={styles.metaHeader}>
          {isHydrated && !isSubscribed && (
            <span className={styles.lockIcon} title="Premium Required">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
          )}
          
          <div className={styles.viewCount}>
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
              <path d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            </svg>
            <span>{viewsCount}</span>
          </div>
        </div>

        <h3 className={styles.title}>{book.title}</h3>
        
        <div className={styles.tagsRow}>
          {tags.map((tag, idx) => (
            <span key={idx} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
