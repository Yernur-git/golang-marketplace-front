import { useState } from 'react'
import './StarRating.css'

function StarRating({ value = 0, onChange, size = 20, readonly = false }) {
  const [hover, setHover] = useState(0)

  return (
    <div className={`star-rating ${readonly ? 'star-readonly' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${star <= (hover || value) ? 'star-filled' : ''}`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          disabled={readonly}
          style={{ width: size, height: size }}
        >
          <svg viewBox="0 0 24 24" width={size} height={size}>
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              fill={star <= (hover || value) ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  )
}

export default StarRating
