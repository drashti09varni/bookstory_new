'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { books } from '@/data/books';
import BookCard from '@/components/BookCard';
import RankedBookRow from '@/components/RankedBookRow';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const { searchQuery } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Limit carousel to the first 5 stories
  const carouselBooks = books.slice(0, 5);

  // Auto-rotate carousel slides every 6 seconds
  useEffect(() => {
    if (searchQuery) return; // disable rotation on search
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselBooks.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [searchQuery, carouselBooks.length]);

  // Filtering books by global search query
  const filteredBooks = books.filter(book => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query)
    );
  });

  // Hottest shows ranked (arbitrary order)
  const rankedBooks = [...books].sort((a, b) => b.rating - a.rating);

  // If search query is active, show only filtered search results
  if (searchQuery.trim() !== '') {
    return (
      <div className={styles.container}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Search Results for "{searchQuery}"</h2>
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
              <h3>No results found</h3>
              <p>We couldn't find any stories matching your query. Try a different term.</p>
            </div>
          )}
        </section>
      </div>
    );
  }

  // Active Carousel Book
  const featuredBook = carouselBooks[currentSlide];
  
  // Custom metadata tags for featured slides
  const featuredTags = {
    'whispering-canopy': ['High Fantasy', 'Ancient Magic', 'Adventure'],
    'echoes-neon': ['Cyberpunk', 'Secret Identity', 'Dystopian'],
    'clockwork-cryptid': ['Steampunk', 'Mechanical Beast', 'Mystery'],
  }[featuredBook?.id] || ['Original', 'Story'];

  return (
    <div className={styles.container}>
      {/* Featured Cinematic Carousel */}
      <section className={styles.carousel}>
        {featuredBook && (
          <div className={styles.carouselSlide} key={featuredBook.id}>
            
            <div className={styles.carouselLeft}>
              <div className={styles.carouselTags}>
                {featuredTags.map((tag, idx) => (
                  <span key={idx} className={styles.carouselTag}>{tag}</span>
                ))}
              </div>
              <h1 className={styles.carouselTitle}>{featuredBook.title}</h1>
              
              <Link href={`/book/${featuredBook.id}`} className={styles.carouselBtn}>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Read Story</span>
              </Link>
            </div>

            <div className={styles.carouselRight}>
              <img 
                src={featuredBook.coverUrl} 
                alt={featuredBook.title} 
                className={styles.carouselImg}
              />
            </div>

          </div>
        )}

        {/* Carousel Navigation Dots */}
        <div className={styles.carouselDots}>
          {carouselBooks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`${styles.dot} ${currentSlide === idx ? styles.activeDot : ''}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Ranked Row List: Hottest Shows */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Hottest Shows</h2>
        </div>
        <div className={styles.rankedGrid}>
          {rankedBooks.map((book, idx) => (
            <RankedBookRow key={book.id} book={book} rank={idx + 1} />
          ))}
        </div>
      </section>

      {/* Grid List: Popular Originals */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Popular Originals</h2>
        </div>
        <div className={styles.originalsGrid}>
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}
