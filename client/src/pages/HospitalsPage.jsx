import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import { Building2, MapPin, Star, Users, Activity, ChevronRight, Filter } from 'lucide-react'

const HOSPITALS = [
    {
        id: 1, name: 'Apollo Hospitals', city: 'Chennai', score: 94,
        cases: 1240, specialties: ['Cardiology', 'Oncology', 'Neurology'],
        tagline: 'Leading multi-specialty hospital with cutting-edge technology.',
    },
    {
        id: 2, name: 'AIIMS Delhi', city: 'New Delhi', score: 91,
        cases: 980, specialties: ['General Medicine', 'Surgery', 'Psychiatry'],
        tagline: 'Premier government medical institute with world-class research.',
    },
    {
        id: 3, name: 'Fortis Healthcare', city: 'Gurgaon', score: 88,
        cases: 760, specialties: ['Orthopaedics', 'Fertility', 'Kidney Care'],
        tagline: 'Pioneering patient care across specialties.',
    },
    {
        id: 4, name: 'Max Super Speciality', city: 'Mumbai', score: 85,
        cases: 620, specialties: ['Liver Transplant', 'Cancer Care', 'Neonatology'],
        tagline: 'Advanced diagnostics with compassionate care.',
    },
    {
        id: 5, name: 'Narayana Health', city: 'Bengaluru', score: 82,
        cases: 540, specialties: ['Heart Surgery', 'Paediatrics', 'Trauma'],
        tagline: 'Affordable world-class healthcare for all.',
    },
    {
        id: 6, name: 'Manipal Hospital', city: 'Bengaluru', score: 79,
        cases: 480, specialties: ['Robotic Surgery', 'Bone Marrow', 'ENT'],
        tagline: 'Innovation-led tertiary care across India.',
    },
]

const TABS = ['Overview', 'Treatment Outcomes', 'Patient Journeys', 'Risk Patterns']
const CONDITIONS = ['All', 'Cardiology', 'Neurology', 'Orthopaedics', 'Oncology', 'Fertility']

function scoreColor(s) {
    if (s >= 90) return '#059669'
    if (s >= 80) return '#d97706'
    return '#dc2626'
}

function HospitalCard({ h, onClick }) {
    return (
        <div
            className="hn-feed-card"
            style={{ cursor: 'pointer' }}
            onClick={() => onClick(h)}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                {/* Score badge */}
                <div
                    className="hn-hosp-score"
                    style={{ background: `${scoreColor(h.score)}18`, color: scoreColor(h.score) }}
                >
                    {h.score}
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{h.name}</h3>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: scoreColor(h.score), background: `${scoreColor(h.score)}15`, padding: '2px 8px', borderRadius: 999 }}>
                            {h.score}% success rate
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <MapPin size={12} color="#94a3b8" />
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{h.city}</span>
                        <span style={{ color: '#e2e8f0' }}>•</span>
                        <Users size={12} color="#94a3b8" />
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{h.cases.toLocaleString()} patient cases</span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: '#475569', margin: '8px 0', lineHeight: 1.5 }}>{h.tagline}</p>

                    {/* Specialties */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {h.specialties.map((s, i) => (
                            <span key={i} className="hn-feed-chip" style={{ background: '#f5f3ff', color: '#6d28d9' }}>{s}</span>
                        ))}
                    </div>
                </div>

                <ChevronRight size={18} color="#94a3b8" style={{ flexShrink: 0, marginTop: 2 }} />
            </div>
        </div>
    )
}

function HospitalDetail({ h, onClose }) {
    const [tab, setTab] = useState('Overview')

    return (
        <div>
            {/* Back button */}
            <button
                onClick={onClose}
                style={{
                    background: 'none', border: 'none', color: '#2563eb', fontSize: '0.82rem',
                    fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center',
                    gap: 4, padding: '0 0 12px 0', fontFamily: 'inherit',
                }}
            >
                ← Back to Hospitals
            </button>

            {/* Header */}
            <div className="hn-hosp-header">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div className="hn-hosp-score" style={{ background: `${scoreColor(h.score)}18`, color: scoreColor(h.score), width: 60, height: 60 }}>
                        {h.score}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{h.name}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                            <MapPin size={13} color="#94a3b8" />
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{h.city}</span>
                            <span style={{ color: '#e2e8f0' }}>•</span>
                            <Activity size={13} color="#94a3b8" />
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{h.cases.toLocaleString()} cases analyzed</span>
                            <span style={{ color: '#e2e8f0' }}>•</span>
                            <Star size={13} color={scoreColor(h.score)} fill={scoreColor(h.score)} />
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: scoreColor(h.score) }}>
                                {h.score}% success rate
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="hn-tabs">
                {TABS.map(t => (
                    <button key={t} className={`hn-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                        {t}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {tab === 'Overview' && (
                <div>
                    <div className="hn-section-title">Top Specialties</div>
                    {h.specialties.map((s, i) => (
                        <div key={i} className="hn-feed-card" style={{ marginBottom: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s}</span>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 4 }}>
                                        {(80 + i * 5)}% success
                                    </div>
                                    <div style={{ width: 100, height: 5, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${80 + i * 5}%`, background: 'linear-gradient(90deg,#2563eb,#10b981)', borderRadius: 999 }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'Patient Journeys' && (
                <div>
                    {/* Filter chips */}
                    <div className="hn-chips" style={{ marginBottom: 12 }}>
                        {CONDITIONS.map(c => (
                            <button key={c} className="hn-chip">{c}</button>
                        ))}
                    </div>
                    <div className="hn-empty-state">
                        <div className="hn-empty-icon"><Users size={28} color="#2563eb" /></div>
                        <div className="hn-empty-title">Patient journeys for {h.name}</div>
                        <div className="hn-empty-sub">Filter by condition to see real patient experiences from this hospital.</div>
                    </div>
                </div>
            )}

            {(tab === 'Treatment Outcomes' || tab === 'Risk Patterns') && (
                <div className="hn-empty-state">
                    <div className="hn-empty-icon"><Activity size={28} color="#2563eb" /></div>
                    <div className="hn-empty-title">{tab}</div>
                    <div className="hn-empty-sub">Detailed analytics for {h.name} will appear here as more patients share their journeys.</div>
                </div>
            )}
        </div>
    )
}

function HospitalsPage() {
    const [selected, setSelected] = useState(null)
    const [filter, setFilter] = useState('All')

    return (
        <AppLayout>
            {selected ? (
                <HospitalDetail h={selected} onClose={() => setSelected(null)} />
            ) : (
                <div>
                    {/* Page header */}
                    <div style={{ marginBottom: 16 }}>
                        <div className="hn-section-title">Hospital Intelligence</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <Filter size={14} color="#94a3b8" />
                            <div className="hn-chips" style={{ margin: 0 }}>
                                {CONDITIONS.map(c => (
                                    <button
                                        key={c}
                                        className="hn-chip"
                                        style={filter === c ? { background: '#2563eb', color: 'white', borderColor: '#2563eb' } : {}}
                                        onClick={() => setFilter(c)}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {HOSPITALS.map(h => (
                        <HospitalCard key={h.id} h={h} onClick={setSelected} />
                    ))}
                </div>
            )}
        </AppLayout>
    )
}

export default HospitalsPage
