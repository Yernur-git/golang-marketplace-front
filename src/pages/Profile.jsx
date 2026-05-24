import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMe, getUserListings, updateProfile } from '../api/api'
import ListingCard from '../components/ListingCard'
import './Profile.css'

function Profile() {
  const [user, setUser] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editError, setEditError] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const userData = await getMe()
      setUser(userData)
      setEditName(userData.name)
      setEditPhone(userData.phone || '')

      const listingsData = await getUserListings(userData.id)
      setListings(listingsData.listings || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault()
    setEditError('')
    try {
      const updated = await updateProfile({
        name: editName.trim(),
        phone: editPhone.trim(),
      })
      setUser(updated)
      setEditing(false)
    } catch (err) {
      setEditError(err.message)
    }
  }

  if (loading) return <div className="loading">Loading profile...</div>
  if (!user) return <div className="loading">Could not load profile</div>

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          {editing ? (
            <form onSubmit={handleEditSubmit} className="profile-edit-form">
              {editError && <p className="error-msg">{editError}</p>}
              <div className="form-group">
                <label>Name</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn btn-primary btn-sm">Save</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-email">{user.email}</p>
              {user.phone && <p className="profile-phone">{user.phone}</p>}
              <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)} style={{ marginTop: '12px' }}>
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      <div className="profile-listings">
        <div className="profile-listings-header">
          <h2>My Listings ({listings.length})</h2>
          <Link to="/listings/new" className="btn btn-accent btn-sm">Post New Item</Link>
        </div>

        {listings.length > 0 ? (
          <div className="listings-grid">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>You haven't posted any listings yet.</p>
            <Link to="/listings/new" className="btn btn-accent">Post Your First Item</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
