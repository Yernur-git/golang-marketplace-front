import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getListingById, getReviews, createReview, deleteListing, isLoggedIn, getMe } from '../api/api'
import CategoryIcon from '../components/CategoryIcon'
import StarRating from '../components/StarRating'
import './ListingDetail.css'

const API_BASE = 'http://localhost:8080'

function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  const [reviewAuthor, setReviewAuthor] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    getListingById(id)
      .then((data) => {
        setListing(data.listing || data)
        setReviews(data.reviews || [])
      })
      .catch(() => navigate('/listings'))
      .finally(() => setLoading(false))

    if (isLoggedIn()) {
      getMe().then(setCurrentUser).catch(() => {})
    }
  }, [id])

  function formatPrice(price) {
    return new Intl.NumberFormat('ru-KZ', {
      style: 'currency',
      currency: 'KZT',
      maximumFractionDigits: 0,
    }).format(price)
  }

  function avgRating() {
    if (!reviews.length) return 0
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  }

  async function handleReviewSubmit(e) {
    e.preventDefault()
    setReviewError('')

    if (!reviewAuthor.trim()) {
      setReviewError('Please enter your name')
      return
    }

    try {
      const newReview = await createReview({
        listing_id: parseInt(id),
        author: reviewAuthor.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
      })
      setReviews([...reviews, newReview])
      setReviewAuthor('')
      setReviewComment('')
      setReviewRating(5)
    } catch (err) {
      setReviewError(err.message)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    try {
      await deleteListing(id)
      navigate('/profile')
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!listing) return <div className="loading">Listing not found</div>

  const isOwner = currentUser && currentUser.id === listing.user_id
  const hasImage = listing.image_url && listing.image_url !== ''

  return (
    <div className="detail-page">
      <div className="detail-main">
        <div className="detail-image">
          {hasImage ? (
            <img
              src={`${API_BASE}${listing.image_url}`}
              alt={listing.title}
              className="detail-img"
            />
          ) : (
            <span className="detail-icon">
              <CategoryIcon name={listing.category?.name} size={80} />
            </span>
          )}
        </div>

        <div className="detail-info">
          <div className="detail-category">{listing.category?.name || 'Other'}</div>
          <h1 className="detail-title">{listing.title}</h1>
          <div className="detail-price">{formatPrice(listing.price)}</div>
          <span className={`status-badge status-${listing.status}`}>{listing.status}</span>

          {reviews.length > 0 && (
            <div className="detail-rating">
              <StarRating value={Math.round(avgRating())} readonly size={18} />
              <span className="detail-rating-text">
                {avgRating().toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}

          {listing.description && (
            <div className="detail-description">
              <h3>Description</h3>
              <p>{listing.description}</p>
            </div>
          )}

          {listing.location && (
            <div className="detail-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {listing.location}
            </div>
          )}

          {isOwner && (
            <div className="detail-owner-actions">
              <Link to={`/listings/${listing.id}/edit`} className="btn btn-primary btn-sm">Edit Listing</Link>
              <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete Listing</button>
            </div>
          )}
        </div>
      </div>

      <div className="detail-sidebar">
        <div className="seller-card">
          <h3>Seller</h3>
          <p className="seller-name">{listing.user?.name || 'Unknown'}</p>
          {listing.user?.phone && <p className="seller-phone">{listing.user.phone}</p>}
          {listing.user?.email && <p className="seller-email">{listing.user.email}</p>}
          {listing.user?.id && (
            <Link to={`/listings?user_id=${listing.user.id}`} className="btn btn-outline btn-sm" style={{ marginTop: '12px' }}>
              View all listings
            </Link>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <h2>Reviews ({reviews.length})</h2>

        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <strong>{review.author}</strong>
                  <StarRating value={review.rating} readonly size={16} />
                </div>
                {review.comment && <p className="review-comment">{review.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-reviews">No reviews yet.</p>
        )}

        <div className="review-form">
          <h3>Leave a Review</h3>
          {reviewError && <p className="error-msg">{reviewError}</p>}
          <form onSubmit={handleReviewSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                value={reviewAuthor}
                onChange={(e) => setReviewAuthor(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group">
              <label>Rating</label>
              <StarRating value={reviewRating} onChange={setReviewRating} size={24} />
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write your review..."
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ListingDetail
