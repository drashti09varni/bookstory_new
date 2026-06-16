'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import styles from './ReaderSettings.module.css';

export default function ReaderSettings() {
  const { readerSettings, updateReaderSettings } = useApp();

  const handleThemeChange = (themeName) => {
    updateReaderSettings({ theme: themeName });
  };

  const handleFontChange = (fontFamily) => {
    updateReaderSettings({ fontFamily });
  };

  const changeFontSize = (delta) => {
    const newSize = Math.max(14, Math.min(32, readerSettings.fontSize + delta));
    updateReaderSettings({ fontSize: newSize });
  };

  return (
    <div className={styles.settingsPanel}>
      {/* Theme Toggles */}
      <div className={styles.section}>
        <span className={styles.label}>Theme</span>
        <div className={styles.optionsRow}>
          <button 
            onClick={() => handleThemeChange('light')}
            className={`${styles.themeBtn} ${styles.themeBtnLight} ${readerSettings.theme === 'light' ? styles.activeTheme : ''}`}
            title="Light Theme"
            aria-label="Light reading theme"
          />
          <button 
            onClick={() => handleThemeChange('sepia')}
            className={`${styles.themeBtn} ${styles.themeBtnSepia} ${readerSettings.theme === 'sepia' ? styles.activeTheme : ''}`}
            title="Sepia Theme"
            aria-label="Sepia reading theme"
          />
          <button 
            onClick={() => handleThemeChange('dark')}
            className={`${styles.themeBtn} ${styles.themeBtnDark} ${readerSettings.theme === 'dark' ? styles.activeTheme : ''}`}
            title="Dark Theme"
            aria-label="Dark reading theme"
          />
        </div>
      </div>

      {/* Font Family Toggles */}
      <div className={styles.section}>
        <span className={styles.label}>Font Style</span>
        <div className={styles.optionsRow}>
          <button
            onClick={() => handleFontChange('serif')}
            className={`${styles.fontBtn} ${readerSettings.fontFamily === 'serif' ? styles.activeFontBtn : ''}`}
            style={{ fontFamily: 'var(--font-merriweather), serif' }}
          >
            Serif
          </button>
          <button
            onClick={() => handleFontChange('sans-serif')}
            className={`${styles.fontBtn} ${readerSettings.fontFamily === 'sans-serif' ? styles.activeFontBtn : ''}`}
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Sans-serif
          </button>
        </div>
      </div>

      {/* Font Size Adjustments */}
      <div className={styles.section}>
        <span className={styles.label}>Font Size</span>
        <div className={styles.fontSizeControl}>
          <button 
            onClick={() => changeFontSize(-2)} 
            className={styles.sizeBtn}
            disabled={readerSettings.fontSize <= 14}
            title="Decrease font size"
            aria-label="Decrease font size"
          >
            A-
          </button>
          <span className={styles.sizeValue}>{readerSettings.fontSize}px</span>
          <button 
            onClick={() => changeFontSize(2)} 
            className={styles.sizeBtn}
            disabled={readerSettings.fontSize >= 32}
            title="Increase font size"
            aria-label="Increase font size"
          >
            A+
          </button>
        </div>
      </div>
    </div>
  );
}
