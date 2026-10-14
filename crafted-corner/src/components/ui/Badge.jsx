import React from 'react'
import styles from './Badge.module.css'

/** variant: 'new' | 'sale' | 'featured' | 'neutral' */
export default function Badge({ label, variant = 'neutral' }) {
  if (!label) return null
  return <span className={`${styles.badge} ${styles[variant]}`}>{label}</span>
}
