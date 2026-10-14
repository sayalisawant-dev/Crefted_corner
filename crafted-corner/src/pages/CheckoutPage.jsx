import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Check, ChevronRight, Lock, CreditCard,
  Truck, MapPin, User, Mail, Phone, Package
} from 'lucide-react'
import Button from '../components/ui/Button'
import { useCart } from '../context/CartContext'
import styles from './CheckoutPage.module.css'

const STEPS = ['Shipping', 'Payment', 'Review']

const EMPTY_SHIPPING = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', apt: '', city: '', state: '', zip: '', country: 'US',
}

const EMPTY_PAYMENT = {
  cardName: '', cardNumber: '', expiry: '', cvv: '',
}

export default function CheckoutPage() {
  const { items, subtotal, discount, shipping, total, promoDiscount, clearCart } = useCart()
  const navigate = useNavigate()

  const [step, setStep]               = useState(0)
  const [shippingData, setShippingData] = useState(EMPTY_SHIPPING)
  const [paymentData, setPaymentData]   = useState(EMPTY_PAYMENT)
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [errors, setErrors]           = useState({})
  const [placed, setPlaced]           = useState(false)

  // Redirect to cart if empty
  if (items.length === 0 && !placed) {
    return (
      <div className={styles.emptyRedirect}>
        <p>Your cart is empty.</p>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Continue shopping
        </Button>
      </div>
    )
  }

  // ── Validation ──
  function validateShipping() {
    const e = {}
    if (!shippingData.firstName.trim()) e.firstName = 'First name is required'
    if (!shippingData.lastName.trim())  e.lastName  = 'Last name is required'
    if (!shippingData.email.trim() || !/\S+@\S+\.\S+/.test(shippingData.email))
      e.email = 'Valid email is required'
    if (!shippingData.address.trim()) e.address = 'Address is required'
    if (!shippingData.city.trim())    e.city    = 'City is required'
    if (!shippingData.state.trim())   e.state   = 'State is required'
    if (!shippingData.zip.trim())     e.zip     = 'ZIP code is required'
    return e
  }

  function validatePayment() {
    const e = {}
    if (!paymentData.cardName.trim())   e.cardName   = 'Cardholder name is required'
    if (paymentData.cardNumber.replace(/\s/g, '').length < 16)
      e.cardNumber = 'Valid 16-digit card number is required'
    if (!paymentData.expiry.trim() || !/^\d{2}\/\d{2}$/.test(paymentData.expiry))
      e.expiry = 'Expiry in MM/YY format required'
    if (paymentData.cvv.length < 3) e.cvv = 'Valid CVV required'
    return e
  }

  function handleNext() {
    if (step === 0) {
      const e = validateShipping()
      if (Object.keys(e).length) { setErrors(e); return }
    }
    if (step === 1) {
      const e = validatePayment()
      if (Object.keys(e).length) { setErrors(e); return }
    }
    setErrors({})
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handlePlaceOrder() {
    setPlaced(true)
    clearCart()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function updateShipping(field, value) {
    setShippingData(p => ({ ...p, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }))
  }

  function updatePayment(field, value) {
    setPaymentData(p => ({ ...p, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }))
  }

  function formatCardNumber(val) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }

  function formatExpiry(val) {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return `${digits.slice(0,2)}/${digits.slice(2)}`
    return digits
  }

  const expressShippingCost = 14.95
  const shippingCost = shippingMethod === 'express'
    ? expressShippingCost
    : (subtotal >= 100 ? 0 : 7.95)

  const orderTotal = subtotal - discount + shippingCost

  // ════════════════════════════
  // ORDER CONFIRMED state
  // ════════════════════════════
  if (placed) {
    const orderId = `CC-${Date.now().toString(36).toUpperCase()}`
    return (
      <div className={`page-enter ${styles.page}`}>
        <div className="container">
          <div className={styles.confirmation}>
            <div className={styles.confirmCheck} aria-hidden="true">
              <Check size={36} strokeWidth={3} />
            </div>
            <h1 className={styles.confirmTitle}>Order Confirmed!</h1>
            <p className={styles.confirmSub}>
              Thank you, <strong>{shippingData.firstName}</strong>! Your order has been
              placed and is being lovingly prepared by our artisans.
            </p>
            <div className={styles.confirmDetails}>
              <div className={styles.confirmRow}>
                <span>Order number</span>
                <strong>{orderId}</strong>
              </div>
              <div className={styles.confirmRow}>
                <span>Confirmation sent to</span>
                <strong>{shippingData.email}</strong>
              </div>
              <div className={styles.confirmRow}>
                <span>Estimated delivery</span>
                <strong>
                  {shippingMethod === 'express' ? '2–3 business days' : '5–7 business days'}
                </strong>
              </div>
              <div className={styles.confirmRow}>
                <span>Order total</span>
                <strong>${orderTotal.toFixed(2)}</strong>
              </div>
            </div>
            <div className={styles.confirmActions}>
              <Button variant="primary" size="lg" onClick={() => navigate('/products')}>
                Continue shopping
              </Button>
              <Button variant="ghost" size="lg" onClick={() => navigate('/')}>
                Back to home
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`page-enter ${styles.page}`}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/cart">Cart</Link>
          <span>/</span>
          <span>Checkout</span>
        </nav>

        <h1 className={`display-heading ${styles.pageTitle}`}>Checkout</h1>

        {/* ── Step indicator ── */}
        <div className={styles.stepper} role="list" aria-label="Checkout steps">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div
                className={`${styles.stepItem} ${i === step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}
                role="listitem"
                aria-current={i === step ? 'step' : undefined}
              >
                <div className={styles.stepCircle}>
                  {i < step ? <Check size={14} strokeWidth={3} /> : i + 1}
                </div>
                <span className={styles.stepLabel}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`${styles.stepLine} ${i < step ? styles.stepLineDone : ''}`} aria-hidden="true" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className={styles.layout}>

          {/* ══════════════════════════════
              FORM AREA
          ══════════════════════════════ */}
          <div className={styles.formArea}>

            {/* ── STEP 0: Shipping ── */}
            {step === 0 && (
              <section className={styles.formSection} aria-labelledby="shipping-heading">
                <h2 className={styles.formSectionTitle} id="shipping-heading">
                  <MapPin size={18} className={styles.formSectionIcon} />
                  Shipping Information
                </h2>

                <div className={styles.formGrid}>
                  <Field
                    label="First Name" id="firstName" required
                    value={shippingData.firstName}
                    onChange={v => updateShipping('firstName', v)}
                    error={errors.firstName}
                    icon={<User size={15} />}
                  />
                  <Field
                    label="Last Name" id="lastName" required
                    value={shippingData.lastName}
                    onChange={v => updateShipping('lastName', v)}
                    error={errors.lastName}
                  />
                  <Field
                    label="Email Address" id="email" type="email" required
                    value={shippingData.email}
                    onChange={v => updateShipping('email', v)}
                    error={errors.email}
                    icon={<Mail size={15} />}
                    span={2}
                  />
                  <Field
                    label="Phone" id="phone" type="tel"
                    value={shippingData.phone}
                    onChange={v => updateShipping('phone', v)}
                    error={errors.phone}
                    icon={<Phone size={15} />}
                  />
                  <Field
                    label="Street Address" id="address" required
                    value={shippingData.address}
                    onChange={v => updateShipping('address', v)}
                    error={errors.address}
                    icon={<MapPin size={15} />}
                    span={2}
                  />
                  <Field
                    label="Apt / Suite (optional)" id="apt"
                    value={shippingData.apt}
                    onChange={v => updateShipping('apt', v)}
                    span={2}
                  />
                  <Field
                    label="City" id="city" required
                    value={shippingData.city}
                    onChange={v => updateShipping('city', v)}
                    error={errors.city}
                  />
                  <Field
                    label="State" id="state" required
                    value={shippingData.state}
                    onChange={v => updateShipping('state', v)}
                    error={errors.state}
                  />
                  <Field
                    label="ZIP Code" id="zip" required
                    value={shippingData.zip}
                    onChange={v => updateShipping('zip', v)}
                    error={errors.zip}
                  />
                  <div className={styles.fieldWrap}>
                    <label htmlFor="country" className={styles.label}>Country</label>
                    <select
                      id="country"
                      className={styles.input}
                      value={shippingData.country}
                      onChange={e => updateShipping('country', e.target.value)}
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>

                {/* Shipping method */}
                <h3 className={styles.subSectionTitle}>
                  <Truck size={16} /> Shipping Method
                </h3>
                <div className={styles.shippingOptions}>
                  {[
                    {
                      id: 'standard',
                      label: 'Standard Shipping',
                      desc: '5–7 business days',
                      price: subtotal >= 100 ? 'FREE' : '$7.95',
                    },
                    {
                      id: 'express',
                      label: 'Express Shipping',
                      desc: '2–3 business days',
                      price: '$14.95',
                    },
                  ].map(opt => (
                    <label
                      key={opt.id}
                      className={`${styles.shippingOption} ${shippingMethod === opt.id ? styles.shippingOptionActive : ''}`}
                      htmlFor={`ship-${opt.id}`}
                    >
                      <input
                        type="radio"
                        id={`ship-${opt.id}`}
                        name="shippingMethod"
                        value={opt.id}
                        checked={shippingMethod === opt.id}
                        onChange={() => setShippingMethod(opt.id)}
                        className={styles.radioInput}
                      />
                      <div className={styles.shippingOptionBody}>
                        <strong className={styles.shippingOptionLabel}>{opt.label}</strong>
                        <span className={styles.shippingOptionDesc}>{opt.desc}</span>
                      </div>
                      <span className={styles.shippingOptionPrice}>{opt.price}</span>
                    </label>
                  ))}
                </div>
              </section>
            )}

            {/* ── STEP 1: Payment ── */}
            {step === 1 && (
              <section className={styles.formSection} aria-labelledby="payment-heading">
                <h2 className={styles.formSectionTitle} id="payment-heading">
                  <CreditCard size={18} className={styles.formSectionIcon} />
                  Payment Details
                </h2>

                <div className={styles.secureNotice}>
                  <Lock size={14} />
                  <span>Your payment info is encrypted and never stored.</span>
                </div>

                <div className={styles.formGrid}>
                  <Field
                    label="Cardholder Name" id="cardName" required
                    value={paymentData.cardName}
                    onChange={v => updatePayment('cardName', v)}
                    error={errors.cardName}
                    icon={<User size={15} />}
                    span={2}
                    placeholder="As it appears on your card"
                  />
                  <Field
                    label="Card Number" id="cardNumber" required
                    value={paymentData.cardNumber}
                    onChange={v => updatePayment('cardNumber', formatCardNumber(v))}
                    error={errors.cardNumber}
                    icon={<CreditCard size={15} />}
                    span={2}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  <Field
                    label="Expiry Date" id="expiry" required
                    value={paymentData.expiry}
                    onChange={v => updatePayment('expiry', formatExpiry(v))}
                    error={errors.expiry}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  <Field
                    label="CVV" id="cvv" required
                    value={paymentData.cvv}
                    onChange={v => updatePayment('cvv', v.replace(/\D/g, '').slice(0, 4))}
                    error={errors.cvv}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>

                {/* Billing same as shipping */}
                <label className={styles.checkRow}>
                  <input type="checkbox" defaultChecked className={styles.checkbox} />
                  <span>Billing address same as shipping</span>
                </label>
              </section>
            )}

            {/* ── STEP 2: Review ── */}
            {step === 2 && (
              <section className={styles.formSection} aria-labelledby="review-heading">
                <h2 className={styles.formSectionTitle} id="review-heading">
                  <Package size={18} className={styles.formSectionIcon} />
                  Review Your Order
                </h2>

                {/* Shipping summary */}
                <div className={styles.reviewBlock}>
                  <div className={styles.reviewBlockHeader}>
                    <h3>Shipping to</h3>
                    <button
                      className={styles.editBtn}
                      onClick={() => setStep(0)}
                      aria-label="Edit shipping address"
                    >
                      Edit
                    </button>
                  </div>
                  <p className={styles.reviewText}>
                    {shippingData.firstName} {shippingData.lastName}<br />
                    {shippingData.address}{shippingData.apt ? `, ${shippingData.apt}` : ''}<br />
                    {shippingData.city}, {shippingData.state} {shippingData.zip}<br />
                    {shippingData.email}
                  </p>
                </div>

                {/* Payment summary */}
                <div className={styles.reviewBlock}>
                  <div className={styles.reviewBlockHeader}>
                    <h3>Payment</h3>
                    <button
                      className={styles.editBtn}
                      onClick={() => setStep(1)}
                      aria-label="Edit payment"
                    >
                      Edit
                    </button>
                  </div>
                  <p className={styles.reviewText}>
                    {paymentData.cardName}<br />
                    •••• •••• •••• {paymentData.cardNumber.slice(-4) || '****'}
                  </p>
                </div>

                {/* Items */}
                <div className={styles.reviewBlock}>
                  <h3>Items ({items.length})</h3>
                  <div className={styles.reviewItems}>
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className={styles.reviewItem}>
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className={styles.reviewItemImg}
                        />
                        <div className={styles.reviewItemInfo}>
                          <span className={styles.reviewItemName}>{product.name}</span>
                          <span className={styles.reviewItemQty}>Qty: {quantity}</span>
                        </div>
                        <span className={styles.reviewItemPrice}>
                          ${(product.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className={styles.termsNote}>
                  By placing your order you agree to our{' '}
                  <a href="#" className={styles.termsLink}>Terms of Service</a> and{' '}
                  <a href="#" className={styles.termsLink}>Privacy Policy</a>.
                </p>
              </section>
            )}

            {/* ── Navigation buttons ── */}
            <div className={styles.formNav}>
              {step > 0 && (
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => { setStep(s => s - 1); setErrors({}) }}
                >
                  ← Back
                </Button>
              )}
              {step < 2 ? (
                <Button variant="primary" size="lg" onClick={handleNext}>
                  Continue to {STEPS[step + 1]}
                  <ChevronRight size={18} />
                </Button>
              ) : (
                <Button variant="primary" size="lg" onClick={handlePlaceOrder}>
                  <Lock size={16} />
                  Place Order · ${orderTotal.toFixed(2)}
                </Button>
              )}
            </div>
          </div>

          {/* ══════════════════════════════
              ORDER SIDEBAR
          ══════════════════════════════ */}
          <aside className={styles.orderSummary} aria-label="Order summary">
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <ul className={styles.summaryItems}>
              {items.map(({ product, quantity }) => (
                <li key={product.id} className={styles.summaryItem}>
                  <div className={styles.summaryItemImgWrap}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className={styles.summaryItemImg}
                    />
                    <span className={styles.summaryItemQtyBadge}>{quantity}</span>
                  </div>
                  <span className={styles.summaryItemName}>{product.name}</span>
                  <span className={styles.summaryItemPrice}>
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.summaryDivider} />

            <dl className={styles.summaryTotals}>
              <div className={styles.summaryRow}>
                <dt>Subtotal</dt>
                <dd>${subtotal.toFixed(2)}</dd>
              </div>
              {discount > 0 && (
                <div className={`${styles.summaryRow} ${styles.discount}`}>
                  <dt>Discount ({Math.round(promoDiscount * 100)}%)</dt>
                  <dd>−${discount.toFixed(2)}</dd>
                </div>
              )}
              <div className={styles.summaryRow}>
                <dt>Shipping</dt>
                <dd>
                  {shippingCost === 0
                    ? <span className={styles.free}>FREE</span>
                    : `$${shippingCost.toFixed(2)}`}
                </dd>
              </div>
            </dl>

            <div className={styles.summaryDivider} />

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <strong>${orderTotal.toFixed(2)}</strong>
            </div>

            <div className={styles.summarySecure}>
              <Lock size={12} />
              <span>256-bit SSL encryption</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

/* ── Field component ── */
function Field({
  label, id, type = 'text', value, onChange, error,
  icon, placeholder, span, required, maxLength,
}) {
  return (
    <div
      className={styles.fieldWrap}
      style={span ? { gridColumn: `span ${span}` } : undefined}
    >
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.req} aria-hidden="true">*</span>}
      </label>
      <div className={`${styles.inputWrap} ${error ? styles.inputWrapError : ''}`}>
        {icon && <span className={styles.inputIcon} aria-hidden="true">{icon}</span>}
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${styles.input} ${icon ? styles.inputWithIcon : ''}`}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className={styles.fieldError} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
