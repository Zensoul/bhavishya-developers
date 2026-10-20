'use client'

import { Building2 } from 'lucide-react'

// ─── DUMMY DATA — replace with real Supabase queries later ───
const DUMMY_PROPERTIES = [
  { id: 1, title: '3BHK Apartment', sub: 'Whitefield · ₹85.0 L' },
  { id: 2, title: 'Commercial Shop', sub: 'Indiranagar · ₹1.2 Cr' },
  { id: 3, title: 'Corner Plot', sub: 'K R Puram · ₹65.0 L' },
  { id: 4, title: '2BHK House', sub: 'Electronic City · ₹58.0 L' },
  { id: 5, title: 'Office Space', sub: 'Marathahalli · ₹90.0 L' },
  { id: 6, title: 'DC Plot', sub: 'Sarjapur Road · ₹48.0 L' },
]

const DUMMY_MEMBERS = [
  { id: 1, name: 'Ramesh Kumar', sub: 'Whitefield' },
  { id: 2, name: 'Priya Sharma', sub: 'Indiranagar' },
  { id: 3, name: 'Suresh Reddy', sub: 'K R Puram' },
  { id: 4, name: 'Anitha Rao', sub: 'Electronic City' },
  { id: 5, name: 'Vijay Kumar', sub: 'Marathahalli' },
  { id: 6, name: 'Lakshmi Devi', sub: 'Sarjapur Road' },
  { id: 7, name: 'Manoj Gowda', sub: 'Hebbal' },
  { id: 8, name: 'Deepa Nair', sub: 'Jayanagar' },
]

export function FeaturedBoard() {
  const properties = [...DUMMY_PROPERTIES, ...DUMMY_PROPERTIES]
  const members = [...DUMMY_MEMBERS, ...DUMMY_MEMBERS]

  return (
    <div className="featured-board">
      {/* ── ROW 1: Featured Properties ── */}
      <div className="featured-row featured-row-blue">
        <div className="featured-row-label">
          FEATURED<br />PROPERTIES
        </div>
        <div className="featured-row-scroll">
          <div className="featured-track">
            {properties.map((p, i) => (
              <div className="featured-entry" key={`p-${p.id}-${i}`}>
                <span className="featured-avatar featured-avatar-blue">
                  <span className="featured-avatar-inner">
                    <Building2 size={16} color="white" />
                  </span>
                </span>
                <span className="featured-text">
                  <span className="featured-name">{p.title}</span>
                  <span className="featured-sub">{p.sub}</span>
                </span>
                <span className="featured-dot featured-dot-blue" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 2: New Members ── */}
      <div className="featured-row featured-row-green">
        <div className="featured-row-label">
          NEW<br />MEMBERS
        </div>
        <div className="featured-row-scroll">
          <div className="featured-track featured-track-reverse">
            {members.map((m, i) => (
              <div className="featured-entry" key={`m-${m.id}-${i}`}>
                <span className="featured-avatar featured-avatar-green">
                  <span className="featured-avatar-inner">{m.name.charAt(0)}</span>
                </span>
                <span className="featured-text">
                  <span className="featured-name">{m.name}</span>
                  <span className="featured-sub">{m.sub}</span>
                </span>
                <span className="featured-dot featured-dot-green" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}