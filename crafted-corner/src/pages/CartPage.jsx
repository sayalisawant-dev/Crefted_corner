import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Trash2, Plus, Minus, Tag,
  ChevronRight, ArrowRight, ShoppingBag, X
} from 'lucide-react'
import Button from '../components/ui/Button'
import { useCart } from '../context/CartContext'
import styles from './CartPage.module.css'

export default function CartPage() {
  const {
    items, itemCount, subtotal, discount, shipping, total,
    promoCode, promoDiscount, promoError,
    removeItem, updateQty, applyPromo, clearPromo,
  } = useCart()
  const navigate = useNavigate()

  const [promoInput, setPromoInput] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  function handleApplyPromo(e) {
    e.preventDefault()
    if (!promoInput.trim()) return
    applyPromo(promoInput.trim())
    setPromoApplied(true)
  }

  function handleClearPromo() {
    clearPromo()
    setPromoInput('')
    setPromoApplied(false)
  }

  if (items.length === 0) {
    return (
      <div className={`page-enter ${styles.page}`}>
        <div className="container">
          <h1 className={`display-heading ${styles.pageTitle}`}>Your Cart</h1>
          <div className={styles.emptyState}>
            <ShoppingBag size={64} className={styles.emptyIcon} aria-hidden="true" />
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyText}>
              Looks like you haven't added anything yet. Explore our collection of
              handmade goods and find something you'll love.
            </p>
            <Button variant="primary" size="lg" onClick={() => navigate('/products')}>
              Start shopping <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`page-enter ${styles.page}`}>
      <div className="container">
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span>Cart</span>
            </nav>
            <h1 className={`display-heading ${styles.pageTitle}`}>
              Your Cart
              <span className={styles.itemCount}>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
            </h1>
          </div>
          <Link to="/products" className={styles.continueShopping}>
            ← Continue shopping
          </Link>
        </div>

        <div className={styles.layout}>
          {/* ══════════════════════════════
              CART ITEMS
          ══════════════════════════════ */}
          <div className={styles.itemsCol}>
            <div className={styles.itemsList} role="list" aria-label="Cart items">
              {items.map(({ product, quantity }) => (
                <article
                  key={product.id}
                  className={styles.cartItem}
                  role="listitem"
                >
                  {/* Image */}
                  <Link to={`/products/${product.id}`} className={styles.itemImageWrap}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className={styles.itemImage}
                    />
                  </Link>

                  {/* Info */}
                  <div className={styles.itemInfo}>
                    <div className={styles.itemTop}>
                      <div>
                        <span className={styles.itemCategory}>
                          {product.category.replace('-', ' ')}
                        </span>
                        <Link to={`/products/${product.id}`} className={styles.itemName}>
                          {product.name}
                        </Link>
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeItem(product.id)}
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className={styles.itemBottom}>
                      {/* Qty control */}
                      <div
                        className={styles.qtyControl}
                        role="group"
                        aria-label={`Quantity for ${product.name}`}
                      >
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQty(product.id, quantity - 1)}
                          aria-label="Decrease quantity"
                          disabled={quantity <= 1}
                        >
                          <Minus size={13} />
                        </button>
                        <span
                          className={styles.qtyValue}
                          aria-live="polite"
                          aria-label={`Quantity: ${quantity}`}
                        >
                          {quantity}
                        </span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQty(product.id, quantity + 1)}
                          aria-label="Increase quantity"
                          disabled={quantity >= 10}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className={styles.itemPriceCol}>
                        <span className={styles.itemTotal}>
                          ${(product.price * quantity).toFixed(2)}
                        </span>
                        {quantity > 1 && (
                          <span className={styles.itemUnitPrice}>
                            ${product.price.toFixed(2)} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Promo code */}
            <div className={styles.promoSection}>
              <h3 className={styles.promoTitle}>
                <Tag size={16} /> Promo Code
              </h3>
              {promoDiscount > 0 ? (
                <div className={styles.promoApplied}>
                  <span>
                    🎉 <strong>{promoCode}</strong> applied — {Math.round(promoDiscount * 100)}% off
                  </span>
                  <button
                    className={styles.promoRemoveBtn}
                    onClick={handleClearPromo}
                    aria-label="Remove promo code"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <form className={styles.promoForm} onSubmit={handleApplyPromo}>
                  <label htmlFor="promo-input" className="sr-only">Promo code</label>
                  <input
                    id="promo-input"
                    type="text"
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                    className={`${styles.promoInput} ${promoError ? styles.promoInputError : ''}`}
                    aria-describedby={promoError ? 'promo-error' : undefined}
                  />
                  <button type="submit" className={styles.promoApplyBtn}>
                    Apply
                  </button>
                </form>
              )}
              {promoError && !promoDiscount && (
                <p id="promo-error" className={styles.promoError} role="alert">
                  {promoError}
                </p>
              )}
              <p className={styles.promoHint}>
                Try: <code>CRAFTED10</code>, <code>HANDMADE20</code>, <code>WELCOME15</code>
              </p>
            </div>
          </div>

          {/* ══════════════════════════════
              ORDER SUMMARY
          ══════════════════════════════ */}
          <aside className={styles.summary} aria-label="Order summary">
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <dl className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <dt>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</dt>
                <dd>${subtotal.toFixed(2)}</dd>
              </div>

              {discount > 0 && (
                <div className={`${styles.summaryRow} ${styles.summaryDiscount}`}>
                  <dt>Discount ({Math.round(promoDiscount * 100)}% off)</dt>
                  <dd>−${discount.toFixed(2)}</dd>
                </div>
              )}

              <div className={styles.summaryRow}>
                <dt>Estimated shipping</dt>
                <dd>
                  {shipping === 0
                    ? <span className={styles.freeShipping}>FREE</span>
                    : `$${shipping.toFixed(2)}`}
                </dd>
              </div>

              {subtotal < 100 && subtotal > 0 && (
                <div className={styles.freeShippingNote}>
                  Add <strong>${(100 - subtotal).toFixed(2)}</strong> more for free shipping
                  <div
                    className={styles.freeShippingBar}
                    role="progressbar"
                    aria-valuenow={Math.min(subtotal, 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Progress to free shipping"
                  >
                    <div
                      className={styles.freeShippingFill}
                      style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </dl>

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
              <ChevronRight size={18} />
            </Button>

            <div className={styles.secureNote}>
              <span>🔒</span>
              <span>Secure, encrypted checkout</span>
            </div>

            {/* Accepted payments */}
            <div className={styles.paymentIcons} aria-label="Accepted payment methods">
              {['VISA', 'MC', 'AMEX', 'PayPal'].map(p => (
                <span key={p} className={styles.paymentIcon}>{p}</span>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
