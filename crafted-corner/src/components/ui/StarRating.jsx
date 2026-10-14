import React from 'react'
import { Star } from 'lucide-react'
import styles from './StarRating.module.css'

export default function StarRating({ rating, reviewCount, size = 14 }) {
  const full  = Math.floor(rating)
  const half  = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)

  return (
    <div className={styles.wrapper} aria-label={`${rating} out of 5 stars`}>
      <div className={styles.stars}>
        {Array.from({ length: full  }).map((_, i) => (
          <Star key={`f${i}`} size={size} className={styles.filled} />
        ))}
        {half && (
          <span className={styles.halfWrap} style={{ width: size, height: size }}>
            <Star size={size} className={styles.filled} style={{ clipPath: 'inset(0 50% 0 0)' }} />
            <Star size={size} className={styles.empty}  style={{ position:'absolute', top:0, left:0 }} />
          </span>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e${i}`} size={size} className={styles.empty} />
        ))}
      </div>
      {reviewCount != null && (
        <span className={styles.count}>({reviewCount.toLocaleString()})</span>
      )}
    </div>
  )
}
