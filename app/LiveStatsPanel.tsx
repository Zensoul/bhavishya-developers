'use client'

import { useState } from 'react'
import { Building2, Lock, Users } from 'lucide-react'

// ─── DUMMY DATA — replace with real Supabase counts later ───
const AREA_COUNTS = [
  { label: 'Whitefield', count: 4, type: 'residential' },
  { label: 'Indiranagar', count: 2, type: 'commercial' },
  { label: 'K R Puram', count: 3, type: 'land' },
  { label: 'Electronic City', count: 5, type: 'residential' },
  { label: 'Marathahalli', count: 2, type: 'commercial' },
]

const UNIQUE_VISITORS = 49
const TOTAL_VISITS = 1057
const VISITORS_TODAY = 4

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'land', label: 'Land' },
]

function OdometerNumber({ value }: { value: number }) {
  const digits = value.toString().padStart(6, '0').split('')
  return (
    <span className="odometer">
      {digits.map((d, i) => (
        <span className="odometer-digit" key={i}>{d}</span>
      ))}
    </span>
  )
}

export function LiveStatsPanel() {
  const [showAreas, setShowAreas] = useState(true)
  const [filter, setFilter] = useState('all')

  const totalListed = AREA_COUNTS.reduce((sum, a) => sum + a.count, 0)
  const pendingCount = 5 // dummy

  const visibleAreas = filter === 'all' ? AREA_COUNTS : AREA_COUNTS.filter(a => a.type === filter)

  return (
    <div className="live-panel">
      <div className="live-panel-header">
        <div className="live-panel-title">
          <span className="live-dot-red" />
          LIVE PROPERTY COUNT
          <span className="live-panel-subtitle">(approved, auto-updating)</span>
        </div>
        <div className="live-panel-count">
          <strong>{totalListed}</strong> listed · <span>{pendingCount} pending</span>
        </div>
      </div>

      <div className="live-panel-toggles">
        <button className="live-toggle-btn live-toggle-filled" onClick={() => setShowAreas(!showAreas)}>
          {showAreas ? 'Hide' : 'Show'} Area-wise details
        </button>
        <button className="live-toggle-btn live-toggle-outline">
          Show Upcoming Properties
        </button>
      </div>

      {showAreas && (
        <>
          <p className="live-panel-hint">Hover an area avatar to see its listing count · tap for details</p>

          <div className="live-panel-segments">
            {FILTERS.map(f => (
              <button
                key={f.id}
                className={`live-segment ${filter === f.id ? 'live-segment-active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="live-panel-caption">
            By Area — {AREA_COUNTS.map(a => a.label).join(' · ')}
          </div>

          <div className="live-area-grid">
            {visibleAreas.map(a => (
              <div className="live-area-item" key={a.label} title={`${a.label} · ${a.count} listings`}>
                <div className="live-area-circle">{a.count}</div>
                <div className="live-area-label">{a.label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="live-visitor-bar">
        <div className="live-visitor-block live-visitor-blue">
          <Users size={14} />
          UNIQUE VISITORS
          <div className="live-visitor-value">{UNIQUE_VISITORS}</div>
        </div>
        <div className="live-visitor-block live-visitor-white">
          TOTAL VISITS
          <OdometerNumber value={TOTAL_VISITS} />
        </div>
        <div className="live-visitor-block live-visitor-green">
          <Building2 size={14} />
          VISITORS TODAY
          <div className="live-visitor-value">{VISITORS_TODAY}</div>
        </div>
      </div>

      <div className="live-panel-actions">
        <button className="live-action-btn live-action-filled">
          <Building2 size={15} /> List Property
        </button>
        <button className="live-action-btn live-action-outline">
          <Lock size={15} /> Login
        </button>
        <button className="live-action-btn live-action-outline">
          <Users size={15} /> Browse Properties
        </button>
      </div>
    </div>
  )
}