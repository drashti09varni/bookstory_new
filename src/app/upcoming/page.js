'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import styles from './page.module.css';

export default function Upcoming() {
  const { searchQuery } = useApp();
  const [reminders, setReminders] = useState({});

  // Mock upcoming books list
  const upcomingBooks = [
    {
      id: "chrono-cartographer",
      title: "The Chrono-Cartographer",
      author: "V. E. Thorne",
      genre: "Sci-Fi",
      releaseDate: "July 15, 2026",
      coverUrl: "/covers/whispering-canopy.png",
      description: "A mapmaker in Victorian London discovers a way to draw pathways into the future, but realizes someone is erasing the maps from the other side.",
      interestedCount: "12.4K interested"
    },
    {
      id: "songs-deepwood",
      title: "Songs of the Deepwood",
      author: "Lara Finch",
      genre: "Fantasy",
      releaseDate: "August 3, 2026",
      coverUrl: "/covers/clockwork-cryptid.png",
      description: "A bard searches for her sister in a forest where singing the wrong note can rewrite your memories.",
      interestedCount: "8.5K interested"
    }
  ];

  const handleReminderToggle = (id) => {
    setReminders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter books by global search query
  const filteredUpcoming = upcomingBooks.filter(book => {
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
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h1 className={styles.sectionTitle}>Coming Soon</h1>
        </div>
        
        {filteredUpcoming.length > 0 ? (
          <div className={styles.rankedGrid}>
            {filteredUpcoming.map(book => {
              const isReminderSet = reminders[book.id];
              return (
                <div key={book.id} className={styles.upcomingRow}>
                  {/* Image cover with coming soon overlay */}
                  <div className={styles.coverWrapper}>
                    <img 
                      src={book.coverUrl} 
                      alt={book.title} 
                      className={styles.coverImg} 
                    />
                    <div className={styles.comingSoonOverlay}>
                      🔒 Coming<br/>Soon
                    </div>
                  </div>

                  <div className={styles.infoWrapper}>
                    <div className={styles.metaRow}>
                      <span className={styles.releaseDate}>
                        📅 Releases {book.releaseDate}
                      </span>
                      <span className={styles.interestedCount}>
                        {book.interestedCount}
                      </span>
                    </div>

                    <h3 className={styles.title}>
                      {book.title}
                    </h3>
                    <p className={styles.description}>
                      {book.description}
                    </p>

                    <button 
                      onClick={() => handleReminderToggle(book.id)}
                      className={`${styles.reminderBtn} ${isReminderSet ? styles.reminderActive : ''}`}
                    >
                      {isReminderSet ? (
                        <>
                          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 22a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22zm7-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C8.63 5.36 7 7.92 7 11v5l-2 2v1h14v-1l-2-2z" />
                          </svg>
                          <span>Reminder Set!</span>
                        </>
                      ) : (
                        <>
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M12 22a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22zm7-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C8.63 5.36 7 7.92 7 11v5l-2 2v1h14v-1l-2-2z" />
                          </svg>
                          <span>Set Reminder</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3>No upcoming stories found</h3>
            <p>We couldn't find any upcoming stories matching your search query.</p>
          </div>
        )}
      </section>
    </div>
  );
}
