import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import StarRating from './StarRating'
import Badge from './Badge'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { artisans } from '../../data/products'
import styles from './ProductCard.module.css'

export default function ProductCard({ product, onQuickView }) {
  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const [added, setAdded] = useState(false)

  const artisan    = artisans.find(a => a.id === product.artisanId)
  const wishlisted = has(product.id)

  function handleAddToCart(e) {
    e.preventDefault()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  function handleWishlist(e) {
    e.preventDefault()
    toggle(product.id)
  }

  function handleQuickView(e) {
    e.preventDefault()
    onQuickView?.(product)
  }

  const badgeVariant = product.isNew ? 'new' : product.isSale ? 'sale' : null

  return (
    <article className={styles.card}>
      <Link to={`/products/${product.id}`} className={styles.imageWrap} aria-label={product.name}>
        <img
          src={product.images[0]}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />

        {/* Badges */}
        {badgeVariant && (
          <div className={styles.badge}>
            <Badge label={product.badge} variant={badgeVariant} />
          </div>
        )}

        {/* Hover overlay actions */}
        <div className={styles.overlay} aria-hidden="true">
          <button
            className={styles.overlayBtn}
            onClick={handleQuickView}
            title="Quick view"
          >
            <Eye size={16} />
            <span>Quick View</span>
          </button>
        </div>

        {/* Wishlist */}
        <button
          className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlisted : ''}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </Link>

      <div className={styles.body}>
        <p className={styles.artisan}>{artisan?.name}</p>
        <Link to={`/products/${product.id}`} className={styles.name}>
          {product.name}
        </Link>

        <StarRating rating={product.rating} reviewCount={product.reviewCount} size={13} />

        <div className={styles.footer}>
          <div className={styles.priceRow}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <button
            className={`${styles.cartBtn} ${added ? styles.cartAdded : ''}`}
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={15} />
            <span>{added ? 'Added!' : 'Add'}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
