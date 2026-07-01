import Link from 'next/link';
import styles from '../terms/policy.module.css';

export default function ContactPage() {
  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className={styles.container}>
        <Link className={styles.backBtn} href="/">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back to Discover</span>
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>Contact Us</h1>
          <span className={styles.lastUpdated}>We're here to help</span>
        </header>

        <div className={styles.card}>
          <div className={styles.section}>
            <p className={styles.text}>
              Welcome to <strong>THANVI ENTERPRISE</strong>. If you have any questions,
              concerns, subscription issues, payment-related queries, or technical
              problems while using Streamvibe, our support team is ready to assist you.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Customer Support</h2>
            <p className={styles.text}>You can contact us regarding:</p>

            <ul className={styles.list}>
              <li>Account Login & Registration Issues</li>
              <li>Subscription & Billing Support</li>
              <li>Payment & Refund Queries</li>
              <li>Story Access Problems</li>
              <li>Technical Errors & Website Support</li>
              <li>General Feedback & Suggestions</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Business Information</h2>

            <ul className={styles.list}>
              <li>
                <strong>Company Name:</strong> THANVI ENTERPRISE
              </li>

              <li>
                <strong>Website:</strong>{' '}
                <a
                  href="https://www.aethera.space"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  https://www.aethera.space
                </a>
              </li>

              <li>
                <strong>Support Email:</strong>{' '}
                <a href="mailto:womenswear001@gmail.com" className={styles.link}>
                 womenswear001@gmail.com
                </a>
              </li>

              <li>
                <strong>Mobile:</strong>{' '}
                <a href="tel:9879898223" className={styles.link}>
                  9879898223
                </a>
              </li>

              {/* <li>
                <strong>Address:</strong> Floor No.: GROUND FLOOR, Flat No.: 84,
                RAJMANDIR ROW HOUSE, YOGI CHOWK, Om Krishna Dairy Farm,
                Punagam, Surat - 395010
              </li> */}
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Support Hours</h2>

            <ul className={styles.list}>
              <li>Monday – Saturday</li>
              <li>10:00 AM – 7:00 PM (IST)</li>
              <li>Response Time: Within 24 Hours</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Need Immediate Help?</h2>

            <p className={styles.text}>
              For urgent account or subscription issues, please email us at
              <strong>womenswear001@gmail.com </strong>
              or call <strong>9879898223</strong> and include your registered email
              address for faster assistance.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}