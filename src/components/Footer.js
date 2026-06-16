import Link from 'next/link';
import styles from './Footer.module.css';

export default function FooterPage() {
  return (
    <main className={styles.page}>
      <footer className={styles.footerContainer}>
        <div className={styles.footerContent}>
          <div className={styles.brandColumn}>
            <Link className={styles.brandLogo} href="/">
              <div className={styles.logoBadge}>
                A<span className={styles.logoBadgeDot}></span>
              </div>
              <span className={styles.brandName}>Aethera</span>
              {/* <small className={styles.brandTagline}>Premium Stories</small> */}
            </Link>

            <p className={styles.brandDescription}>
              Discover immersive, hand-crafted Hinglish stories. Steampunk, Sci-Fi,
              Fantasy, and Romance lounges tailored for the modern reader.
            </p>
          </div>

          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>Explore</h4>
            <ul className={styles.linksList}>
              <li><Link className={styles.footerLink} href="/">Popular</Link></li>
              <li><Link className={styles.footerLink} href="/originals">Originals</Link></li>
              <li><Link className={styles.footerLink} href="/new-and-hot">New &amp; Hot</Link></li>
              <li><Link className={styles.footerLink} href="/upcoming">Upcoming</Link></li>
            </ul>
          </div>

          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>Legal Policy</h4>
            <ul className={styles.linksList}>
              <li><Link className={styles.footerLink} href="/terms">Terms &amp; Conditions</Link></li>
              <li><Link className={styles.footerLink} href="/privacy">Privacy Policy</Link></li>
              <li><Link className={styles.footerLink} href="/refund-policy">Cancellation &amp; Refund Policy</Link></li>
              <li><Link className={styles.footerLink} href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className={styles.quoteColumn}>
            <h4 className={styles.columnTitle}>Streamvibe Words</h4>
            <blockquote className={styles.footerQuote}>
              “Stories are the only magic that is real. Har click pe ek nayi duniya,
              har page pe ek naya jahan.”
            </blockquote>
            <cite className={styles.quoteAuthor}>— The Cartographers</cite>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.bottomBarContent}>
            <div className={styles.copyrightSection}>
              <span className={styles.ventureText}>
                venture by HIRALBHAI CHATURBHAI CHOVATIYA
              </span>
              <span>© 2026 THANVI ENTERPRISE. All rights reserved.</span>
            </div>
            <span>Made for premium Hinglish readers.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}