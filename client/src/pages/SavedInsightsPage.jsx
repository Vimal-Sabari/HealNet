import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import { getMySavedInsights, deleteSavedInsight } from '../features/insights/insightsSlice'
import { Bookmark, Trash2, Heart, Users, BookmarkX } from 'lucide-react'
import { CardSkeleton } from '../components/Skeleton'

const OUTCOME_MAP = {
    success: { label: '✓ Success', cls: 'success' },
    improvement: { label: '✓ Improved', cls: 'success' },
    ongoing: { label: '⏳ Ongoing', cls: 'ongoing' },
    'no improvement': { label: '⚠ No Change', cls: 'complication' },
    complication: { label: '⚠ Complication', cls: 'complication' },
}

function SavedCard({ exp, onUnsave }) {
    const navigate = useNavigate()
    const outcome = OUTCOME_MAP[(exp.outcome || '').toLowerCase()] || { label: exp.outcome || 'Unknown', cls: 'ongoing' }

    return (
        <div className="hn-feed-card" style={{ position: 'relative' }}>
            {/* Unsave button */}
            <button
                onClick={() => onUnsave(exp._id)}
                title="Remove from saved"
                style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#94a3b8', transition: 'color 0.15s',
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: '0.72rem',
                }}
                onMouseOver={e => e.currentTarget.style.color = '#dc2626'}
                onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
            >
                <Trash2 size={13} />
            </button>

            <div className="hn-feed-card-top" style={{ paddingRight: 36 }}>
                <div className="hn-feed-avatar">
                    {(exp.userId?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="hn-feed-meta">
                    <div className="hn-feed-meta-row">
                        <span className="hn-feed-condition">{exp.condition}</span>
                        <span className={`hn-outcome-badge ${outcome.cls}`}>{outcome.label}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 3 }}>
                        {exp.hospital && <span>🏥 {exp.hospital}</span>}
                        {exp.city && <span style={{ marginLeft: 8 }}>📍 {exp.city}</span>}
                    </div>
                </div>
            </div>

            <div className="hn-data-block">
                <div>
                    <div className="hn-data-item-lbl">Treatment</div>
                    <div className="hn-data-item-val">{exp.treatment || '—'}</div>
                </div>
                <div>
                    <div className="hn-data-item-lbl">Recovery</div>
                    <div className="hn-data-item-val">{exp.recoveryTime || '—'}</div>
                </div>
                {exp.costRange && (
                    <div>
                        <div className="hn-data-item-lbl">Cost</div>
                        <div className="hn-data-item-val">{exp.costRange}</div>
                    </div>
                )}
            </div>

            {exp.description && (
                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6, margin: '4px 0 8px' }}>
                    {exp.description.slice(0, 180)}{exp.description.length > 180 ? '…' : ''}
                </p>
            )}

            <div className="hn-feed-footer">
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Heart size={11} /> {exp.helpfulCount || 0} helpful
                </span>
                <button className="hn-footer-btn" onClick={() => navigate(`/search?condition=${encodeURIComponent(exp.condition)}`)}>
                    <Users size={12} /> Similar
                </button>
            </div>
        </div>
    )
}

function SavedInsightsPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector(s => s.auth)
    const { savedInsights, isLoading } = useSelector(s => s.insights)

    useEffect(() => {
        if (!user) { navigate('/login'); return }
        dispatch(getMySavedInsights())
    }, [dispatch, user, navigate])

    const handleUnsave = (id) => {
        dispatch(deleteSavedInsight(id))
    }

    if (!user) return null

    return (
        <AppLayout>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div className="hn-section-title" style={{ margin: 0 }}>
                    <Bookmark size={16} />
                    Saved Insights
                </div>
                {savedInsights.length > 0 && (
                    <span style={{
                        background: '#2563eb', color: 'white', borderRadius: 999,
                        padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700,
                    }}>
                        {savedInsights.length}
                    </span>
                )}
            </div>

            {isLoading
                ? [1, 2, 3].map(i => <CardSkeleton key={i} />)
                : savedInsights.length === 0
                    ? (
                        <div className="hn-empty-state">
                            <div className="hn-empty-icon">
                                <BookmarkX size={32} color="#2563eb" strokeWidth={1.5} />
                            </div>
                            <div className="hn-empty-title">No saved insights yet</div>
                            <div className="hn-empty-sub">
                                Browse patient journeys and tap <strong>Save</strong> to bookmark<br />experiences you find useful.
                            </div>
                            <button onClick={() => navigate('/')} style={{
                                marginTop: 16, background: '#2563eb', color: 'white', border: 'none',
                                borderRadius: 9, padding: '9px 20px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                            }}>
                                Browse Journeys
                            </button>
                        </div>
                    )
                    : savedInsights.filter(Boolean).map(exp => (
                        <SavedCard key={exp._id} exp={exp} onUnsave={handleUnsave} />
                    ))
            }
        </AppLayout>
    )
}

export default SavedInsightsPage
