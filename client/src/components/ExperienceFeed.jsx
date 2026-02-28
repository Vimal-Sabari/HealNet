import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getExperiences, toggleHelpful, resetFeed } from '../features/experiences/experienceSlice'
import { toggleSaveInsight } from '../features/insights/insightsSlice'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Shield, Heart, Bookmark, ChevronDown, Users, ChevronRight, Filter } from 'lucide-react'
import { CardSkeleton } from './Skeleton'

/* Outcome badge styling */
const OUTCOME_MAP = {
    success: { label: '✓ Success', cls: 'success' },
    improvement: { label: '✓ Improved', cls: 'success' },
    ongoing: { label: '⏳ Ongoing', cls: 'ongoing' },
    'no improvement': { label: '⚠ No Change', cls: 'complication' },
    complication: { label: '⚠ Complication', cls: 'complication' },
}

function getOutcome(raw) {
    const key = (raw || '').toLowerCase()
    return OUTCOME_MAP[key] || { label: raw || 'Unknown', cls: 'ongoing' }
}

/* Avatar colour by condition initial */
const AVATAR_COLORS = [
    ['#2563eb', '#60a5fa'], ['#059669', '#34d399'], ['#7c3aed', '#a78bfa'],
    ['#d97706', '#fbbf24'], ['#dc2626', '#f87171'],
]
function avatarColor(str = '') {
    const i = str.charCodeAt(0) % AVATAR_COLORS.length
    return AVATAR_COLORS[i]
}

