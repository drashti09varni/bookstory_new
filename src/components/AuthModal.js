'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import styles from './AuthModal.module.css';

export default function AuthModal() {
  const { isCheckoutOpen, closeCheckout, signUp, logIn, checkUsername, user, purchaseSubscription } = useApp();

  const [activeTab, setActiveTab] = useState('signup'); // 'login' | 'signup' | 'checkout'
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | processing | success

  // Sign up fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUsernameEdited, setIsUsernameEdited] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState('idle'); // idle | available | taken | invalid

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Checkout fields
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutRedirectUrl, setCheckoutRedirectUrl] = useState('');

  // UPI checkout screens state
  const [upiScreenData, setUpiScreenData] = useState(null); // null | { paymentUrl, qrUrl, mandateId }
  const [waitingInfo, setWaitingInfo] = useState(null); // null | { mandateId }
  const [paymentPopup, setPaymentPopup] = useState(null); // null | 'success' | 'failed'

  const modalRef = useRef();

  // Reset state on open/close
  useEffect(() => {
    if (!isCheckoutOpen) {
      setName('');
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setLoginIdentifier('');
      setLoginPassword('');
      setCheckoutPhone('');
      setCheckoutName('');
      setCheckoutRedirectUrl('');
      setUpiScreenData(null);
      setWaitingInfo(null);
      setPaymentPopup(null);
      setErrors({});
      setIsUsernameEdited(false);
      setUsernameStatus('idle');
      setStatus('idle');
    }
  }, [isCheckoutOpen]);

  // Route to checkout if user is already logged in but not subscribed
  useEffect(() => {
    if (isCheckoutOpen) {
      if (user) {
        setActiveTab('checkout');

        // Clean default name if it contains an email address
        let defaultName = user.name || '';
        if (defaultName.includes('@')) {
          if (user.username) {
            defaultName = user.username.charAt(0).toUpperCase() + user.username.slice(1);
          } else {
            const prefix = defaultName.split('@')[0];
            defaultName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
          }
        }
        setCheckoutName(defaultName);
      } else {
        setActiveTab('signup');
        setCheckoutName('');
      }
      setCheckoutPhone('');
    }
  }, [isCheckoutOpen, user]);

  // UPI App mandate selection handler
  const handleUpiSelect = (appId) => {
    if (!upiScreenData) return;

    const qrUrl = upiScreenData.qrUrl;
    const upiParams = qrUrl && qrUrl.includes('?') ? qrUrl.split('?')[1] : '';

    let targetUrl = '';

    if (upiParams) {
      if (appId === 'gpay') {
        targetUrl = `tez://upi/mandate?${upiParams}`;
      } else if (appId === 'phonepe') {
        targetUrl = `phonepe://mandate?${upiParams}`;
      } else if (appId === 'paytm') {
        targetUrl = `paytmmp://mandate?${upiParams}`;
      } else if (appId === 'bhim') {
        targetUrl = `bhim://mandate?${upiParams}`;
      } else if (appId === 'amazonpay') {
        targetUrl = `amazonpay://mandate?${upiParams}`;
      } else if (appId === 'other') {
        targetUrl = `upi://mandate?${upiParams}`;
      } else {
        targetUrl = upiScreenData.paymentUrl;
      }
    } else {
      // Fallback to checkout URL if QR is not present
      targetUrl = upiScreenData.paymentUrl;
    }

    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
      window.open(targetUrl, '_blank');
    } else {
      window.location.href = targetUrl;
    }

    setWaitingInfo({ mandateId: upiScreenData.mandateId });
    setUpiScreenData(null);
  };

  // Polling payment status
  useEffect(() => {
    if (!waitingInfo) return;

    const startedAt = Date.now();
    const TIMEOUT_MS = 3 * 60 * 1000; // 3 mins timeout
    let paused = false;

    const checkStatus = async () => {
      if (paused) return;

      if (Date.now() - startedAt > TIMEOUT_MS) {
        setWaitingInfo(null);
        setPaymentPopup('failed');
        return;
      }

      try {
        const r = await fetch(`/api/subscription/check-status?mandateId=${waitingInfo.mandateId}`);
        if (!r.ok) return;
        const data = await r.json();
        const gs = data.gatewayStatus || '';

        if (gs === 'ACTIVE' || gs === 'ACTIVATED') {
          setWaitingInfo(null);
          setPaymentPopup('success');
        } else if (['REVOKED', 'FAILED', 'CANCELLED'].includes(gs)) {
          setWaitingInfo(null);
          setPaymentPopup('failed');
        }
      } catch (err) {
        console.warn('[poll] fetch error:', err.message);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        paused = true;
      } else {
        paused = false;
        checkStatus();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [waitingInfo]);

  // Real-time username check logic (calls server API with debounce)
  const usernameTimerRef = useRef(null);
  const checkUsernameAvailability = (uname) => {
    const cleanUname = uname.trim().toLowerCase();
    if (cleanUname.length < 3) {
      setUsernameStatus('invalid');
      return;
    }
    setUsernameStatus('checking');
    if (usernameTimerRef.current) clearTimeout(usernameTimerRef.current);
    usernameTimerRef.current = setTimeout(async () => {
      const res = await checkUsername(cleanUname);
      if (res.available) {
        setUsernameStatus('available');
      } else {
        setUsernameStatus('taken');
      }
    }, 400);
  };

  // Handle email change & auto-generate username
  const handleEmailChange = (e) => {
    const emailVal = e.target.value;
    setEmail(emailVal);

    if (errors.email) {
      setErrors(prev => ({ ...prev, email: null }));
    }

    // Auto-generate username only if user hasn't edited it manually
    if (!isUsernameEdited) {
      const emailPrefix = emailVal.split('@')[0];
      const autogenUname = emailPrefix.toLowerCase().replace(/[^a-z0-9_.]/g, '');
      setUsername(autogenUname);
      if (autogenUname) {
        checkUsernameAvailability(autogenUname);
      } else {
        setUsernameStatus('idle');
      }
    }
  };

  // Handle manual username change
  const handleUsernameChange = (e) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '');
    setUsername(val);
    setIsUsernameEdited(true); // Stop auto-generation once they type manually

    if (errors.username) {
      setErrors(prev => ({ ...prev, username: null }));
    }

    if (val) {
      checkUsernameAvailability(val);
    } else {
      setUsernameStatus('idle');
    }
  };

  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target) && status === 'idle') {
      closeCheckout();
    }
  };

  // Close modal on Escape press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCheckoutOpen && status === 'idle') {
        closeCheckout();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCheckoutOpen, status]);

  if (!isCheckoutOpen) return null;

  // ── Choose UPI App Screen ──
  if (upiScreenData) {
    const upiApps = [
      {
        id: 'gpay',
        name: 'Google Pay',
        logo: (
          <svg viewBox="0 0 24 24" width="28" height="28" style={{ marginRight: '16px' }}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
        )
      },
      {
        id: 'phonepe',
        name: 'PhonePe',
        logo: (
          <svg viewBox="0 0 40 40" width="28" height="28" style={{ marginRight: '16px', borderRadius: '8px' }}>
            <rect width="40" height="40" rx="8" fill="#5f259f" />
            <path d="M16 11h8v3h-8v10h-3v-10h-3V11h3V8h3v3zm-3 15h9v2h-9v-2z" fill="#fff" />
            <path d="M26 15c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-2v3h-3v-9h5zm-2 3h2v-1h-2v1z" fill="#fff" />
          </svg>
        )
      },
      {
        id: 'paytm',
        name: 'Paytm',
        logo: (
          <span style={{ marginRight: '16px', fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '15px' }}>
            <span style={{ color: '#00d2ff' }}>Pay</span>
            <span style={{ color: '#00baf2' }}>tm</span>
          </span>
        )
      },
      {
        id: 'bhim',
        name: 'BHIM UPI',
        logo: (
          <span style={{ marginRight: '16px', fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '12px', color: '#ffffff', background: 'linear-gradient(90deg, #e95f2b, #8cc63f)', padding: '2px 6px', borderRadius: '4px' }}>
            BHIM
          </span>
        )
      },
      {
        id: 'other',
        name: 'Other UPI Apps',
        logo: (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#00d2ff" strokeWidth="2.5" style={{ marginRight: '16px' }}>
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <path d="M12 18h.01" strokeLinecap="round" />
            <path d="M9 6h6M9 10h6M9 14h3" strokeLinecap="round" />
          </svg>
        )
      }
    ];

    return (
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.upiModal} ref={modalRef}>
          <div className={styles.upiHeader}>
            <button className={styles.upiBackButton} onClick={() => { setUpiScreenData(null); setStatus('idle'); }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div className={styles.upiTitleInfo}>
              <h3 className={styles.upiTitle}>Choose UPI App</h3>
              <p className={styles.upiSubtitle}>Ready · tap any app to pay instantly</p>
            </div>
          </div>

          <div className={styles.upiPromoCard}>
            <div className={styles.upiPromoLeft}>
              <h3 className={styles.upiPromoTitle}>Daily Access Pass</h3>
              <p className={styles.upiPromoDesc}>Try for ₹1 today · then ₹299/day recurring</p>
            </div>
            <div className={styles.upiPromoRight}>
              <span className={styles.upiOriginalPrice}>₹399</span>
              <span className={styles.upiFinalPrice}>₹1</span>
              <span className={styles.upiDiscountBadge}>TRIAL</span>
            </div>
          </div>

          <h4 className={styles.upiSectionLabel}>Select App to Pay</h4>
          <div className={styles.upiAppsList}>
            {upiApps.map((app) => (
              <div
                key={app.id}
                className={styles.upiAppItem}
                onClick={() => handleUpiSelect(app.id)}
              >
                <div className={styles.upiAppLeft}>
                  {app.logo}
                  <span className={styles.upiAppName}>{app.name}</span>
                </div>
                <svg className={styles.upiChevron} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ))}
          </div>

          <p className={styles.upiFooter}>
            Secured Mandate Simulation • 256-bit SSL
          </p>
        </div>
      </div>
    );
  }

  // ── Waiting for Payment Screen ──
  if (waitingInfo) {
    return (
      <div className={styles.overlay}>
        <div className={styles.upiModal} style={{ textAlign: 'center', padding: '3rem 2rem', maxWidth: '400px' }}>
          <div className={styles.spinner} style={{ margin: '0 auto 1.75rem', width: '48px', height: '48px' }} />

          <h2 className={styles.title} style={{ marginBottom: '0.75rem' }}>
            Waiting for Payment…
          </h2>

          <p className={styles.subtitle} style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Please complete the mandate authorization in your selected UPI app. Once authorized, this page will update automatically.
          </p>

          <button
            onClick={() => {
              setWaitingInfo(null);
              setPaymentPopup('failed');
            }}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              color: '#64748b',
              fontSize: '0.85rem',
              padding: '0.6rem 1.5rem',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Cancel Payment
          </button>
        </div>
      </div>
    );
  }

  // ── Payment Status Popup ──
  if (paymentPopup) {
    return (
      <div className={styles.overlay}>
        <div className={styles.upiModal} style={{ textAlign: 'center', padding: '2.5rem 2rem', maxWidth: '380px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 1.5rem',
            background: paymentPopup === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            border: `2px solid ${paymentPopup === 'success' ? 'var(--success)' : 'var(--error)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem'
          }}>
            {paymentPopup === 'success' ? '✓' : '✗'}
          </div>

          <h2 className={styles.title} style={{ marginBottom: '0.75rem' }}>
            {paymentPopup === 'success' ? 'Payment Successful!' : 'Payment Failed'}
          </h2>
          <p className={styles.subtitle} style={{ marginBottom: '2rem', lineHeight: '1.5' }}>
            {paymentPopup === 'success'
              ? 'Your subscription mandate has been authorized. Welcome to Aethera Stories!'
              : 'Your payment could not be completed. Please try again.'}
          </p>

          <button
            onClick={() => {
              setPaymentPopup(null);
              if (paymentPopup === 'success') {
                closeCheckout();
              }
            }}
            className={`${styles.submitBtn} glow-btn`}
            style={{
              width: '100%',
              background: paymentPopup === 'success'
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            }}
          >
            {paymentPopup === 'success' ? 'Start Reading' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  // Sign up Form Validation
  const validateSignUp = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Full Name is required.';
    else if (name.includes('@')) newErrors.name = 'Full Name cannot be an email address.';


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = 'Please enter a valid email address.';

    if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters.';
    } else if (usernameStatus === 'taken') {
      newErrors.username = 'Username is already taken.';
    }

    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Login Form Validation
  const validateLogin = () => {
    const newErrors = {};
    if (!loginIdentifier.trim()) newErrors.loginIdentifier = 'Username or Email is required.';
    if (!loginPassword) newErrors.loginPassword = 'Password is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignUp()) return;

    setStatus('processing');

    // Small delay for UX animation
    await new Promise(r => setTimeout(r, 800));
    const res = await signUp(name, email, username, password);
    if (res.success) {
      // Auto transition to checkout view
      setActiveTab('checkout');
      setStatus('idle');
    } else {
      setStatus('idle');
      setErrors({ submit: res.error });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setStatus('processing');

    // Small delay for UX animation
    await new Promise(r => setTimeout(r, 800));
    const res = await logIn(loginIdentifier, loginPassword);
    if (res.success) {
      // If user is already subscribed, proceed to success/close
      if (res.user && res.user.isSubscribed) {
        setStatus('success');
        setTimeout(() => {
          closeCheckout();
        }, 1500);
      } else {
        // Go to checkout tab to purchase pass
        setActiveTab('checkout');
        setStatus('idle');
      }
    } else {
      setStatus('idle');
      setErrors({ loginSubmit: res.error });
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!checkoutName.trim()) {
      newErrors.checkoutName = 'Customer Name is required.';
    } else if (checkoutName.includes('@')) {
      newErrors.checkoutName = 'Please enter a valid customer name, not an email address.';
    }

    const cleanPhone = checkoutPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      newErrors.checkoutPhone = 'Please enter a valid 10-digit mobile number.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus('processing');

    // Simulate payment gateway API delay
    await new Promise(r => setTimeout(r, 1200));
    const res = await purchaseSubscription(cleanPhone, checkoutName);
    if (res.success) {
      setUpiScreenData({
        paymentUrl: res.paymentUrl,
        qrUrl: res.qrUrl,
        mandateId: res.mandateId
      });
      setStatus('idle');
    } else {
      setStatus('idle');
      setErrors({ checkoutSubmit: res.error });
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} ref={modalRef}>

        {status === 'idle' && (
          <button onClick={closeCheckout} className={styles.closeBtn} aria-label="Close modal">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        {status === 'processing' && (
          <div className={styles.processingOverlay}>
            <div className={styles.loaderContainer}>
              <div className={styles.glowingRing} />
              <div className={styles.innerRing} />
              <div className={styles.loaderCenterIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <h3 className={styles.loadingTitle}>
              {activeTab === 'checkout' ? 'Contacting Bank Gateway...' : activeTab === 'signup' ? 'Creating Account...' : 'Authenticating...'}
            </h3>
            <p className={styles.loadingSubtitle}>
              {activeTab === 'checkout'
                ? 'Securing connection and initiating Auto-Pay Mandate...'
                : 'Setting up your private reader lounge'}
            </p>
            {activeTab === 'checkout' && (
              <div className={styles.loadingSteps}>
                <div className={styles.loadingStepActive}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>Secured SSL Connection</span>
                </div>
                <div className={styles.loadingStepActive}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>Contacting RocketPay Gateway</span>
                </div>
                <div className={styles.loadingStepPending}>
                  <span>⚡ Initiating UPI Auto-Pay...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className={styles.processingOverlay}>
            <div className={styles.successIcon}>
              {checkoutRedirectUrl ? (
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              ) : (
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </div>
            <h3 className={styles.successTitle}>
              {activeTab === 'checkout'
                ? (checkoutRedirectUrl ? 'Redirecting to Payment...' : 'Payment Successful!')
                : 'Login Successful!'}
            </h3>
            <p className={styles.loadingSubtitle}>
              {activeTab === 'checkout'
                ? (checkoutRedirectUrl ? 'Redirecting to RocketPay mandate authorization...' : 'Lifetime Access Pass unlocked. Happy reading!')
                : 'All stories unlocked. Happy reading!'}
            </p>
          </div>
        )}

        {/* Header Tabs */}
        {status === 'idle' && activeTab !== 'checkout' && (
          <div className={styles.tabsContainer}>
            <button
              onClick={() => { setActiveTab('signup'); setErrors({}); }}
              className={`${styles.tabBtn} ${activeTab === 'signup' ? styles.activeTab : ''}`}
            >
              Sign Up
            </button>
            <button
              onClick={() => { setActiveTab('login'); setErrors({}); }}
              className={`${styles.tabBtn} ${activeTab === 'login' ? styles.activeTab : ''}`}
            >
              Log In
            </button>
          </div>
        )}

        {/* FORM WORKSPACE */}
        {status === 'idle' && activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className={styles.form}>
            <div className={styles.headerText}>
              <h2 className={styles.title}>Join Aethera</h2>
              <p className={styles.subtitle}>Sign up to instantly read all 80 premium Hinglish stories</p>
            </div>

            {errors.submit && <div className={styles.alertError}>{errors.submit}</div>}

            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                placeholder="Aarav Sharma"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: null })); }}
                className={styles.input}
                required
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="aarav@email.com"
                name="email"
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
                className={styles.input}
                required
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.formGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className={styles.label}>Username</label>
                {/* Real-time Availability Badge */}
                {username.trim().length > 0 && (
                  <span className={`${styles.badge} ${usernameStatus === 'available' ? styles.badgeSuccess :
                    usernameStatus === 'taken' ? styles.badgeError : styles.badgeMuted
                    }`}>
                    {usernameStatus === 'checking' && '⏳ Checking...'}
                    {usernameStatus === 'available' && '✓ Username is available'}
                    {usernameStatus === 'taken' && '❌ Username is already taken'}
                    {usernameStatus === 'invalid' && '⚠️ Min 3 chars required'}
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="aarav_sharma"
                name="username"
                autoComplete="username"
                value={username}
                onChange={handleUsernameChange}
                className={styles.input}
                required
              />
              {errors.username && <span className={styles.errorText}>{errors.username}</span>}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  placeholder="••••••"
                  name="new-password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(prev => ({ ...prev, password: null })); }}
                  className={styles.input}
                  required
                />
                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
              </div>

              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label className={styles.label}>Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••"
                  name="confirm-password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: null })); }}
                  className={styles.input}
                  required
                />
                {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
              </div>
            </div>

            <button
              type="submit"
              className={`${styles.submitBtn} glow-btn`}
              disabled={usernameStatus === 'taken'}
            >
              Sign Up & Unlock Stories
            </button>
          </form>
        )}

        {status === 'idle' && activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className={styles.form}>
            <div className={styles.headerText}>
              <h2 className={styles.title}>Welcome Back</h2>
              <p className={styles.subtitle}>Enter your login credentials to resume reading</p>
            </div>

            {errors.loginSubmit && <div className={styles.alertError}>{errors.loginSubmit}</div>}

            <div className={styles.formGroup}>
              <label className={styles.label}>Username or Email</label>
              <input
                type="text"
                placeholder="admin or admin@aethera.com"
                name="username"
                autoComplete="username"
                value={loginIdentifier}
                onChange={(e) => { setLoginIdentifier(e.target.value); if (errors.loginIdentifier) setErrors(prev => ({ ...prev, loginIdentifier: null })); }}
                className={styles.input}
                required
              />
              {errors.loginIdentifier && <span className={styles.errorText}>{errors.loginIdentifier}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                placeholder="••••••"
                name="password"
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => { setLoginPassword(e.target.value); if (errors.loginPassword) setErrors(prev => ({ ...prev, loginPassword: null })); }}
                className={styles.input}
                required
              />
              {errors.loginPassword && <span className={styles.errorText}>{errors.loginPassword}</span>}
            </div>

            <div className={styles.helperTip}>
              💡 Demo credentials: <strong>admin</strong> / <strong>password123</strong>
            </div>

            <button type="submit" className={`${styles.submitBtn} glow-btn`}>
              Log In & Open Library
            </button>
          </form>
        )}

        {status === 'idle' && activeTab === 'checkout' && (
          user?.isSubscribed ? (
            <div className={styles.form} style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div className={styles.successIcon} style={{ margin: '0 auto 1.5rem', backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--success)' }}>
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className={styles.title}>Access Pass Active</h2>
              <p className={styles.subtitle} style={{ marginBottom: '2rem' }}>
                Your account (@{user?.username}) already has active premium access. You can read any book in our library!
              </p>
              <button type="button" onClick={closeCheckout} className={`${styles.submitBtn} glow-btn`}>
                Back to Reading
              </button>
            </div>
          ) : (
            <form onSubmit={handleCheckoutSubmit} className={styles.form}>
              <div className={styles.headerText}>
                <h2 className={styles.title}>Unlock Access Pass</h2>
                <p className={styles.subtitle}>Try with ₹1 for one day, then daily ₹299 charge. Cancel subscription anytime.</p>
              </div>

              {errors.checkoutSubmit && <div className={styles.alertError}>{errors.checkoutSubmit}</div>}

              {/* Form Input fields for customer details */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Customer Name</label>
                <input
                  type="text"
                  placeholder="Khushal v4"
                  name="customer-name"
                  autoComplete="name"
                  value={checkoutName}
                  onChange={(e) => { setCheckoutName(e.target.value); if (errors.checkoutName) setErrors(prev => ({ ...prev, checkoutName: null })); }}
                  className={styles.input}
                  required
                />
                {errors.checkoutName && <span className={styles.errorText}>{errors.checkoutName}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Mobile Number</label>
                <div className={styles.phoneInputWrapper}>
                  <span className={styles.phonePrefix}>+91</span>
                  <input
                    type="tel"
                    placeholder="8980606760"
                    maxLength={10}
                    name="phone"
                    autoComplete="tel"
                    value={checkoutPhone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setCheckoutPhone(val);
                      if (errors.checkoutPhone) setErrors(prev => ({ ...prev, checkoutPhone: null }));
                    }}
                    className={styles.phoneInput}
                    required
                  />
                </div>
                {errors.checkoutPhone && <span className={styles.errorText}>{errors.checkoutPhone}</span>}
              </div>

              <div className={styles.checkoutBox}>
                <div className={styles.checkoutPlan}>
                  <div className={styles.planName}>Daily Access Subscription</div>
                  <div className={styles.planPrice}>₹1 <span className={styles.planPeriod}>today, then ₹299/day</span></div>
                </div>
                <ul className={styles.checkoutFeatures}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <svg width="14" height="14" fill="none" stroke="var(--success)" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Read all 80 premium Hinglish stories</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <svg width="14" height="14" fill="none" stroke="var(--success)" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Sync reading progress across devices</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <svg width="14" height="14" fill="none" stroke="var(--success)" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>No ads, cancel subscription anytime</span>
                  </li>
                </ul>
              </div>

              <div className={styles.checkoutUserTip}>
                Active account: <strong>@{user?.username}</strong>
              </div>

              <button type="submit" className={`${styles.submitBtn} glow-btn`}>
                Try with ₹1 Pay
              </button>
              <p className={styles.termsNote}>
                This is a temporary payment demo. Clicking will instantly call the database to update your subscription status.
              </p>
            </form>
          )
        )}
      </div>
    </div>
  );
}
