'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [readingProgress, setReadingProgress] = useState({});
  const [uiTheme, setUiTheme] = useState('dark');
  const [readerSettings, setReaderSettings] = useState({
    theme: 'sepia',
    fontSize: 18,
    fontFamily: 'serif',
  });
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); // Controls AuthModal open/close
  const [searchQuery, setSearchQuery] = useState('');

  // Load session + local preferences on mount
  useEffect(() => {
    async function init() {
      try {
        // Load local-only preferences from localStorage
        const storedProgress = localStorage.getItem('bookstory_progress');
        const storedUiTheme = localStorage.getItem('bookstory_ui_theme') || 'dark';
        const storedReaderSettings = localStorage.getItem('bookstory_reader_settings');

        if (storedProgress) {
          setReadingProgress(JSON.parse(storedProgress));
        }
        setUiTheme(storedUiTheme);
        document.documentElement.setAttribute('data-ui-theme', storedUiTheme);

        if (storedReaderSettings) {
          setReaderSettings(JSON.parse(storedReaderSettings));
        }

        // Restore session from server-side HTTP-only cookie
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          
          // Fetch server-side progress for this authenticated user
          try {
            const progressRes = await fetch('/api/progress');
            if (progressRes.ok) {
              const progressData = await progressRes.json();
              if (progressData.success && progressData.progress) {
                setReadingProgress(progressData.progress);
                localStorage.setItem('bookstory_progress', JSON.stringify(progressData.progress));
              }
            }
          } catch (pe) {
            console.error('Error fetching progress on mount', pe);
          }
        }
      } catch (e) {
        console.error('Error during app initialization', e);
      }
      setIsHydrated(true);
    }
    init();
  }, []);

  // Sign Up — calls the server API
  const signUp = async (name, email, username, password) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Signup failed' };
      }
      setUser(data.user);
      setReadingProgress({});
      localStorage.setItem('bookstory_progress', '{}');
      return { success: true };
    } catch (e) {
      console.error('Signup error', e);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Log In — calls the server API
  const logIn = async (identifier, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setUser(data.user);
      
      // Fetch user's server-side progress
      try {
        const progressRes = await fetch('/api/progress');
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          if (progressData.success && progressData.progress) {
            setReadingProgress(progressData.progress);
            localStorage.setItem('bookstory_progress', JSON.stringify(progressData.progress));
          }
        }
      } catch (pe) {
        console.error('Error fetching progress on login', pe);
      }
      
      return { success: true };
    } catch (e) {
      console.error('Login error', e);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Log Out — calls the server API
  const logOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error', e);
    }
    setUser(null);
    setReadingProgress({});
    localStorage.removeItem('bookstory_progress');
  };

  // Check username availability — calls the server API
  const checkUsername = async (username) => {
    if (!username || username.length < 3) {
      return { available: false };
    }
    try {
      const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
      return await res.json();
    } catch (e) {
      console.error('Check username error', e);
      return { available: false, error: 'Network error' };
    }
  };

  // Update reading progress (optimistic client-side + server-side sync)
  const updateProgress = async (bookId, chapterIndex, scrollPercent) => {
    // 1. Optimistic local state update
    setReadingProgress((prev) => {
      const updated = {
        ...prev,
        [bookId]: {
          lastChapter: chapterIndex,
          scrollPercent: scrollPercent,
          updatedAt: new Date().toISOString(),
        },
      };
      localStorage.setItem('bookstory_progress', JSON.stringify(updated));
      return updated;
    });

    // 2. Server-side persistence if logged in
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, lastChapter: chapterIndex, scrollPercent }),
      });
    } catch (e) {
      console.error('Error syncing reading progress to server', e);
    }
  };

  // Toggle UI Theme (Light/Dark)
  const toggleUiTheme = () => {
    const newTheme = uiTheme === 'dark' ? 'light' : 'dark';
    setUiTheme(newTheme);
    localStorage.setItem('bookstory_ui_theme', newTheme);
    document.documentElement.setAttribute('data-ui-theme', newTheme);
  };

  // Update Reader Settings
  const updateReaderSettings = (settings) => {
    setReaderSettings((prev) => {
      const updated = { ...prev, ...settings };
      localStorage.setItem('bookstory_reader_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const purchaseSubscription = async (mobileNumber, name) => {
    try {
      const res = await fetch('/api/subscription/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Purchase failed' };
      }
      setUser(data.user);
      return { 
        success: true, 
        paymentUrl: data.paymentUrl, 
        qrUrl: data.qrUrl, 
        mandateId: data.mandateId, 
        mocked: data.mocked,
        user: data.user
      };
    } catch (e) {
      console.error('Subscription purchase error', e);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const openCheckout = () => setIsCheckoutOpen(true);
  const closeCheckout = () => setIsCheckoutOpen(false);

  return (
    <AppContext.Provider
      value={{
        isSubscribed: user !== null && !!user.isSubscribed,
        user,
        signUp,
        logIn,
        logOut,
        checkUsername,
        purchaseSubscription,
        readingProgress,
        updateProgress,
        uiTheme,
        toggleUiTheme,
        readerSettings,
        updateReaderSettings,
        isHydrated,
        isCheckoutOpen, // Keeping variable names to prevent breaking routes
        openCheckout,
        closeCheckout,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
