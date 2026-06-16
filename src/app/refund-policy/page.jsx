import Link from 'next/link';
import styles from '../terms/policy.module.css';

export default function RefundPolicyPage() {
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
          <h1 className={styles.title}>Cancellation &amp; Refund Policy</h1>
          <span className={styles.lastUpdated}>Effective Date: June 8, 2026</span>
        </header>

        <div className={styles.card}>
          <div className={styles.section}>
            <p className={styles.text}>
              Thank you for choosing <strong>THANVI ENTERPRISE</strong> for your digital
              reading. Because our products are digital e-novels delivered immediately upon
              purchase or active subscription, our refund and return policies differ from
              physical merchandise. Please read our guidelines below.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Digital Content Return Policy</h2>
            <ul className={styles.list}>
              <li>
                <strong>All Sales are Final:</strong> Due to the intangible and instant access
                nature of digital e-novels, all one-time book purchases and completed automated
                subscription payments are non-returnable and non-refundable.
              </li>
              <li>
                <strong>Change of Mind:</strong> We cannot offer refunds, credits, or exchanges
                for accidental purchases, changes of mind, or if you dislike an e-novel&apos;s
                storyline after unlocking it.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Autopay Subscriptions &amp; Cancellations</h2>
            <ul className={styles.list}>
              <li>
                <strong>Cancellation Window:</strong> You can cancel your recurring e-novel
                subscription at any time. To prevent the next automated deduction, revoke your
                Autopay mandate at least 48 hours before the scheduled renewal date.
              </li>
              <li>
                <strong>Post-Cancellation Access:</strong> After cancellation, your access to
                the subscription library may remain active until the end of the current prepaid
                billing cycle. No partial or pro-rated refunds are issued for unused days.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Approved Exceptions &amp; Refund Processing</h2>
            <p className={styles.text}>
              While normal digital sales are final, <strong>THANVI ENTERPRISE</strong> may review
              refund requests under the following conditions:
            </p>

            <p className={styles.text} style={{ marginTop: '0.8rem' }}>
              <strong>Eligible Conditions for a Refund:</strong>
            </p>

            <ol className={styles.list}>
              <li>
                <strong>Duplicate Charges:</strong> If a technical error or payment gateway issue
                charges your bank account, card, or UPI multiple times for a single transaction.
              </li>
              <li>
                <strong>Unintentional Autopay Renewal After Cancellation:</strong> If you cancelled
                the mandate as required, but the system still processed a renewal charge.
              </li>
            </ol>

            <p className={styles.text} style={{ marginTop: '1.5rem' }}>
              <strong>Refund Processing Timeframe</strong>
              <br />
              When a refund is approved due to payment or system error, the amount will be reversed
              to the original payment source such as Bank Account, Credit/Debit Card, or UPI ID.
            </p>

            <p className={styles.text} style={{ marginTop: '0.8rem' }}>
              <strong>Refund Timeline:</strong> Approved refunds are generally credited within{' '}
              <strong>6 to 7 business days</strong>, depending on the payment provider and bank
              processing timelines.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Digital Replacements &amp; Technical Issues</h2>
            <p className={styles.text}>
              If you experience a technical error where a purchased e-novel fails to load, displays
              broken text, or fails to unlock in your library:
            </p>
            <ul className={styles.list}>
              <li>
                <strong>Reporting:</strong> Contact our support team with your transaction details
                and issue description.
              </li>
              <li>
                <strong>Resolution:</strong> After internal verification, access may be restored or
                a corrected digital file may be provided within 7 business days.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Contact Our Support Team</h2>
            <p className={styles.text}>
              For billing disputes, assistance with cancelling an Autopay mandate, or reporting
              file delivery issues, please contact us:
            </p>
            <ul className={styles.list}>
              <li><strong>Company Name:</strong> THANVI ENTERPRISE</li>
              <li>
                <strong>Support Email:</strong>{' '}
                <a href="mailto:womenswear001@gmail.com" className={styles.link}>
                  womenswear001@gmail.com
                </a>
              </li>
              <li><strong>Mobile: 8980606560</strong> </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}