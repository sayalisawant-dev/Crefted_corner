import React, { useEffect } from 'react'
import { X, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import Button from './Button'
import { useCart } from '../../context/CartContext'
import { artisans } from '../../data/products'
import styles from './QuickViewModal.module.css'

export default function QuickViewModal({ product, onClose }) {
  const { addItem } = useCart()
  const artisan = artisans.find(a => a.id === product.artisanId)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true" aria-label={product.name}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close quick view">
          <X size={20} />
        </button>

        <div className={styles.content}>
          <div className={styles.imageWrap}>
            <img src={product.images[0]} alt={product.name} className={styles.image} />
          </div>

          <div className={styles.info}>
            <p className={styles.artisanName}>{artisan?.name}</p>
            <h2 className={styles.title}>{product.name}</h2>
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />

            <p className={styles.price}>
              ${product.price.toFixed(2)}
              {product.originalPrice && (
                <span className={styles.originalPrice}> ${product.originalPrice.toFixed(2)}</span>
              )}
            </p>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.actions}>
              <Button
                variant="primary"
                size="md"
                onClick={() => { addItem(product); onClose() }}
              >
                <ShoppingCart size={16} />
                Add to Cart
              </Button>
              <Link to={`/products/${product.id}`} className={styles.viewFull} onClick={onClose}>
                View full details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
