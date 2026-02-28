import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import { getCommunityFeed } from '../features/experiences/experienceSlice'
import { toggleSaveInsight } from '../features/insights/insightsSlice'
import { toggleHelpful } from '../features/experiences/experienceSlice'
import { Shield, Heart, Bookmark, ChevronDown, Users, ChevronRight } from 'lucide-react'
import { CardSkeleton } from '../components/Skeleton'

const OUTCOME_MAP = {
    success: { label: '✓ Success', cls: 'success' },
    improvement: { label: '✓ Improved', cls: 'success' },
    ongoing: { label: '⏳ Ongoing', cls: 'ongoing' },
    'no improvement': { label: '⚠ No Change', cls: 'complication' },
    complication: { label: '⚠ Complication', cls: 'complication' },
}

function getOutcome(raw) {
    return OUTCOME_MAP[(raw || '').toLowerCase()] || { label: raw || 'Unknown', cls: 'ongoing' }
}

function CommunityCard({ exp }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { helpfulIds } = useSelector(s => s.experiences)
    const { savedIds } = useSelector(s => s.insights)
    const { user } = useSelector(s => s.auth)
    const [expanded, setExpanded] = useState(false)

    const liked = helpfulIds.includes(exp._id)
    const saved = savedIds.includes(exp._id)
    const outcome = getOutcome(exp.outcome)

    const initials = exp.isAnonymous
        ? '?'
        : (exp.userId?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2)

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
            <div className="hn-feed-card-top">
                <div className="hn-feed-avatar">
                    {exp.isAnonymous ? <Shield size={16} /> : initials}
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
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {new Date(exp.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
            </div>

            {exp.symptoms?.length > 0 && (
                <div className="hn-feed-chips">
                    {exp.symptoms.slice(0, 4).map((s, i) => (
                        <span key={i} className="hn-feed-chip">{s}</span>
                    ))}
                </div>
            )}

            <div className="hn-data-block">
                <div>
                    <div className="hn-data-item-lbl">Treatment</div>
                    <div className="hn-data-item-val">{exp.treatment || '—'}</div>
                </div>
                <div>
                    <div className="hn-data-item-lbl">Recovery</div>
                    <div className="hn-data-item-val">{exp.recoveryTime || '—'}</div>
                </div>
            </div>

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
                    <button onClick={() => setExpanded(p => !p)} style={{
                        background: 'none', border: 'none', color: '#2563eb',
                        fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: '2px 0',
                        display: 'flex', alignItems: 'center', gap: 3,
                    }}>
                        {expanded ? 'Show less' : 'Read more'}
                        <ChevronRight size={12} style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                </div>
            )}

            <div className="hn-feed-footer">
                <button className={`hn-footer-btn helpful ${liked ? 'active' : ''}`} onClick={handleHelpful}>
                    <Heart size={12} fill={liked ? 'currentColor' : 'none'} />
                    {exp.helpfulCount > 0 ? exp.helpfulCount : ''} Helpful
                </button>
                <button className={`hn-footer-btn ${saved ? 'active' : ''}`} onClick={handleSave}>
                    <Bookmark size={12} fill={saved ? 'currentColor' : 'none'} />
                    {saved ? 'Saved' : 'Save'}
                </button>
                <button className="hn-footer-btn" onClick={() => navigate(`/search?condition=${encodeURIComponent(exp.condition)}`)}>
                    <Users size={12} />
                    Similar Cases
                </button>
            </div>
        </div>
    )
}

function CommunityPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector(s => s.auth)
    const { communityExperiences, isLoading } = useSelector(s => s.experiences)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        if (!user) { navigate('/login'); return }
        dispatch(getCommunityFeed({ page })).then(res => {
            if (res.payload?.pages && page >= res.payload.pages) setHasMore(false)
        })
    }, [dispatch, page, user, navigate])

    if (!user) return null

    return (
        <AppLayout>
            <div className="hn-section-title">
                <Users size={16} />
                Community
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 16 }}>
                Most helpful patient journeys shared by the community — sorted by impact.
            </p>

            {isLoading && page === 1
                ? [1, 2, 3].map(i => <CardSkeleton key={i} />)
                : communityExperiences.length === 0 && !isLoading
                    ? (
                        <div className="hn-empty-state">
                            <div className="hn-empty-icon"><Users size={32} color="#2563eb" strokeWidth={1.5} /></div>
                            <div className="hn-empty-title">No community experiences yet</div>
                            <div className="hn-empty-sub">Be the first to share your journey and help others.</div>
                            <button onClick={() => navigate('/share-experience')} style={{
                                marginTop: 16, background: '#2563eb', color: 'white', border: 'none',
                                borderRadius: 9, padding: '9px 20px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                            }}>
                                Share Your Experience
                            </button>
                        </div>
                    )
                    : communityExperiences.map(exp => <CommunityCard key={exp._id} exp={exp} />)
            }

            {isLoading && page > 1 && [1, 2].map(i => <CardSkeleton key={i} />)}

            {hasMore && !isLoading && communityExperiences.length > 0 && (
                <button className="hn-load-more" onClick={() => setPage(p => p + 1)}>
                    <ChevronDown size={16} />
                    Load more
                </button>
            )}
        </AppLayout>
    )
}

export default CommunityPage
