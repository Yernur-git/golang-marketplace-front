import { Link } from 'react-router-dom'
import CategoryIcon from './CategoryIcon'
import './ListingCard.css'

const API_BASE = 'http://localhost:8080'

function ListingCard({ listing, index = 0 }) {
  function formatPrice(price) {
    return new Intl.NumberFormat('en-US').format(price) + ' ₸'
  }

  function timeAgo(dateStr) {
    if (!dateStr) return ''
    const now = new Date()
    const date = new Date(dateStr)
    const diff = Math.floor((now - date) / 1000)
    if (diff < 60) return 'just now'
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago'
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  const delay = Math.min(index * 0.06, 0.4)
  const hasImage = listing.image_url && listing.image_url !== ''

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="lcard"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="lcard-visual">
        {hasImage ? (
          <img
            src={`${API_BASE}${listing.image_url}`}
            alt={listing.title}
            className="lcard-img"
          />
        ) : (
          <span className="lcard-icon">
            <CategoryIcon name={listing.category?.name} size={48} />
          </span>
        )}
        <div className="lcard-visual-shine"></div>
      </div>

      <div className="lcard-body">
        {listing.category?.name && (
          <span className="lcard-cat">{listing.category.name}</span>
        )}
        <h3 className="lcard-title">{listing.title}</h3>
        <div className="lcard-bottom">
          <span className="lcard-price">{formatPrice(listing.price)}</span>
          <span className="lcard-meta">
            {listing.location && <span>{listing.location}</span>}
            {listing.created_at && <span>{timeAgo(listing.created_at)}</span>}
          </span>
        </div>
      </div>

      {listing.status && listing.status !== 'active' && (
        <div className={`lcard-badge status-badge status-${listing.status}`}>
          {listing.status}
        </div>
      )}
    </Link>
  )
}

export default ListingCard
