'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { books } from '@/data/books';
import styles from './Navbar.module.css';


export default function Navbar() {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery, isSubscribed, isHydrated, openCheckout, user, logOut, readingProgress } = useApp();

  // Calculate average progress of started books
  const startedBooksProgress = Object.entries(readingProgress || {}).map(([id, progress]) => {
    const book = books.find(b => b.id === id);
    if (!book) return 0;
    return Math.min(100, Math.max(0, ((progress.lastChapter + (progress.scrollPercent / 100)) / book.chapters.length) * 100));
  }).filter(p => p > 0); // Only started books (greater than 0%)

  const averageProgress = startedBooksProgress.length > 0
    ? Math.round(startedBooksProgress.reduce((sum, p) => sum + p, 0) / startedBooksProgress.length)
    : 0;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };


  const navLinks = [
    { name: 'Popular', path: '/' },
    { name: 'Originals', path: '/originals' },
    { name: 'New & Hot', path: '/new-and-hot' },
    { name: 'Upcoming', path: '/upcoming' }
  ];

  return (
    <header className={styles.navbarContainer}>
      {/* Top Gold Promo Banner */}
      {isHydrated && !isSubscribed && (
        <div className={styles.promoBanner}>
          <span>
            🏆 <strong>Subscribe now</strong> to unlock all premium Hinglish stories! <strong>Try for ₹1 today</strong>
          </span>
          <button onClick={openCheckout} className={styles.promoBtn}>
            Subscribe for ₹299 per month
          </button>
        </div>
      )}

      {/* Main Branding & Search Bar Row */}
      <div className={styles.mainBar}>
        <div className={styles.leftSection}>
          <Link href="/" className={styles.brandLogo}>
            <div className={styles.logoBadge}>
              a<span className={styles.logoBadgeDot}>.</span>
            </div>
            <span className={styles.brandName}>Aethera</span>
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className={styles.navLinksDesktop}>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.path}
                className={`${styles.navLink} ${pathname === link.path ? styles.activeNavLink : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center Search Input */}
        <div className={styles.searchSection}>
          <svg className={styles.searchIcon} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input 
            type="text" 
            placeholder="Search by title, genre, author..." 
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          <button className={styles.langSelector} aria-label="Select language">
            <span>English</span>
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5H7z" />
            </svg>
          </button>

          {/* Red Grid Icon Button */}
          <button className={styles.gridIconBtn} title="Originals Categories" aria-label="View Categories">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>

          {isHydrated && (
            isSubscribed ? (
              <div className={styles.userSection}>
                <span className={styles.userNameBadge} title={`Logged in as ${user?.name}`}>
                  @{user?.username}
                </span>
                <Link href="/library" className={styles.loginBtn} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>My Library</span>
                  {averageProgress > 0 && (
                    <span 
                      className={styles.progressBadge} 
                      title={`Average progress: ${averageProgress}% across ${startedBooksProgress.length} ${startedBooksProgress.length === 1 ? 'book' : 'books'}`}
                    >
                      {averageProgress}%
                    </span>
                  )}
                </Link>
                <button onClick={logOut} className={styles.logoutBtn}>
                  Logout
                </button>
              </div>

            ) : (
              <button onClick={openCheckout} className={styles.loginBtn}>
                Login / Sign Up
              </button>
            )
          )}
        </div>
      </div>

      {/* Mobile Tabs Row */}
      <nav className={styles.mobileTabsBar}>
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.path}
            className={`${styles.navLink} ${pathname === link.path ? styles.activeNavLink : ''}`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
