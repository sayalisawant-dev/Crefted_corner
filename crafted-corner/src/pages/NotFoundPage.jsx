import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Compass, ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className={`page-enter ${styles.page}`}>
      <div className={styles.inner}>
        <Compass size={72} className={styles.icon} aria-hidden="true" />
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.text}>
          Looks like this page wandered off. Let's get you back to something beautiful.
        </p>
        <div className={styles.actions}>
          <Button variant="primary" size="lg" onClick={() => navigate('/')}>
            Go home <ArrowRight size={18} />
          </Button>
          <Button variant="ghost" size="lg" onClick={() => navigate('/products')}>
            Browse products
          </Button>
        </div>
      </div>
    </div>
  )
}
