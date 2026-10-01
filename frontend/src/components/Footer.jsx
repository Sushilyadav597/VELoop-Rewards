import React from 'react';
import { ShieldCheck, ChevronRight, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import styles from './Footer.module.css';

/**
 * Footer Component (Section 17 & Section 25):
 * Complete VELoop commercial rewards platform footer including:
 * - Official trust & verification strip
 * - Security & anti-cheat audit status
 * - Platform links and legal guarantee
 */
export const Footer = () => {
  return (
    <footer className={styles.footerContainer} aria-label="VELoop Rewards Footer">
      {/* Official Trust Strip */}
      <div className={styles.trustStrip}>
        <div className={styles.trustLeft}>
          <div className={styles.vrBadge}>VR</div>
          <div>
            <p className={styles.trustTitle}>Official rewards verified on VeLoopRewards.in</p>
            <p className={styles.trustSubtitle}>
              Stay active, maintain your daily streak, and unlock guaranteed rewards!
            </p>
          </div>
        </div>

        <ChevronRight size={18} color="#A78BFA" />
      </div>

      {/* Main SaaS Platform Footer Card */}
      <div className={styles.mainFooter}>
        <div className={styles.footerTop}>
          <div className={styles.brandCol}>
            <div>
              <p className={styles.brandName}>
                VELoop <span className={styles.brandHighlight}>Rewards</span>
              </p>
              <p className={styles.brandTagline}>The Premier Daily Gamified Rewards Engine</p>
            </div>
          </div>

          <div className={styles.securityBadges}>
            <div className={styles.securityPill}>
              <ShieldCheck size={14} />
              <span>100% Backend Validated</span>
            </div>
            <div className={styles.securityPill}>
              <Lock size={14} />
              <span>Cryptographic Idempotency</span>
            </div>
          </div>
        </div>

        <div className={styles.footerLinks}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} VELoop Technologies, Inc. All rights reserved. Built for public production.
          </p>

          <ul className={styles.linksList}>
            <li className={styles.linkItem}>
              <a href="#streak-rules">Streak Rules</a>
            </li>
            <li className={styles.linkItem}>
              <a href="#rewards-terms">Reward Terms</a>
            </li>
            <li className={styles.linkItem}>
              <a href="#privacy">Privacy &amp; Security</a>
            </li>
            <li className={styles.linkItem}>
              <a href="#support">Support</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
