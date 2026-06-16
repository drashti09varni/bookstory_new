import Link from 'next/link';
import styles from './policy.module.css';

export default function TermsPage() {
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
          <h1 className={styles.title}>Terms &amp; Conditions</h1>
          <span className={styles.lastUpdated}>Effective Date: June 8, 2026</span>
        </header>

        <div className={styles.card}>
          <div className={styles.section}>
            <p className={styles.text}>
              Welcome to <strong>THANVI ENTERPRISE</strong>. By accessing our website,
              purchasing our e-novels, or subscribing to our automated payment services,
              you agree to be bound by the following Terms and Conditions.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
            <p className={styles.text}>
              By accessing and using the platform owned and operated by THANVI ENTERPRISE,
              you acknowledge that you have read, understood, and agree to comply with these
              Terms and Conditions, our Privacy Policy, and all applicable laws and regulations.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Digital Content &amp; Subscription Models</h2>
            <ul className={styles.list}>
              <li>
                <strong>License to Read:</strong> Upon successful purchase or active subscription,
                THANVI ENTERPRISE grants you a limited, non-exclusive, non-transferable license
                to access and read digital content for personal, non-commercial use.
              </li>
              <li>
                <strong>Account Security:</strong> You are responsible for maintaining the
                confidentiality of your account credentials.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Autopay and Billing Terms</h2>
            <ul className={styles.list}>
              <li>
                <strong>Authorization:</strong> By opting into a subscription plan, you authorize
                THANVI ENTERPRISE and our payment gateway partners to automatically charge your
                selected payment method at the designated recurring intervals.
              </li>
              <li>
                <strong>Pre-Debit Notifications:</strong> You may receive an advance notification
                via email or SMS before any recurring payment is executed.
              </li>
              <li>
                <strong>Cancellation:</strong> You can cancel or revoke your Autopay mandate as
                per the process available through your payment provider or account dashboard.
              </li>
              <li>
                <strong>Payment Failures:</strong> If an automated payment fails, access to premium
                content may be temporarily suspended until payment is completed.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Refund and Cancellation Policy</h2>
            <ul className={styles.list}>
              <li>
                <strong>Digital Goods:</strong> Due to the digital nature of e-novels and instant
                content access, purchases and successful subscription renewals are generally
                non-refundable once access is granted.
              </li>
              <li>
                <strong>Subscription Term:</strong> If you cancel a recurring subscription, access
                may remain active until the end of the current paid billing cycle.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Intellectual Property &amp; Anti-Piracy</h2>
            <ul className={styles.list}>
              <li>
                <strong>Ownership:</strong> All stories, text, graphics, logos, cover designs,
                and platform materials are owned by THANVI ENTERPRISE or its licensors.
              </li>
              <li>
                <strong>Prohibited Actions:</strong> You must not copy, reproduce, resell,
                redistribute, publicly display, scrape, or misuse any content from our platform.
              </li>
              <li>
                <strong>Enforcement:</strong> Any unauthorized sharing or piracy may lead to
                account termination and legal action.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Prohibited Website Use</h2>
            <p className={styles.text}>You agree to use our platform only for lawful purposes.</p>
            <ul className={styles.list}>
              <li>Do not transmit malware, viruses, or harmful code.</li>
              <li>Do not impersonate any person, company, author, or entity.</li>
              <li>Do not interfere with website security, payments, or platform operations.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>7. User Reviews &amp; Comments</h2>
            <p className={styles.text}>
              If you submit reviews, feedback, or comments, you grant THANVI ENTERPRISE
              permission to use such content for platform improvement, display, or marketing,
              subject to applicable laws.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Limitation of Liability</h2>
            <p className={styles.text}>
              THANVI ENTERPRISE shall not be liable for indirect, incidental, or consequential
              damages arising from website use, payment delays, network issues, or temporary
              loss of access.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Indemnification</h2>
            <p className={styles.text}>
              You agree to indemnify and hold harmless THANVI ENTERPRISE from claims or losses
              resulting from your breach of these Terms or misuse of platform content.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Governing Law and Jurisdiction</h2>
            <p className={styles.text}>
              These Terms shall be governed by the laws of India. Any disputes shall be subject
              to the jurisdiction of competent courts in India.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Contact Information</h2>
            <p className={styles.text}>
              For support, billing, cancellation, or policy-related questions, contact us:
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