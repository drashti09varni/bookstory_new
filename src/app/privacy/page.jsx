import Link from 'next/link';
import styles from '../terms/policy.module.css';

export default function PrivacyPage() {
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
          <h1 className={styles.title}>Privacy Policy</h1>
          <span className={styles.lastUpdated}>Effective Date: June 8, 2026</span>
        </header>

        <div className={styles.card}>
          <div className={styles.section}>
            <p className={styles.text}>
              <strong>THANVI ENTERPRISE</strong> values your privacy and is committed to
              protecting your personal information. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you visit our
              website, purchase our e-novels, subscribe to our automated payment services,
              or engage with our platform.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
            <p className={styles.text}>We may collect and process the following types of information:</p>
            <ul className={styles.list}>
              <li>
                <strong>Personal Information:</strong> Your name, email address, phone number,
                billing address, and account login credentials.
              </li>
              <li>
                <strong>Payment and Autopay Data:</strong> To facilitate e-novel purchases
                and recurring subscriptions via Autopay, payment details are processed
                securely by our payment gateway partners.
                <br />
                <span className={styles.note}>
                  <em>
                    Note: We do not store raw card, banking, UPI, or mandate credentials
                    on our servers.
                  </em>
                </span>
              </li>
              <li>
                <strong>Subscription Preferences:</strong> Your e-novel genres, reading
                history, wishlists, and active subscription details.
              </li>
              <li>
                <strong>Usage Data:</strong> IP address, browser type, device information,
                pages visited, reading progress, and date/time of visits.
              </li>
              <li>
                <strong>Cookies:</strong> Standard tracking technologies to improve browsing
                and reading experience.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
            <p className={styles.text}>We use your information for the following purposes:</p>
            <ul className={styles.list}>
              <li>
                <strong>To Deliver E-Novels &amp; Manage Subscriptions:</strong> To process
                purchases, grant access, and manage your account.
              </li>
              <li>
                <strong>To Process Autopay Payments:</strong> To process recurring subscription
                fees based on the mandate and frequency authorized by you.
              </li>
              <li>
                <strong>To Communicate With You:</strong> To send transactional emails,
                renewal reminders, payment failure alerts, and service updates.
              </li>
              <li>
                <strong>To Improve Reading Experience:</strong> To recommend content and
                optimize our platform.
              </li>
              <li>
                <strong>To Ensure Security &amp; Prevent Fraud:</strong> To protect against
                unauthorized access, suspicious payments, or piracy.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>3. How We Share Your Information</h2>
            <p className={styles.text}>We do not sell your personal data.</p>
            <ul className={styles.list}>
              <li>
                <strong>Payment Partners:</strong> We may share required transaction data
                with secure payment gateway providers to process purchases and Autopay mandates.
              </li>
              <li>
                <strong>Service Providers:</strong> We may use third-party services for hosting,
                analytics, customer support, and email delivery.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose data if required by law,
                court order, or regulatory authority.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Autopay Terms &amp; Data Security</h2>
            <p className={styles.text}>
              <strong>Autopay Mandates</strong>
              <br />
              When you opt for a subscription model, you authorize THANVI ENTERPRISE and
              our payment processors to securely process recurring payments.
            </p>
            <ul className={styles.list}>
              <li>
                Pre-debit notifications may be sent to your registered email or phone number
                before automated deductions.
              </li>
              <li>
                You may revoke or modify your Autopay mandate through the supported payment
                or account process.
              </li>
            </ul>

            <p className={styles.text} style={{ marginTop: '1rem' }}>
              <strong>Data Security</strong>
              <br />
              We use reasonable administrative, technical, and security measures, including
              SSL encryption, to safeguard your data. However, no online transmission or
              storage method can be guaranteed 100% secure.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Your Rights and Choices</h2>
            <ul className={styles.list}>
              <li>
                <strong>Access and Correction:</strong> You may access or correct your
                personal information where applicable.
              </li>
              <li>
                <strong>Autopay Cancellation:</strong> You may cancel recurring subscription
                payments and revoke Autopay consent as per the available process.
              </li>
              <li>
                <strong>Opt-Out:</strong> You may unsubscribe from marketing emails using
                the unsubscribe option provided in emails.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Changes to This Privacy Policy</h2>
            <p className={styles.text}>
              We may update this Privacy Policy from time to time. Any changes will be
              posted on this page with an updated effective date.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Contact Us</h2>
            <p className={styles.text}>
              If you have any questions, concerns, or grievances regarding this Privacy
              Policy, your data, or your Autopay settings, please contact us:
            </p>
            <ul className={styles.list}>
              <li><strong>Company Name:</strong> THANVI ENTERPRISE</li>
              <li>
                <strong>Support Email:</strong>{' '}
                <a href="mailto:womenswear001@gmail.com" className={styles.link}>
                  womenswear001@gmail.com
                </a>
              </li>
              <li><strong>Mobile: 7048189052</strong> </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}