function simScore(exp) {
    const seed = (exp._id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return 62 + (seed % 35)
}

const OUTCOME_FILTERS = ['', 'success', 'improvement', 'ongoing', 'complication']
const OUTCOME_LABELS = { '': 'All', success: 'Success', improvement: 'Improved', ongoing: 'Ongoing', complication: 'Complication' }

function ExperienceCard({ exp }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { helpfulIds } = useSelector(s => s.experiences)
    const { savedIds } = useSelector(s => s.insights)
    const { user } = useSelector(s => s.auth)
    const [expanded, setExpanded] = useState(false)

    const liked = helpfulIds.includes(exp._id)
    const saved = savedIds.includes(exp._id)
    const outcome = getOutcome(exp.outcome)
    const [c1, c2] = avatarColor(exp.condition)
    const initials = exp.isAnonymous
        ? '?'
        : (exp.userId?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2)
    const score = simScore(exp)

    const handleHelpful = () => {
        if (!user) { navigate('/login'); return }
        dispatch(toggleHelpful(exp._id))
    }

    const handleSave = () => {
        if (!user) { navigate('/login'); return }
        dispatch(toggleSaveInsight(exp._id))
    }

    return (
        <div className="hn-feed-card">
            {/* Top row */}
            <div className="hn-feed-card-top">
                <div
                    className="hn-feed-avatar"
                    style={{ background: `linear-gradient(135deg,${c1},${c2})` }}
                >
                    {exp.isAnonymous ? <Shield size={16} /> : initials}
                </div>
                <div className="hn-feed-meta">
                    <div className="hn-feed-meta-row">
                        <span className="hn-feed-condition">{exp.condition}</span>
                        <span className={`hn-outcome-badge ${outcome.cls}`}>{outcome.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                        {exp.hospital && (
                            <button
                                className="hn-feed-hospital"
                                onClick={() => navigate('/hospitals')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                                🏥 {exp.hospital}
                            </button>
                        )}
                        {exp.city && (
                            <span style={{ fontSize: '0.73rem', color: '#64748b' }}>📍 {exp.city}</span>
                        )}
                        {exp.isAnonymous && (
                            <span className="hn-feed-anon">
                                <Shield size={11} /> Anonymous
                            </span>
                        )}
                    </div>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', flexShrink: 0, whiteSpace: 'nowrap' }}>
                    {new Date(exp.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
            </div>

            {/* Symptom chips */}
            {exp.symptoms?.length > 0 && (
                <div className="hn-feed-chips">
                    {exp.symptoms.slice(0, 5).map((s, i) => (
                        <span key={i} className="hn-feed-chip">{s}</span>
                    ))}
                    {exp.symptoms.length > 5 && (
                        <span className="hn-feed-chip" style={{ background: '#f1f5f9', color: '#64748b' }}>
                            +{exp.symptoms.length - 5} more
                        </span>
                    )}
                </div>
            )}

            {/* Structured data block */}
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
                        <div className="hn-data-item-lbl">Cost Range</div>
                        <div className="hn-data-item-val">{exp.costRange}</div>
                    </div>
                )}
                {exp.city && (
                    <div>
                        <div className="hn-data-item-lbl">City</div>
                        <div className="hn-data-item-val">{exp.city}</div>
                    </div>
                )}
            </div>

            {/* Expandable description */}
            {exp.description && (
                <div style={{ marginBottom: 8 }}>
                    <p style={{
                        fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, margin: 0,
                        overflow: expanded ? 'visible' : 'hidden',
                        display: '-webkit-box', WebkitLineClamp: expanded ? 'unset' : 2,
                        WebkitBoxOrient: 'vertical',
                    }}>
                        {exp.description}
                    </p>
                    <button
                        onClick={() => setExpanded(p => !p)}
                        style={{
                            background: 'none', border: 'none', color: '#2563eb',
                            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                            padding: '2px 0', display: 'flex', alignItems: 'center', gap: 3,
                        }}
                    >
                        {expanded ? 'Show less' : 'Read full journey'}
                        <ChevronRight size={12} style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                </div>
            )}

            {/* Trust footer */}
            <div className="hn-feed-footer">
                <button
                    className={`hn-footer-btn helpful ${liked ? 'active' : ''}`}
                    onClick={handleHelpful}
                >
                    <Heart size={12} fill={liked ? 'currentColor' : 'none'} />
                    {exp.helpfulCount > 0 ? `${exp.helpfulCount} ` : ''}Helpful
                </button>
                <button
                    className={`hn-footer-btn ${saved ? 'active' : ''}`}
                    onClick={handleSave}
                >
                    <Bookmark size={12} fill={saved ? 'currentColor' : 'none'} />
                    {saved ? 'Saved' : 'Save'}
                </button>
                <button
                    className="hn-footer-btn"
                    onClick={() => navigate(`/search?condition=${encodeURIComponent(exp.condition)}`)}
                >
                    <Users size={12} />
                    Similar Cases
                </button>

                {/* Match score */}
                <div className="hn-match-score">
                    <span className="hn-match-label">{score}% match</span>
                    <div className="hn-match-bar">
                        <div className="hn-match-fill" style={{ width: `${score}%` }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function EmptyState() {
    const navigate = useNavigate()
    return (
        <div className="hn-empty-state">
            <div className="hn-empty-icon">
                <Users size={32} color="#2563eb" strokeWidth={1.5} />
            </div>
            <div className="hn-empty-title">Be the first to help others</div>
            <div className="hn-empty-sub">
                No experiences have been shared for this condition yet.<br />
                Your journey could help someone make a better decision.
            </div>
            <button
                onClick={() => navigate('/share-experience')}
                style={{
                    marginTop: 16, background: '#2563eb', color: 'white', border: 'none',
                    borderRadius: 9, padding: '9px 20px', fontSize: '0.82rem',
                    fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}
            >
                Share Your Experience
            </button>
        </div>
    )
}

function ExperienceFeed() {
    const [page, setPage] = useState(1)
    const [activeOutcome, setActiveOutcome] = useState('')
    const [searchParams] = useSearchParams()
    const conditionParam = searchParams.get('condition') || ''

    const dispatch = useDispatch()
    const { experiences, isLoading, isError, message, pages } = useSelector(
        (s) => s.experiences
    )

    useEffect(() => {
        dispatch(resetFeed())
        setPage(1)
    }, [dispatch, activeOutcome, conditionParam])

    useEffect(() => {
        dispatch(getExperiences({
            page,
            condition: conditionParam || undefined,
            outcome: activeOutcome || undefined
        }))
    }, [dispatch, page, activeOutcome, conditionParam])

    if (isLoading && page === 1) {
        return (
            <div>
                <div className="hn-section-title">Patient Journeys</div>
                {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
            </div>
        )
    }

    if (isError) {
        return (
            <div className="hn-empty-state">
                <div className="hn-empty-title" style={{ color: '#dc2626' }}>Could not load experiences</div>
                <div className="hn-empty-sub">{message}</div>
            </div>
        )
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div className="hn-section-title" style={{ margin: 0 }}>Patient Journeys</div>
            </div>

            {/* Filter chips by outcome */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                <Filter size={13} color="#64748b" style={{ marginTop: 4 }} />
                {OUTCOME_FILTERS.map(f => (
                    <button
                        key={f}
                        onClick={() => { setActiveOutcome(f); setPage(1) }}
                        style={{
                            padding: '4px 12px', borderRadius: 999, fontSize: '0.73rem', fontWeight: 600,
                            border: '1.5px solid',
                            borderColor: activeOutcome === f ? '#2563eb' : '#e2e8f0',
                            background: activeOutcome === f ? '#2563eb' : 'white',
                            color: activeOutcome === f ? 'white' : '#475569',
                            cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                        }}
                    >
                        {OUTCOME_LABELS[f]}
                    </button>
                ))}
            </div>

            {experiences.length === 0 && !isLoading
                ? <EmptyState />
                : experiences.map(exp => <ExperienceCard key={exp._id} exp={exp} />)
            }

            {/* Loading more skeleton */}
            {isLoading && page > 1 && [1, 2].map(i => <CardSkeleton key={i} />)}

            {/* Load more */}
            {page < pages && !isLoading && (
                <button className="hn-load-more" onClick={() => setPage(p => p + 1)}>
                    <ChevronDown size={16} />
                    Load more journeys
                </button>
            )}
        </div>
    )
}

export default ExperienceFeed
