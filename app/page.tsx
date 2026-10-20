'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import {
  Building2, MapPin, LogIn, LogOut, Shield, User,
  Plus, Home, Briefcase, Trees, X, Eye, EyeOff,
  AlertCircle, CheckCircle, Clock, Phone, Mail,
  IndianRupee, Maximize2, ChevronDown, ChevronUp,
  Users, ListFilter
} from 'lucide-react'
import type { Profile, Property } from '@/lib/types'
import { FeaturedBoard } from './FeaturedStrips'
import { LiveStatsPanel } from './LiveStatsPanel'

// ─── TICKER ───────────────────────────────────────────────
function Ticker({ items }: { items: { label: string; badge: string; color: string }[] }) {
  if (!items.length) return null
  const doubled = [...items, ...items]
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="ticker-item">
            {item.label}
            <span className={item.color === 'green' ? 'badge-green' : 'badge'}>
              {item.badge}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── LOGIN MODAL ──────────────────────────────────────────
function LoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }
    onSuccess()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <div style={{
              width: '52px', height: '52px', background: 'rgba(255,255,255,0.15)',
              borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Building2 size={28} color="white" />
            </div>
          </div>
          <h2>Sign In</h2>
          <p>Bhavishya Developers · Members Portal</p>
        </div>
        <div className="modal-body">
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={15} /> {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input-icon">
                <Mail size={16} className="icon" />
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-icon" style={{ position: 'relative' }}>
                <Mail size={16} className="icon" style={{ display: 'none' }} />
                <input
                  className="form-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: '14px', paddingRight: '40px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: '#9CA3AF'
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-full btn-blue" disabled={loading}>
              {loading ? <><div className="spinner" /> Signing in...</> : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748B', marginTop: '16px' }}>
            Not a member?{' '}
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: '700', cursor: 'pointer' }}
            >
              Request Access
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── ENROLL MODAL ─────────────────────────────────────────
function EnrollModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', whatsapp: '', area: '', password: '', confirm_password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name, phone: form.phone } }
    })
    if (err) { setError(err.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').update({
        full_name: form.full_name,
        phone: form.phone,
        whatsapp: form.whatsapp || form.phone,
        area: form.area,
      }).eq('id', data.user.id)
    }
    setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Registration Submitted!</h2>
          <p>Bhavishya Developers · Members Portal</p>
        </div>
        <div className="modal-body" style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px', height: '64px', background: '#D1FAE5', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
          }}>
            <CheckCircle size={32} color="#10B981" />
          </div>
          <p style={{ color: '#374151', marginBottom: '8px', fontWeight: '600' }}>
            Your membership request has been received.
          </p>
          <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '24px' }}>
            Admin will review and approve your account. You will be able to login once approved.
          </p>
          <button className="btn-full btn-blue" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div />
            <div style={{ textAlign: 'center' }}>
              <h2>Enroll as Member</h2>
              <p>Fill your details to join the portal</p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error"><AlertCircle size={15} />{error}</div>}
          <form onSubmit={handleSubmit}>
            {[
              { name: 'full_name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
              { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
              { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210' },
              { name: 'whatsapp', label: 'WhatsApp (if different)', type: 'tel', placeholder: 'Same as phone if blank' },
              { name: 'area', label: 'Area / Location', type: 'text', placeholder: 'e.g. K R Puram, Bengaluru' },
              { name: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters' },
              { name: 'confirm_password', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
            ].map(field => (
              <div className="form-group" key={field.name}>
                <label className="form-label">{field.label}</label>
                <input
                  className="form-input"
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  required={field.name !== 'whatsapp'}
                />
              </div>
            ))}
            <button type="submit" className="btn-full btn-blue" disabled={loading}>
              {loading ? <><div className="spinner" />Submitting...</> : 'Submit Enrollment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── PROPERTY CARD ────────────────────────────────────────
function PropertyCard({ property }: { property: Property }) {
  const typeClass = {
    residential: 'badge-residential',
    commercial: 'badge-commercial',
    land: 'badge-land',
  }[property.property_type] || 'badge-residential'

  const typeLabel = {
    residential: 'Residential',
    commercial: 'Commercial',
    land: 'Land / Plot',
  }[property.property_type]

  const formatPrice = (price?: number) => {
    if (!price) return 'Price on Request'
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`
    return `₹${price.toLocaleString('en-IN')}`
  }

  return (
    <div className="property-card">
      <div className="property-card-img">
        {property.cover_image_url ? (
          <img src={property.cover_image_url} alt={property.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Building2 size={48} color="rgba(255,255,255,0.4)" />
        )}
      </div>
      <div className="property-card-body">
        <span className={`property-type-badge ${typeClass}`}>{typeLabel}</span>
        <div className="property-card-title">{property.title}</div>
        <div className="property-card-location">
          <MapPin size={13} /> {property.location}
        </div>
        <div className="property-card-price">{formatPrice(property.price)}</div>
        {property.area_sqft && (
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Maximize2 size={12} /> {property.area_sqft.toLocaleString()} sq.ft
            {property.facing && ` · ${property.facing} facing`}
          </div>
        )}
      </div>
      <div className="property-card-footer">
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <User size={12} /> {property.profiles?.full_name || 'Member'}
        </span>
        <span className={`status-badge status-${property.status}`}>
          {property.status}
        </span>
      </div>
    </div>
  )
}

// ─── ADD PROPERTY MODAL ───────────────────────────────────
function AddPropertyModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    title: '', property_type: 'residential', location: '',
    area_sqft: '', price: '', facing: '', description: '', price_negotiable: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not logged in.'); setLoading(false); return }

    const { error: err } = await supabase.from('properties').insert({
      member_id: user.id,
      title: form.title,
      property_type: form.property_type,
      location: form.location,
      area_sqft: form.area_sqft ? parseFloat(form.area_sqft) : null,
      price: form.price ? parseFloat(form.price) : null,
      facing: form.facing || null,
      description: form.description || null,
      price_negotiable: form.price_negotiable,
      status: 'pending',
    })

    if (err) { setError(err.message); setLoading(false); return }
    onSuccess()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div />
            <div style={{ textAlign: 'center' }}>
              <h2>List a Property</h2>
              <p>Fill details to list your property</p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error"><AlertCircle size={15} />{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Property Title *</label>
              <input className="form-input" placeholder="e.g. 3BHK Apartment in Whitefield"
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Property Type *</label>
              <select className="form-input" value={form.property_type}
                onChange={e => setForm({ ...form, property_type: e.target.value })}>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land / Plot</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input className="form-input" placeholder="e.g. Whitefield, Bengaluru"
                value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Area (sq.ft)</label>
                <input className="form-input" type="number" placeholder="e.g. 1200"
                  value={form.area_sqft} onChange={e => setForm({ ...form, area_sqft: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Facing</label>
                <select className="form-input" value={form.facing}
                  onChange={e => setForm({ ...form, facing: e.target.value })}>
                  <option value="">Select</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="North-East">North-East</option>
                  <option value="North-West">North-West</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input className="form-input" type="number" placeholder="e.g. 5000000"
                value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '13px', color: '#374151', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.price_negotiable}
                  onChange={e => setForm({ ...form, price_negotiable: e.target.checked })} />
                Price is negotiable
              </label>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} placeholder="Additional details about the property..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ resize: 'vertical' }} />
            </div>
            <button type="submit" className="btn-full btn-blue" disabled={loading}>
              {loading ? <><div className="spinner" />Submitting...</> : 'Submit Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────
export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [members, setMembers] = useState<Profile[]>([])
  const [activeTab, setActiveTab] = useState('properties')
  const [showLogin, setShowLogin] = useState(false)
  const [showEnroll, setShowEnroll] = useState(false)
  const [showAddProperty, setShowAddProperty] = useState(false)
  const [tickerItems, setTickerItems] = useState<{ label: string; badge: string; color: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [showMembersGrid, setShowMembersGrid] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [enrollmentForm, setEnrollmentForm] = useState({
  full_name: '',
  email: '',
  phone: '',
  whatsapp: '',
  area: '',
  address: '',
  password: '',
  confirm_password: '',
})

const [enrollmentLoading, setEnrollmentLoading] = useState(false)
const [enrollmentError, setEnrollmentError] = useState('')
const [enrollmentSuccess, setEnrollmentSuccess] = useState(false)
const [currentTime, setCurrentTime] = useState<Date | null>(null)
const [isDarkMode, setIsDarkMode] = useState(false)

useEffect(() => {
  const supabase = createClient()
  const updateClock = () => setCurrentTime(new Date())
  updateClock()

  const timer = window.setInterval(updateClock, 1000)
  return () => window.clearInterval(timer)
}, [])

useEffect(() => {
  document.documentElement.classList.toggle('theme-dark', isDarkMode)
}, [isDarkMode])


  const supabase = createClient()

  // Load session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Load profile when user changes
  useEffect(() => {
    if (!user) { setProfile(null); setLoading(false); return }
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => { setProfile(data); setLoading(false) })
  }, [user])

  // Load properties
  useEffect(() => {
    if (!user) return
    const query = profile?.role === 'admin'
      ? supabase.from('properties').select('*, profiles(full_name, area)').order('created_at', { ascending: false })
      : supabase.from('properties').select('*, profiles(full_name, area)')
          .eq('status', 'approved').order('created_at', { ascending: false })
    query.then(({ data }) => setProperties(data || []))
  }, [user, profile])

  // Load members (admin only)
  useEffect(() => {
    if (profile?.role !== 'admin') return
    supabase.from('profiles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setMembers(data || []))
  }, [profile])

  // Build ticker
  useEffect(() => {
    const items: { label: string; badge: string; color: string }[] = []
    properties.slice(0, 10).forEach(p => {
      items.push({
        label: `🏠 ${p.title} · ${p.location}`,
        badge: p.price
          ? p.price >= 10000000
            ? `₹${(p.price / 10000000).toFixed(1)}Cr`
            : `₹${(p.price / 100000).toFixed(0)}L`
          : 'POA',
        color: 'blue'
      })
    })
    members.slice(0, 10).forEach(m => {
      items.push({ label: `👤 ${m.full_name} · ${m.area || 'Member'}`, badge: m.status, color: m.status === 'approved' ? 'green' : 'blue' })
    })
    if (!items.length) {
      items.push({ label: '🏢 Bhavishya Developers — Members Portal', badge: 'LIVE', color: 'blue' })
      items.push({ label: '📝 Enroll as a member to list your properties', badge: 'JOIN', color: 'green' })
    }
    setTickerItems(items)
  }, [properties, members])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setProperties([])
    setMembers([])
    setActiveTab('properties')
  }

  const handleLoginSuccess = () => {
    setShowLogin(false)
  }

  const filteredProperties = filterType === 'all'
    ? properties
    : properties.filter(p => p.property_type === filterType)

  const approvedCount = members.filter(m => m.status === 'approved').length
  const pendingCount = members.filter(m => m.status === 'pending').length

  // ── TABS based on role ──
  const tabs = profile?.role === 'admin'
    ? [
        { id: 'properties', label: 'Properties', icon: <Building2 size={14} /> },
        { id: 'members', label: 'Members', icon: <Users size={14} /> },
        { id: 'pending', label: 'New Enrollments', icon: <Clock size={14} /> },
      ]
    : user && profile?.status === 'approved'
    ? [
        { id: 'properties', label: 'All Properties', icon: <Building2 size={14} /> },
        { id: 'my-listings', label: 'My Listings', icon: <User size={14} /> },
      ]
    : []

    
const handleEnrollmentSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault()
  setEnrollmentError('')
  setEnrollmentSuccess(false)

  const {
    full_name,
    email,
    phone,
    whatsapp,
    area,
    address,
    password,
    confirm_password,
  } = enrollmentForm

  if (
    !full_name.trim() ||
    !email.trim() ||
    !phone.trim() ||
    !area.trim()
  ) {
    setEnrollmentError('Please fill in all required fields.')
    return
  }

  if (!/^\d{10}$/.test(phone)) {
    setEnrollmentError('Enter a valid 10-digit mobile number.')
    return
  }

  if (whatsapp && !/^\d{10}$/.test(whatsapp)) {
    setEnrollmentError('Enter a valid 10-digit WhatsApp number.')
    return
  }

  if (password.length < 8) {
    setEnrollmentError('Password must be at least 8 characters.')
    return
  }

  if (password !== confirm_password) {
    setEnrollmentError('Passwords do not match.')
    return
  }

  setEnrollmentLoading(true)

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: full_name.trim(),
          phone,
          whatsapp: whatsapp || null,
          area: area.trim(),
        },
      },
    })

    if (error) {
      throw error
    }

    if (!data.user) {
      throw new Error('Registration could not be completed. Please try again.')
    }

    // Address is collected by the form, but the current
    // profiles schema does not include an address column.
    // Do not attempt to save it until the database is updated.

    setEnrollmentSuccess(true)

    setEnrollmentForm({
      full_name: '',
      email: '',
      phone: '',
      whatsapp: '',
      area: '',
      address: '',
      password: '',
      confirm_password: '',
    })
  } catch (error) {
    setEnrollmentError(
      error instanceof Error
        ? error.message
        : 'Registration failed. Please try again.'
    )
  } finally {
    setEnrollmentLoading(false)
  }
}


  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="navbar">
        
<div className="navbar-logo">
  <div className="navbar-logo-icon">
    <Building2 size={22} color="white" />
  </div>
  <div className="navbar-logo-text">
    <h1>Bhavishya Developers</h1>
    <p>Members Portal · bhavishyadevelopers.com</p>
  </div>
</div>

<div className="header-tools">
  <div className="header-clock" aria-label="Current time in India">
    <Clock size={15} />
    <span>
      {currentTime
        ? new Intl.DateTimeFormat('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          }).format(currentTime) + ' IST'
        : 'Loading India time…'}
    </span>
  </div>

  <div className="header-sync" title="Backend sync monitoring is not connected yet">
    <span className="header-sync-dot" />
    <span>Sync not connected</span>
  </div>

  <button
    type="button"
    className="header-theme-btn"
    onClick={() => setIsDarkMode(value => !value)}
    aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
    aria-pressed={isDarkMode}
  >
    {isDarkMode ? <Eye size={17} /> : <EyeOff size={17} />}
    <span>{isDarkMode ? 'Light' : 'Dark'}</span>
  </button>
</div>

      </nav>
      {/* ── TICKER ── */}
      <Ticker items={tickerItems} />

      <FeaturedBoard />
      <LiveStatsPanel />

      

      

      

        

      {/* ── MEMBER AVATARS GRID (like KPCC zone avatars) ── */}
      {user && profile?.role === 'admin' && showMembersGrid && (
        <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '20px 24px' }}>
          <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', fontWeight: '600' }}>
            👥 MEMBERS — Hover to see details
          </div>
          <div className="members-grid">
            {members.slice(0, 20).map(m => (
              <div key={m.id} className="member-avatar" title={`${m.full_name} · ${m.area || ''} · ${m.status}`}>
                <div className="member-avatar-circle" style={{
                  background: m.status === 'approved'
                    ? 'linear-gradient(135deg, #1B2B4B, #2563EB)'
                    : 'linear-gradient(135deg, #94A3B8, #CBD5E1)'
                }}>
                  {m.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="member-avatar-name">{m.full_name.split(' ')[0]}</div>
              </div>
            ))}
            {members.length === 0 && (
              <p style={{ color: '#94A3B8', fontSize: '13px' }}>No members yet.</p>
            )}
          </div>
        </div>
      )}

      {/* ── SECTION TABS ── */}
      {user && tabs.length > 0 && (
        <div className="section-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`section-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="main-content">

        {/* NOT LOGGED IN */}
    


{/* MEMBER ENROLLMENT SECTION */}
{!user && (
  <section className="enrollment-page">
    <div className="enrollment-card">
      <h2>Member Enrollment</h2>

      
<p className="enrollment-intro">
  Fill your details to register as a member and access the
  Bhavishya Developers property network.
</p>

{/* ENROLLMENT ERROR AND SUCCESS MESSAGES */}
{enrollmentError && (
  <p role="alert" className="enrollment-error">
    {enrollmentError}
  </p>
)}

{enrollmentSuccess && (
  <p role="status" className="enrollment-success">
    Registration submitted successfully. Please check your email
    if email confirmation is required.
  </p>
)}

<form
  className="enrollment-form"
  onSubmit={handleEnrollmentSubmit}
>

        <div className="enrollment-field">
          <label htmlFor="enrollment-full-name">FULL NAME *</label>
          <input
            id="enrollment-full-name"
            name="full_name"
            type="text"
            placeholder="As per ID proof"
            value={enrollmentForm.full_name}
            onChange={(e) =>
              setEnrollmentForm({
                ...enrollmentForm,
                full_name: e.target.value,
              })
            }
            autoComplete="name"
            required
          />
        </div>

        <div className="enrollment-field">
          <label htmlFor="enrollment-phone">MOBILE NUMBER *</label>
          <input
            id="enrollment-phone"
            name="phone"
            type="tel"
            placeholder="10-digit mobile"
            value={enrollmentForm.phone}
            onChange={(e) =>
              setEnrollmentForm({
                ...enrollmentForm,
                phone: e.target.value,
              })
            }
            autoComplete="tel"
            pattern="[0-9]{10}"
            maxLength={10}
            required
          />
        </div>

        <div className="enrollment-field">
          <label htmlFor="enrollment-whatsapp">
            WHATSAPP NUMBER *
          </label>
          <input
            id="enrollment-whatsapp"
            name="whatsapp"
            type="tel"
            placeholder="10-digit WhatsApp"
            value={enrollmentForm.whatsapp}
            onChange={(e) =>
              setEnrollmentForm({
                ...enrollmentForm,
                whatsapp: e.target.value,
              })
            }
            pattern="[0-9]{10}"
            maxLength={10}
            required
          />
        </div>

        <div className="enrollment-field">
          <label htmlFor="enrollment-email">EMAIL ADDRESS *</label>
          <input
            id="enrollment-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={enrollmentForm.email}
            onChange={(e) =>
              setEnrollmentForm({
                ...enrollmentForm,
                email: e.target.value,
              })
            }
            autoComplete="email"
            required
          />
        </div>

        <div className="enrollment-field">
          <label htmlFor="enrollment-area">AREA / LOCATION *</label>
          <input
            id="enrollment-area"
            name="area"
            type="text"
            placeholder="Area, Bengaluru"
            value={enrollmentForm.area}
            onChange={(e) =>
              setEnrollmentForm({
                ...enrollmentForm,
                area: e.target.value,
              })
            }
            required
          />
        </div>

        <div className="enrollment-field enrollment-field-wide">
          <label htmlFor="enrollment-address">FULL ADDRESS *</label>
          <textarea
            id="enrollment-address"
            name="address"
            placeholder="Door No, Street, Area, Pincode"
            rows={3}
            value={enrollmentForm.address}
            onChange={(e) =>
              setEnrollmentForm({
                ...enrollmentForm,
                address: e.target.value,
              })
            }
            autoComplete="street-address"
            required
          />
        </div>

        <div className="enrollment-field">
          <label htmlFor="enrollment-password">PASSWORD *</label>
          <input
            id="enrollment-password"
            name="password"
            type="password"
            placeholder="Minimum 6 characters"
            value={enrollmentForm.password}
            onChange={(e) =>
              setEnrollmentForm({
                ...enrollmentForm,
                password: e.target.value,
              })
            }
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>

        <div className="enrollment-field">
          <label htmlFor="enrollment-confirm-password">
            CONFIRM PASSWORD *
          </label>
          <input
            id="enrollment-confirm-password"
            name="confirm_password"
            type="password"
            placeholder="Repeat password"
            value={enrollmentForm.confirm_password}
            onChange={(e) =>
              setEnrollmentForm({
                ...enrollmentForm,
                confirm_password: e.target.value,
              })
            }
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>

        <div className="enrollment-field-wide enrollment-submit">
          <button type="submit" disabled={enrollmentLoading}>
  {enrollmentLoading ? 'Registering...' : 'Register as Member'}
</button>

          <p>Membership is subject to administrator approval.</p>
        </div>
      </form>
    </div>
  </section>
)}


        {/* PENDING APPROVAL */}
        {user && profile?.status === 'pending' && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{
              width: '80px', height: '80px', background: '#FEF3C7', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
            }}>
              <Clock size={40} color="#F59E0B" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
              Approval Pending
            </h2>
            <p style={{ color: '#64748B', fontSize: '15px', maxWidth: '400px', margin: '0 auto' }}>
              Your membership request is under review. You will be able to access all listings once approved by admin.
            </p>
          </div>
        )}

        {/* PROPERTIES TAB */}
        {user && profile?.status === 'approved' && activeTab === 'properties' && (
          <>
            <div className="section-header">
              <div>
                <div className="section-title"><Building2 size={20} /> All Properties</div>
                <div className="section-subtitle">{filteredProperties.length} listings available</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['all', 'residential', 'commercial', 'land'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    style={{
                      padding: '6px 14px', borderRadius: '20px', border: 'none',
                      cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                      background: filterType === type ? '#2563EB' : '#F1F5F9',
                      color: filterType === type ? 'white' : '#374151',
                      transition: 'all 0.2s'
                    }}
                  >
                    {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="properties-grid">
              {filteredProperties.map(p => <PropertyCard key={p.id} property={p} />)}
              {filteredProperties.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                  <Building2 size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                  <p>No properties listed yet.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* MY LISTINGS TAB */}
        {user && profile?.status === 'approved' && activeTab === 'my-listings' && (
          <>
            <div className="section-header">
              <div>
                <div className="section-title"><User size={20} /> My Listings</div>
                <div className="section-subtitle">Properties you have listed</div>
              </div>
              <button className="btn-full btn-blue" style={{ width: 'auto', padding: '10px 20px', fontSize: '13px' }}
                onClick={() => setShowAddProperty(true)}>
                <Plus size={15} /> Add Property
              </button>
            </div>
            <div className="properties-grid">
              {properties.filter(p => p.member_id === user.id).map(p => (
                <PropertyCard key={p.id} property={p} />
              ))}
              {properties.filter(p => p.member_id === user.id).length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                  <Plus size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                  <p>You haven't listed any properties yet.</p>
                  <button className="btn-full btn-blue" style={{ width: 'auto', margin: '16px auto 0', padding: '10px 24px' }}
                    onClick={() => setShowAddProperty(true)}>
                    List Your First Property
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ADMIN — MEMBERS TAB */}
        {user && profile?.role === 'admin' && activeTab === 'members' && (
          <>
            <div className="section-header">
              <div>
                <div className="section-title"><Users size={20} /> All Members</div>
                <div className="section-subtitle">{members.length} total · {approvedCount} approved · {pendingCount} pending</div>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #e2e8f0' }}>
                    {['Name', 'Phone', 'Area', 'Status', 'Joined', 'Action'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#374151' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {members.map((m, i) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600' }}>{m.full_name}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748B' }}>{m.phone}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748B' }}>{m.area || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`status-badge status-${m.status}`}>{m.status}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#94A3B8' }}>
                        {new Date(m.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {m.status === 'pending' && (
                          <button
                            onClick={async () => {
                              await supabase.from('profiles').update({ status: 'approved' }).eq('id', m.id)
                              setMembers(members.map(x => x.id === m.id ? { ...x, status: 'approved' } : x))
                            }}
                            style={{
                              padding: '5px 12px', background: '#D1FAE5', color: '#065F46',
                              border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700'
                            }}
                          >
                            Approve
                          </button>
                        )}
                        {m.status === 'approved' && m.role !== 'admin' && (
                          <button
                            onClick={async () => {
                              await supabase.from('profiles').update({ status: 'disabled' }).eq('id', m.id)
                              setMembers(members.map(x => x.id === m.id ? { ...x, status: 'disabled' } : x))
                            }}
                            style={{
                              padding: '5px 12px', background: '#FEE2E2', color: '#991B1B',
                              border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700'
                            }}
                          >
                            Disable
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {members.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>No members yet.</div>
              )}
            </div>
          </>
        )}

        {/* ADMIN — PENDING ENROLLMENTS TAB */}
        {user && profile?.role === 'admin' && activeTab === 'pending' && (
          <>
            <div className="section-header">
              <div>
                <div className="section-title"><Clock size={20} /> New Enrollments</div>
                <div className="section-subtitle">{pendingCount} members waiting for verification</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {members.filter(m => m.status === 'pending').map(m => (
                <div key={m.id} style={{
                  background: 'white', borderRadius: '12px', border: '1px solid #FEF3C7',
                  padding: '16px 20px', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #94A3B8, #CBD5E1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', fontWeight: '800', color: 'white'
                    }}>
                      {m.full_name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{m.full_name}</div>
                      <div style={{ fontSize: '13px', color: '#64748B' }}>{m.phone} · {m.area}</div>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                        Enrolled {new Date(m.created_at).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={async () => {
                        await supabase.from('profiles').update({ status: 'approved' }).eq('id', m.id)
                        setMembers(members.map(x => x.id === m.id ? { ...x, status: 'approved' } : x))
                      }}
                      style={{
                        padding: '8px 18px', background: '#2563EB', color: 'white',
                        border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700'
                      }}
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={async () => {
                        await supabase.from('profiles').update({ status: 'disabled' }).eq('id', m.id)
                        setMembers(members.map(x => x.id === m.id ? { ...x, status: 'disabled' } : x))
                      }}
                      style={{
                        padding: '8px 18px', background: '#FEE2E2', color: '#991B1B',
                        border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700'
                      }}
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ))}
              {pendingCount === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                  <CheckCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                  <p>No pending enrollments.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ADMIN — PROPERTIES TAB */}
        {user && profile?.role === 'admin' && activeTab === 'properties' && (
          <>
            <div className="section-header">
              <div>
                <div className="section-title"><Building2 size={20} /> All Properties</div>
                <div className="section-subtitle">{properties.length} total listings</div>
              </div>
            </div>
            <div className="properties-grid">
              {properties.map(p => (
                <div key={p.id} style={{ position: 'relative' }}>
                  <PropertyCard property={p} />
                  {p.status === 'pending' && (
                    <div style={{ padding: '8px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '8px', background: 'white' }}>
                      <button
                        onClick={async () => {
                          await supabase.from('properties').update({ status: 'approved' }).eq('id', p.id)
                          setProperties(properties.map(x => x.id === p.id ? { ...x, status: 'approved' } : x))
                        }}
                        style={{
                          flex: 1, padding: '6px', background: '#D1FAE5', color: '#065F46',
                          border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700'
                        }}
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={async () => {
                          await supabase.from('properties').update({ status: 'rejected' }).eq('id', p.id)
                          setProperties(properties.map(x => x.id === p.id ? { ...x, status: 'rejected' } : x))
                        }}
                        style={{
                          flex: 1, padding: '6px', background: '#FEE2E2', color: '#991B1B',
                          border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700'
                        }}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {properties.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                  No properties yet.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        background: '#1B2B4B', color: '#93C5FD', textAlign: 'center',
        padding: '20px', fontSize: '13px', marginTop: '40px'
      }}>
        <strong style={{ color: 'white' }}>Bhavishya Developers</strong> · Members Portal<br />
        <span style={{ fontSize: '12px', opacity: 0.7 }}>© 2024 All rights reserved.</span>
      </footer>

      {/* ── MODALS ── */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
      {showEnroll && <EnrollModal onClose={() => setShowEnroll(false)} />}
      {showAddProperty && (
        <AddPropertyModal
          onClose={() => setShowAddProperty(false)}
          onSuccess={() => {
            setShowAddProperty(false)
            setActiveTab('my-listings')
          }}
        />
      )}
    </>
  )
}