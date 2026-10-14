import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone } from 'lucide-react'
import styles from './Footer.module.css'

const shopLinks = [
  { label: 'All Products',   to: '/products' },
  { label: 'Home Décor',     to: '/products?category=home-decor' },
  { label: 'Jewelry',        to: '/products?category=jewelry' },
  { label: 'Gifts',          to: '/products?category=gifts' },
  { label: 'Art',            to: '/products?category=art' },
  { label: 'Accessories',    to: '/products?category=accessories' },
  { label: 'Sale',           to: '/products?sale=true' },
]

const helpLinks = [
  { label: 'FAQs',            href: '#' },
  { label: 'Shipping Policy', href: '#' },
  { label: 'Returns',         href: '#' },
  { label: 'Track your order',href: '#' },
  { label: 'Contact Us',      href: '#' },
]

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Twitter,   label: 'Twitter',   href: '#' },
  { icon: Facebook,  label: 'Facebook',  href: '#' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.grid}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>CC</span>
            <span className={styles.logoText}>Crafted Corner</span>
          </div>
          <p className={styles.tagline}>
            A curated marketplace for handmade goods crafted by independent artisans around the world.
          </p>
          <div className={styles.social}>
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} aria-label={label} className={styles.socialLink}>
                <Icon size={18} />
              </a>
            ))}
          </div>
          <div className={styles.contact}>
            <span><MapPin size={14} /> Portland, OR 97201</span>
            <span><Phone size={14} /> +1 (503) 555-0192</span>
            <span><Mail size={14} /> hello@craftedcorner.com</span>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className={styles.colTitle}>Shop</h3>
          <ul className={styles.linkList}>
            {shopLinks.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className={styles.link}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className={styles.colTitle}>Help & Info</h3>
          <ul className={styles.linkList}>
            {helpLinks.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className={styles.link}>{label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className={styles.colTitle}>Stay in the loop</h3>
          <p className={styles.newsletterText}>
            New makers, new drops, and seasonal sales — straight to your inbox.
          </p>
          <form className={styles.newsletterForm} onSubmit={e => e.preventDefault()}>
            <label htmlFor="footer-email" className="sr-only">Email address</label>
            <input
              id="footer-email"
              type="email"
              placeholder="your@email.com"
              className={styles.input}
              aria-label="Email for newsletter"
            />
            <button type="submit" className={styles.subscribeBtn}>Subscribe</button>
          </form>
          <p className={styles.privacyNote}>No spam, unsubscribe any time.</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <span>© {year} Crafted Corner. All rights reserved.</span>
          <div className={styles.bottomLinks}>
            <a href="#" className={styles.bottomLink}>Privacy Policy</a>
            <a href="#" className={styles.bottomLink}>Terms of Service</a>
            <a href="#" className={styles.bottomLink}>Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
