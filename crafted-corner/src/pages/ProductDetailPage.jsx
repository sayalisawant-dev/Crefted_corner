import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Heart, Zap, ChevronLeft, ChevronRight,
  Truck, RotateCcw, Shield, Package,
  Minus, Plus, Share2, MapPin, Star
} from 'lucide-react'
import StarRating from '../components/ui/StarRating'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ProductCard from '../components/ui/ProductCard'
import QuickViewModal from '../components/ui/QuickViewModal'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { products, artisans } from '../data/products'
import styles from './ProductDetailPage.module.css'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { toggle, has } = useWishlist()

  const product = products.find(p => p.id === id)

  // Scroll to top on product change
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [id])

  const [activeImg, setActiveImg]       = useState(0)
  const [quantity, setQuantity]         = useState(1)
  const [addedToCart, setAddedToCart]   = useState(false)
  const [activeTab, setActiveTab]       = useState('description')
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  // Reset state when product changes
  useEffect(() => {
    setActiveImg(0)
    setQuantity(1)
    setAddedToCart(false)
  }, [id])

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Product not found</h2>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Back to products
        </Button>
      </div>
    )
  }

  const artisan    = artisans.find(a => a.id === product.artisanId)
  const wishlisted = has(product.id)

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  function handleAddToCart() {
    addItem(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  function handleBuyNow() {
    addItem(product, quantity)
    navigate('/cart')
  }

  function prevImg() {
    setActiveImg(i => (i === 0 ? product.images.length - 1 : i - 1))
  }

  function nextImg() {
    setActiveImg(i => (i === product.images.length - 1 ? 0 : i + 1))
  }

  const badgeVariant = product.isNew ? 'new' : product.isSale ? 'sale' : null

  return (
    <div className={`page-enter ${styles.page}`}>
      <div className="container">

        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/products">Products</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/products?category=${product.category}`}>
            {product.category.replace('-', ' ')}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        {/* ══════════════════════════════════
            PRODUCT MAIN SECTION
        ══════════════════════════════════ */}
        <div className={styles.productGrid}>

          {/* ── Gallery ── */}
          <div className={styles.gallery}>
            {/* Thumbnails */}
            <div className={styles.thumbs} role="list" aria-label="Product images">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  role="listitem"
                  className={`${styles.thumb} ${activeImg === i ? styles.thumbActive : ''}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Image ${i + 1}`}
                  aria-pressed={activeImg === i}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className={styles.mainImgWrap}>
              <img
                key={activeImg}
                src={product.images[activeImg]}
                alt={product.name}
                className={styles.mainImg}
              />

              {/* Prev / Next */}
              {product.images.length > 1 && (
                <>
                  <button
                    className={`${styles.galleryNav} ${styles.galleryNavPrev}`}
                    onClick={prevImg}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    className={`${styles.galleryNav} ${styles.galleryNavNext}`}
                    onClick={nextImg}
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Badge */}
              {badgeVariant && (
                <div className={styles.galleryBadge}>
                  <Badge label={product.badge} variant={badgeVariant} />
                </div>
              )}

              {/* Dot indicators */}
              <div className={styles.dots} aria-hidden="true">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.dot} ${activeImg === i ? styles.dotActive : ''}`}
                    onClick={() => setActiveImg(i)}
                    tabIndex={-1}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Info panel ── */}
          <div className={styles.info}>
            {/* Top row */}
            <div className={styles.infoTop}>
              <span className={styles.category}>
                {product.category.replace('-', ' ')}
              </span>
              <button
                className={styles.shareBtn}
                aria-label="Share product"
                onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
              >
                <Share2 size={16} />
              </button>
            </div>

            <h1 className={styles.productTitle}>{product.name}</h1>

            {/* Rating row */}
            <div className={styles.ratingRow}>
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
              <span className={styles.ratingNum}>{product.rating}</span>
            </div>

            {/* Price */}
            <div className={styles.priceRow}>
              <span className={styles.price}>${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className={styles.originalPrice}>
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className={styles.saveBadge}>
                    Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className={styles.shortDesc}>
              {product.description.slice(0, 120)}…
            </p>

            <div className={styles.divider} />

            {/* Quantity */}
            <div className={styles.qtyRow}>
              <span className={styles.qtyLabel}>Quantity</span>
              <div className={styles.qtyControl} role="group" aria-label="Quantity">
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className={styles.qtyValue} aria-live="polite" aria-label={`Quantity: ${quantity}`}>
                  {quantity}
                </span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(q => Math.min(10, q + 1))}
                  aria-label="Increase quantity"
                  disabled={quantity >= 10}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className={styles.ctaRow}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                aria-label={`Add ${quantity} × ${product.name} to cart`}
              >
                <ShoppingCart size={18} />
                {addedToCart ? 'Added to cart!' : 'Add to Cart'}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={handleBuyNow}
                aria-label="Buy now"
              >
                <Zap size={18} />
                Buy Now
              </Button>
            </div>

            {/* Wishlist */}
            <button
              className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlisted : ''}`}
              onClick={() => toggle(product.id)}
              aria-pressed={wishlisted}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
              {wishlisted ? 'Saved to wishlist' : 'Save to wishlist'}
            </button>

            <div className={styles.divider} />

            {/* Delivery perks */}
            <div className={styles.perks}>
              {[
                { icon: Truck,      text: 'Free shipping over $100' },
                { icon: RotateCcw,  text: '30-day easy returns' },
                { icon: Shield,     text: 'Secure, encrypted checkout' },
                { icon: Package,    text: 'Gift wrapping available' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className={styles.perk}>
                  <Icon size={15} className={styles.perkIcon} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════
            TABS: Description / Details / Delivery
        ══════════════════════════════════ */}
        <div className={styles.tabs}>
          <div className={styles.tabList} role="tablist" aria-label="Product information">
            {['description', 'details', 'delivery'].map(tab => (
              <button
                key={tab}
                role="tab"
                id={`tab-${tab}`}
                aria-selected={activeTab === tab}
                aria-controls={`panel-${tab}`}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className={styles.tabPanel}
          >
            {activeTab === 'description' && (
              <p className={styles.tabText}>{product.description}</p>
            )}
            {activeTab === 'details' && (
              <dl className={styles.detailList}>
                <div className={styles.detailRow}>
                  <dt>Materials</dt>
                  <dd>{product.materials}</dd>
                </div>
                <div className={styles.detailRow}>
                  <dt>Dimensions</dt>
                  <dd>{product.dimensions}</dd>
                </div>
                <div className={styles.detailRow}>
                  <dt>Category</dt>
                  <dd style={{ textTransform: 'capitalize' }}>
                    {product.category.replace('-', ' ')}
                  </dd>
                </div>
                <div className={styles.detailRow}>
                  <dt>Tags</dt>
                  <dd className={styles.tagList}>
                    {product.tags.map(t => (
                      <Link
                        key={t}
                        to={`/products?q=${encodeURIComponent(t)}`}
                        className={styles.tag}
                      >
                        {t}
                      </Link>
                    ))}
                  </dd>
                </div>
              </dl>
            )}
            {activeTab === 'delivery' && (
              <div className={styles.deliveryInfo}>
                <p className={styles.tabText}>{product.delivery}</p>
                <div className={styles.deliveryGrid}>
                  {[
                    { icon: Truck,     title: 'Standard Shipping', body: '5–7 business days · $7.95 (free over $100)' },
                    { icon: Zap,       title: 'Express Shipping',  body: '2–3 business days · $14.95' },
                    { icon: RotateCcw, title: 'Returns',           body: '30-day returns accepted. Item must be unused.' },
                  ].map(({ icon: Icon, title, body }) => (
                    <div key={title} className={styles.deliveryCard}>
                      <Icon size={20} className={styles.deliveryIcon} />
                      <div>
                        <strong>{title}</strong>
                        <p>{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════
            ARTISAN PROFILE
        ══════════════════════════════════ */}
        {artisan && (
          <section className={styles.artisanSection} aria-labelledby="artisan-heading">
            <h2 className={`section-title ${styles.sectionTitle}`} id="artisan-heading">
              Meet the artisan
            </h2>
            <div className={styles.artisanCard}>
              <img
                src={artisan.avatar}
                alt={artisan.name}
                className={styles.artisanAvatar}
              />
              <div className={styles.artisanInfo}>
                <div className={styles.artisanHeader}>
                  <div>
                    <h3 className={styles.artisanName}>{artisan.name}</h3>
                    <p className={styles.artisanSpecialty}>{artisan.specialty}</p>
                    <div className={styles.artisanMeta}>
                      <span className={styles.artisanMetaItem}>
                        <MapPin size={13} />
                        {artisan.location}
                      </span>
                      <span className={styles.artisanMetaItem}>
                        <Star size={13} />
                        {artisan.rating} rating
                      </span>
                      <span className={styles.artisanMetaItem}>
                        <Package size={13} />
                        {artisan.sales.toLocaleString()} sales
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/products?artisan=${artisan.id}`)}
                  >
                    View all work
                  </Button>
                </div>
                <p className={styles.artisanBio}>{artisan.bio}</p>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════
            RELATED PRODUCTS
        ══════════════════════════════════ */}
        {related.length > 0 && (
          <section className={styles.relatedSection} aria-labelledby="related-heading">
            <div className={styles.relatedHeader}>
              <h2 className={`section-title ${styles.sectionTitle}`} id="related-heading">
                You might also like
              </h2>
              <Link
                to={`/products?category=${product.category}`}
                className={styles.seeAll}
              >
                See all <ChevronRight size={14} />
              </Link>
            </div>
            <div className={styles.relatedGrid}>
              {related.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          </section>
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
