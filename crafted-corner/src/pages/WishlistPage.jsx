import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import QuickViewModal from '../components/ui/QuickViewModal'
import Button from '../components/ui/Button'
import { useWishlist } from '../context/WishlistContext'
import { products } from '../data/products'
import styles from './WishlistPage.module.css'

export default function WishlistPage() {
  const { ids } = useWishlist()
  const navigate = useNavigate()
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  const wishlisted = products.filter(p => ids.has(p.id))

  return (
    <div className={`page-enter ${styles.page}`}>
      <div className="container">
        <h1 className={`display-heading ${styles.title}`}>
          <Heart size={28} className={styles.titleIcon} aria-hidden="true" />
          Wishlist
          {wishlisted.length > 0 && (
            <span className={styles.count}>{wishlisted.length} item{wishlisted.length !== 1 ? 's' : ''}</span>
          )}
        </h1>

        {wishlisted.length === 0 ? (
          <div className={styles.empty}>
            <ShoppingBag size={64} className={styles.emptyIcon} aria-hidden="true" />
            <h2 className={styles.emptyTitle}>Your wishlist is empty</h2>
            <p className={styles.emptyText}>
              Browse our collection and tap the heart icon on any product to save it here.
            </p>
            <Button variant="primary" size="lg" onClick={() => navigate('/products')}>
              Explore products <ArrowRight size={18} />
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {wishlisted.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
            <div className={styles.actions}>
              <Button variant="secondary" onClick={() => navigate('/products')}>
                Continue shopping
              </Button>
            </div>
          </>
        )}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  )
}
