import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getListingById, updateListing, getCategories, uploadListingImage } from '../api/api'
import './CreateListing.css'

const API_BASE = 'http://localhost:8080'

function EditListing() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    Promise.all([getListingById(id), getCategories()])
      .then(([listingData, categoriesData]) => {
        const l = listingData.listing || listingData
        setTitle(l.title || '')
        setDescription(l.description || '')
        setPrice(String(l.price || ''))
        setCategoryId(String(l.category_id || ''))
        setLocation(l.location || '')
        if (l.image_url) setImagePreview(`${API_BASE}${l.image_url}`)
        setCategories(categoriesData || [])
      })
      .catch(() => navigate('/profile'))
      .finally(() => setPageLoading(false))
  }, [id])

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!title.trim()) { setError('Title is required'); return }
    if (!price || parseFloat(price) <= 0) { setError('Please enter a valid price'); return }
    if (!categoryId) { setError('Please select a category'); return }

    setLoading(true)
    try {
      await updateListing(id, {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category_id: parseInt(categoryId),
        location: location.trim(),
      })

      if (imageFile) {
        setUploading(true)
        await uploadListingImage(id, imageFile)
        setUploading(false)
      }

      navigate(`/listings/${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) return <div className="loading">Loading...</div>

  return (
    <div className="create-page">
      <div className="create-card">
        <h1 className="create-title">Edit Listing</h1>
        <p className="create-subtitle">Update your listing details</p>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Image</label>
            <div className="image-upload" onClick={() => fileRef.current?.click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="image-upload-preview" />
              ) : (
                <div className="image-upload-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>Click to upload photo</span>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Canon EOS R5 Body Only"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your item, condition, what's included..."
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (KZT)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 500000"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Almaty"
            />
          </div>

          <button type="submit" className="btn btn-accent" disabled={loading || uploading} style={{ width: '100%', padding: '14px' }}>
            {uploading ? 'Uploading image...' : loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditListing
