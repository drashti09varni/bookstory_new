'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { books } from '@/data/books';
import BookCard from '@/components/BookCard';
import styles from './page.module.css';

export default function Originals() {
  const { searchQuery } = useApp();

  // Filter books by global search query
  const filteredBooks = books.filter(book => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query)
    );
  });

  return (
    <div className={styles.container}>
      <section className={styles.section} style={{ marginTop: '1rem' }}>
        <div className={styles.sectionHeader}>
          <h1 className={styles.sectionTitle} style={{ fontSize: '1.8rem' }}>Originals</h1>
        </div>
        
        {filteredBooks.length > 0 ? (
          <div className={styles.originalsGrid}>
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3>No originals found</h3>
            <p>We couldn't find any books matching your search query.</p>
          </div>
        )}
      </section>
    </div>
  );
}
