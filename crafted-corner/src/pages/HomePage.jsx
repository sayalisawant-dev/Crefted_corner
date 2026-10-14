import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Heart, Users, Leaf, Star,
  ChevronRight, Quote, Send
} from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import QuickViewModal from '../components/ui/QuickViewModal'
import Button from '../components/ui/Button'
import StarRating from '../components/ui/StarRating'
import { products, categories, testimonials, benefits, artisans } from '../data/products'
import styles from './HomePage.module.css'

const BENEFIT_ICONS = { Heart, Users, Leaf, Star }

const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8)

export default function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const navigate = useNavigate()

  function handleNewsletter(e) {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <div className={styles.page}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className={styles.hero} aria-label="Hero">
        <div className={styles.heroBg} aria-hidden="true" />

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
            <span className={styles.heroEyebrow}>
              <span className={styles.heroDot} />
              Handmade · Unique · Ethical
            </span>

            <h1 className={`display-heading ${styles.heroHeading}`}>
              Handmade with heart by Payal Awate,<br />
              <em className={styles.heroAccent}>made for your home.</em>
            </h1>

            <p className={styles.heroSub}>
              Discover one-of-a-kind pieces crafted by independent artisans — from
              ceramics and jewelry to art and accessories. Every item tells a story.
            </p>

            <div className={styles.heroCtas}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/products')}
              >
                Shop Collection
                <ArrowRight size={18} />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/products')}
              >
                Explore Categories
              </Button>
            </div>

            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <strong>4,200+</strong>
                <span>Handmade items</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <strong>380+</strong>
                <span>Independent artisans</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <strong>98%</strong>
                <span>Happy customers</span>
              </div>
            </div>
          </div>

          <div className={styles.heroImageGrid} aria-hidden="true">
            <div className={styles.heroImgMain}>
              <img
                src="https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=700&h=800&fit=crop"
                alt="Handmade ceramic pieces"
              />
              <div className={styles.heroImgBadge}>
                <span>🏆</span>
                <div>
                  <strong>Top Rated</strong>
                  <p>4.9 / 5 avg</p>
                </div>
              </div>
            </div>
            <div className={styles.heroImgStack}>
              <div className={styles.heroImgSmall}>
                <img
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop"
                  alt="Handmade jewelry"
                />
              </div>
              <div className={styles.heroImgSmall}>
                <img
                  src="https://images.unsplash.com/photo-1589740903377-9e7b8beedf52?w=300&h=300&fit=crop"
                  alt="Handmade leather journal"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRUST BAR
      ══════════════════════════════════════ */}
      <div className={styles.trustBar}>
        <div className={`container ${styles.trustInner}`}>
          {[
            { emoji: '🚚', text: 'Free shipping on orders over $100' },
            { emoji: '🎁', text: 'Gift wrapping available' },
            { emoji: '↩️', text: '30-day hassle-free returns' },
            { emoji: '🔒', text: 'Secure checkout' },
          ].map(({ emoji, text }) => (
            <div key={text} className={styles.trustItem}>
              <span className={styles.trustEmoji}>{emoji}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════ */}
      <section className={`section ${styles.categoriesSection}`} aria-labelledby="cats-heading">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title" id="cats-heading">Explore Categories</h2>
              <p className="section-subtitle">
                Browse by craft — every category is packed with one-of-a-kind finds.
              </p>
            </div>
            <Link to="/products" className={styles.seeAll}>
              View all <ChevronRight size={16} />
            </Link>
          </div>

          <div className={styles.categoriesGrid}>
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className={styles.categoryCard}
                style={{ '--delay': `${i * 60}ms` }}
                aria-label={`Browse ${cat.label}`}
              >
                <div className={styles.catImageWrap}>
                  <img
                    src={getCategoryImage(cat.id)}
                    alt={cat.label}
                    className={styles.catImage}
                    loading="lazy"
                  />
                  <div className={styles.catOverlay} aria-hidden="true" />
                </div>
                <div className={styles.catBody}>
                  <span className={styles.catEmoji} aria-hidden="true">{cat.icon}</span>
                  <div>
                    <h3 className={styles.catLabel}>{cat.label}</h3>
                    <p className={styles.catDesc}>{cat.description}</p>
                  </div>
                  <ChevronRight size={18} className={styles.catArrow} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════ */}
      <section className={`section ${styles.productsSection}`} aria-labelledby="featured-heading">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title" id="featured-heading">Featured Products</h2>
              <div className="divider" />
              <p className="section-subtitle">
                Handpicked favourites — the pieces our community loves most.
              </p>
            </div>
            <Link to="/products" className={styles.seeAll}>
              Shop all <ChevronRight size={16} />
            </Link>
          </div>

          <div className={styles.productsGrid}>
            {featuredProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>

          <div className={styles.browseMore}>
            <Button variant="secondary" size="lg" onClick={() => navigate('/products')}>
              Browse all products
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ARTISAN SPOTLIGHT
      ══════════════════════════════════════ */}
      <section className={`section ${styles.spotlightSection}`} aria-labelledby="artisan-heading">
        <div className="container">
          <div className={styles.spotlightGrid}>
            <div className={styles.spotlightText}>
              <span className={styles.eyebrow}>Artisan Spotlight</span>
              <h2 className="section-title" id="artisan-heading">Meet the makers<br />behind the craft</h2>
              <div className="divider" />
              <p className={styles.spotlightBody}>
                Every item on Crafted Corner is made by a real person. We showcase the 
                stories, studios, and skills of our independent artisans so you can 
                connect with the craft on a deeper level.
              </p>
              <Button variant="primary" size="md" onClick={() => navigate('/products')}>
                Shop by artisan <ArrowRight size={16} />
              </Button>
            </div>
            <div className={styles.artisanCards}>
              {artisans.slice(0, 3).map(artisan => (
                <div key={artisan.id} className={styles.artisanCard}>
                  <img src={artisan.avatar} alt={artisan.name} className={styles.artisanAvatar} />
                  <div className={styles.artisanInfo}>
                    <strong className={styles.artisanName}>{artisan.name}</strong>
                    <span className={styles.artisanSpecialty}>{artisan.specialty}</span>
                    <span className={styles.artisanLocation}>{artisan.location}</span>
                  </div>
                  <div className={styles.artisanMeta}>
                    <StarRating rating={artisan.rating} size={12} />
                    <span className={styles.artisanSales}>{artisan.sales.toLocaleString()} sales</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY HANDMADE
      ══════════════════════════════════════ */}
      <section className={`section ${styles.benefitsSection}`} aria-labelledby="benefits-heading">
        <div className="container">
          <div className={styles.benefitsHeader}>
            <h2 className="section-title" id="benefits-heading">Why handmade?</h2>
            <div className="divider" />
            <p className="section-subtitle">
              There's something irreplaceable about a piece made by human hands.
            </p>
          </div>

          <div className={styles.benefitsGrid}>
            {benefits.map((b, i) => {
              const Icon = BENEFIT_ICONS[b.icon]
              return (
                <div key={i} className={styles.benefitCard}>
                  <div className={styles.benefitIcon} aria-hidden="true">
                    {Icon && <Icon size={24} />}
                  </div>
                  <h3 className={styles.benefitTitle}>{b.title}</h3>
                  <p className={styles.benefitDesc}>{b.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className={`section ${styles.testimonialsSection}`} aria-labelledby="testimonials-heading">
        <div className="container">
          <div className={styles.benefitsHeader}>
            <h2 className="section-title" id="testimonials-heading">Loved by our community</h2>
            <div className="divider" />
            <p className="section-subtitle">
              Real stories from real customers who found something special.
            </p>
          </div>

          <div className={styles.testimonialsGrid}>
            {testimonials.map(t => (
              <blockquote key={t.id} className={styles.testimonialCard}>
                <Quote size={28} className={styles.quoteIcon} aria-hidden="true" />
                <p className={styles.testimonialText}>"{t.text}"</p>
                <footer className={styles.testimonialFooter}>
                  <img src={t.avatar} alt={t.name} className={styles.testimonialAvatar} />
                  <div>
                    <cite className={styles.testimonialName}>{t.name}</cite>
                    <span className={styles.testimonialLocation}>{t.location}</span>
                    <StarRating rating={t.rating} size={12} />
                  </div>
                  <span className={styles.testimonialProduct}>{t.product}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════ */}
      <section className={styles.newsletterSection} aria-labelledby="newsletter-heading">
        <div className="container">
          <div className={styles.newsletterBox}>
            <div className={styles.newsletterText}>
              <h2 className="section-title" id="newsletter-heading" style={{ color: '#fff' }}>
                New drops, straight to your inbox
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem', fontSize: '1rem' }}>
                Be the first to hear about new artisans, seasonal collections, and exclusive offers.
              </p>
            </div>

            {subscribed ? (
              <div className={styles.subscribedMsg}>
                <span>🎉</span>
                <strong>You're in! Welcome to the Crafted Corner community.</strong>
              </div>
            ) : (
              <form className={styles.newsletterForm} onSubmit={handleNewsletter} role="form">
                <label htmlFor="hero-email" className="sr-only">Your email address</label>
                <input
                  id="hero-email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={styles.newsletterInput}
                  aria-label="Email address for newsletter"
                />
                <button type="submit" className={styles.newsletterBtn}>
                  <Send size={16} />
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  )
}

function getCategoryImage(id) {
  const map = {
    'home-decor':  'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&h=400&fit=crop',
    'jewelry':     'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop',
    'gifts':       'https://images.unsplash.com/photo-1589740903377-9e7b8beedf52?w=600&h=400&fit=crop',
    'art':         'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&h=400&fit=crop',
    'accessories': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=400&fit=crop',
  }
  return map[id] ?? 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&h=400&fit=crop'
}
