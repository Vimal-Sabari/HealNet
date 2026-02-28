import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { analyzeSymptoms, reset } from '../features/query/querySlice'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import { Brain, Activity, AlertTriangle, ArrowRight, CheckCircle, XCircle, Building2 } from 'lucide-react'

function QueryPage() {
    const [symptoms, setSymptoms] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { results, isLoading, isError, message } = useSelector(s => s.query)

    const onSubmit = (e) => {
        e.preventDefault()
        if (symptoms.trim()) dispatch(analyzeSymptoms(symptoms))
    }

    const handleReset = () => {
        dispatch(reset())
        setSymptoms('')
    }

    return (
        <AppLayout>
            <div className="hn-section-title">
                <Brain size={16} />
                AI Symptom Analysis
            </div>

            {/* Input */}
            <div style={{
                background: 'white', borderRadius: 14, padding: 24, marginBottom: 16,
                boxShadow: '0 2px 15px -3px rgba(37,99,235,0.07)', border: '1px solid #e2e8f0',
            }}>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 12, lineHeight: 1.5 }}>
                    Describe your symptoms in detail. Our AI will analyze similar patient experiences to provide insights.
                </div>
                <form onSubmit={onSubmit}>
                    <textarea
                        value={symptoms}
                        onChange={e => setSymptoms(e.target.value)}
                        placeholder="E.g. I have a severe headache on one side, sensitivity to light, and nausea for the past 3 days…"
                        required
                        style={{
                            width: '100%', minHeight: 100, padding: '12px 14px', borderRadius: 10,
                            border: '1.5px solid #e2e8f0', fontSize: '0.88rem', fontFamily: 'inherit',
                            color: '#0f172a', resize: 'vertical', outline: 'none', background: '#f8fafc',
                            boxSizing: 'border-box', lineHeight: 1.6,
                        }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, gap: 8 }}>
                        {results && (
                            <button type="button" onClick={handleReset} style={{
                                padding: '9px 18px', borderRadius: 9, border: '1.5px solid #e2e8f0',
                                background: 'white', color: '#64748b', fontSize: '0.82rem', fontWeight: 700,
                                cursor: 'pointer', fontFamily: 'inherit',
                            }}>
                                Clear & Retry
                            </button>
                        )}
                        <button type="submit" disabled={isLoading} style={{
                            padding: '9px 22px', borderRadius: 9, border: 'none',
                            background: isLoading ? '#94a3b8' : '#2563eb', color: 'white',
                            fontSize: '0.82rem', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit', boxShadow: '0 4px 14px 0 rgba(37,99,235,0.35)',
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                            {isLoading ? 'Analyzing…' : <><Activity size={14} /> Analyze Symptoms</>}
                        </button>
                    </div>
                </form>
                {isError && (
                    <div style={{
                        marginTop: 12, padding: '10px 14px', borderRadius: 8,
                        background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626',
                        fontSize: '0.82rem', fontWeight: 600,
                    }}>
                        ⚠ {message}
                    </div>
                )}
            </div>

            {/* Results */}
            {results && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>

                    {/* AI Summary */}
                    <div style={{
                        background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', borderRadius: 14,
                        padding: 20, marginBottom: 16, border: '1px solid #bfdbfe',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <Brain size={16} color="#2563eb" />
                            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e40af' }}>AI Insight</span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#1e3a8a', lineHeight: 1.7, margin: 0 }}>
                            {results.aiSummary}
                        </p>
                        <div style={{
                            marginTop: 12, display: 'flex', alignItems: 'center', gap: 6,
                            padding: '7px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.6)',
                            fontSize: '0.73rem', color: '#64748b',
                        }}>
                            <AlertTriangle size={12} />
                            This is AI-generated advice based on similar experiences. Always consult a medical professional.
                        </div>
                    </div>

                    {/* Stats row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                        {/* Success Rate */}
                        <div style={{
                            background: 'white', borderRadius: 14, padding: 20, textAlign: 'center',
                            border: '1px solid #e2e8f0', boxShadow: '0 2px 15px -3px rgba(37,99,235,0.07)',
                        }}>
                            <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 10px' }}>
                                <svg width="80" height="80" viewBox="0 0 36 36">
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none" stroke="#e2e8f0" strokeWidth="3" />
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke={results.stats.successRate > 50 ? '#059669' : '#d97706'}
                                        strokeWidth="3"
                                        strokeDasharray={`${results.stats.successRate}, 100`}
                                        strokeLinecap="round" />
                                </svg>
                                <div style={{
                                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                                        {results.stats.successRate}%
                                    </span>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Treatment Success</div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>
                                Based on {results.stats.totalCases} cases
                            </div>
                        </div>

                        {/* Top Hospitals */}
                        <div style={{
                            background: 'white', borderRadius: 14, padding: 20,
                            border: '1px solid #e2e8f0', boxShadow: '0 2px 15px -3px rgba(37,99,235,0.07)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                                <Building2 size={14} color="#2563eb" />
                                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                                    Top Hospitals
                                </span>
                            </div>
                            {results.stats.topHospitals.length > 0 ? (
                                results.stats.topHospitals.map((h, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        padding: '7px 10px', borderRadius: 8,
                                        background: i === 0 ? '#eff6ff' : 'transparent', marginBottom: 4,
                                    }}>
                                        <div style={{
                                            width: 22, height: 22, borderRadius: '50%',
                                            background: i === 0 ? '#2563eb' : '#e2e8f0',
                                            color: i === 0 ? 'white' : '#64748b',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                                        }}>
                                            {i + 1}
                                        </div>
                                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>{h}</span>
                                    </div>
                                ))
                            ) : (
                                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>No data available</div>
                            )}
                        </div>
                    </div>

                    {/* Similar Cases */}
                    {results.similarCases.length > 0 && (
                        <>
                            <div className="hn-section-title" style={{ marginTop: 4 }}>
                                Similar Patient Experiences
                            </div>
                            {results.similarCases.map(exp => (
                                <div key={exp._id} className="hn-feed-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{exp.condition}</span>
                                        <span className={`hn-outcome-badge ${exp.outcome === 'success' ? 'success' : 'complication'}`}>
                                            {exp.outcome === 'success' ? <><CheckCircle size={11} /> Success</> : <><XCircle size={11} /> {exp.outcome}</>}
                                        </span>
                                    </div>
                                    <div className="hn-feed-chips">
                                        {exp.symptoms.map((s, i) => (
                                            <span key={i} className="hn-feed-chip">{s}</span>
                                        ))}
                                    </div>
                                    <div className="hn-data-block">
                                        <div>
                                            <div className="hn-data-item-lbl">Treatment</div>
                                            <div className="hn-data-item-val">{exp.treatment}</div>
                                        </div>
                                        <div>
                                            <div className="hn-data-item-lbl">Hospital</div>
                                            <div className="hn-data-item-val">{exp.hospital}</div>
                                        </div>
                                        <div>
                                            <div className="hn-data-item-lbl">Recovery</div>
                                            <div className="hn-data-item-val">{exp.recoveryTime}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}
        </AppLayout>
    )
}

export default QueryPage
