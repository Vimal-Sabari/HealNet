import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import { ShieldCheck, Eye, Database, Download, Trash2, Lock } from 'lucide-react'

const SECTIONS = [
    {
        icon: Eye,
        title: 'Anonymous Mode',
        desc: 'When enabled, your name and identity are hidden from all shared experiences. Other users will see "Anonymous Patient" instead of your name.',
        color: '#2563eb',
    },
    {
        icon: Database,
        title: 'Data Collection',
        desc: 'We collect only the data you explicitly share — symptoms, conditions, treatments, and outcomes. Location data (city) is optional and never automatically collected.',
        color: '#059669',
    },
    {
        icon: Lock,
        title: 'Encryption & Security',
        desc: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Authentication uses JWT tokens with secure httpOnly cookies. Passwords are hashed with bcrypt.',
        color: '#7c3aed',
    },
    {
        icon: Download,
        title: 'Data Export',
        desc: 'You can request a full export of your data at any time. This includes all experiences you\'ve shared, insights you\'ve saved, and your profile information.',
        color: '#d97706',
    },
    {
        icon: Trash2,
        title: 'Account Deletion',
        desc: 'You can permanently delete your account and all associated data. This action is irreversible and removes all your experiences, saved insights, and profile data.',
        color: '#dc2626',
    },
]

function PrivacyPage() {
    const navigate = useNavigate()
    const { user } = useSelector(s => s.auth)

    useEffect(() => {
        if (!user) navigate('/login')
    }, [user, navigate])

    if (!user) return null

    return (
        <AppLayout>
            <div className="hn-section-title">
                <ShieldCheck size={16} />
                Privacy Center
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 20, lineHeight: 1.6 }}>
                HealNet is built with privacy-first principles. Your health data belongs to you —
                we never sell or share your personal information with third parties.
            </p>

            {SECTIONS.map((s, i) => (
                <div key={i} style={{
                    background: 'white', borderRadius: 14, padding: 20, marginBottom: 12,
                    boxShadow: '0 2px 15px -3px rgba(37,99,235,0.07)',
                    border: '1px solid #e2e8f0', display: 'flex', gap: 14, alignItems: 'flex-start',
                }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <s.icon size={18} color={s.color} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: 4 }}>
                            {s.title}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
                            {s.desc}
                        </div>
                    </div>
                </div>
            ))}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button style={{
                    flex: 1, padding: '10px 0', borderRadius: 10, border: '1.5px solid #e2e8f0',
                    background: 'white', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                    color: '#2563eb', fontFamily: 'inherit', transition: 'all 0.15s',
                }}
                    onMouseOver={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#bfdbfe' }}
                    onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e2e8f0' }}
                >
                    <Download size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
                    Export My Data
                </button>
                <button style={{
                    flex: 1, padding: '10px 0', borderRadius: 10, border: '1.5px solid #fee2e2',
                    background: 'white', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                    color: '#dc2626', fontFamily: 'inherit', transition: 'all 0.15s',
                }}
                    onMouseOver={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fecaca' }}
                    onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#fee2e2' }}
                >
                    <Trash2 size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
                    Delete Account
                </button>
            </div>
        </AppLayout>
    )
}

export default PrivacyPage
