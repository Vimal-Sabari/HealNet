import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAnalytics } from '../features/analytics/analyticsSlice'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import { TrendingUp, Users, Activity, Building2 } from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import Skeleton, { ChartSkeleton } from '../components/Skeleton'

const COLORS = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed']

function KPICard({ icon: Icon, label, value, color, borderColor }) {
    return (
        <div style={{
            background: 'white', borderRadius: 14, padding: 20,
            border: '1px solid #e2e8f0', borderLeft: `4px solid ${borderColor}`,
            boxShadow: '0 2px 15px -3px rgba(37,99,235,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
            <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{value}</div>
            </div>
            <Icon size={32} color={`${color}40`} />
        </div>
    )
}

function AnalyticsPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { data, isLoading, isError, message } = useSelector(s => s.analytics)

    useEffect(() => {
        dispatch(getAnalytics())
    }, [dispatch])

    if (isError) {
        return (
            <AppLayout>
                <div className="hn-empty-state">
                    <div className="hn-empty-title" style={{ color: '#dc2626' }}>Could not load analytics</div>
                    <div className="hn-empty-sub">{message}</div>
                    <button onClick={() => dispatch(getAnalytics())} style={{
                        marginTop: 16, background: '#2563eb', color: 'white', border: 'none',
                        borderRadius: 9, padding: '9px 20px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                    }}>
                        Retry
                    </button>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="hn-section-title">
                <TrendingUp size={16} />
                Health Trends Dashboard
            </div>

            {isLoading ? (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{
                                background: 'white', padding: 20, borderRadius: 14,
                                border: '1px solid #e2e8f0',
                            }}>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <ChartSkeleton />
                        <ChartSkeleton />
                    </div>
                </div>
            ) : data && (
                <div>
                    {/* KPI Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                        <KPICard icon={Activity} label="Total Experiences" value={data.stats.totalExperiences}
                            color="#2563eb" borderColor="#2563eb" />
                        <KPICard icon={TrendingUp} label="Avg Success Rate" value={`${data.stats.successRate}%`}
                            color="#059669" borderColor="#059669" />
                        <KPICard icon={Users} label="Total Users" value={data.stats.totalUsers}
                            color="#7c3aed" borderColor="#7c3aed" />
                        <KPICard icon={Activity} label="Top Condition"
                            value={data.charts.topConditions.length > 0 ? data.charts.topConditions[0].name : 'N/A'}
                            color="#d97706" borderColor="#d97706" />
                    </div>

                    {/* Charts Row 1 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                        {/* Growth Chart */}
                        <div style={{
                            background: 'white', borderRadius: 14, padding: 20, height: 320,
                            border: '1px solid #e2e8f0', boxShadow: '0 2px 15px -3px rgba(37,99,235,0.07)',
                        }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: 12 }}>
                                Experience Contributions (6 months)
                            </div>
                            <ResponsiveContainer width="100%" height="85%">
                                <LineChart data={data.charts.growth}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2.5}
                                        dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} name="Experiences" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Outcome Distribution */}
                        <div style={{
                            background: 'white', borderRadius: 14, padding: 20, height: 320,
                            border: '1px solid #e2e8f0', boxShadow: '0 2px 15px -3px rgba(37,99,235,0.07)',
                        }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: 12 }}>
                                Treatment Outcomes
                            </div>
                            <ResponsiveContainer width="100%" height="85%">
                                <PieChart>
                                    <Pie
                                        data={data.charts.outcomeDistribution}
                                        cx="50%" cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80} fill="#8884d8" dataKey="value"
                                    >
                                        {data.charts.outcomeDistribution.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Charts Row 2 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {/* Top Conditions */}
                        <div style={{
                            background: 'white', borderRadius: 14, padding: 20, height: 320,
                            border: '1px solid #e2e8f0', boxShadow: '0 2px 15px -3px rgba(37,99,235,0.07)',
                        }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: 12 }}>
                                Common Conditions Reported
                            </div>
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart layout="vertical" data={data.charts.topConditions}
                                    margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                                    <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11, fill: '#64748b' }} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#7c3aed" name="Cases" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Top Hospitals */}
                        <div style={{
                            background: 'white', borderRadius: 14, padding: 20, height: 320,
                            border: '1px solid #e2e8f0', boxShadow: '0 2px 15px -3px rgba(37,99,235,0.07)',
                        }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: 12 }}>
                                Top Mentioned Hospitals
                            </div>
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart data={data.charts.topHospitals}
                                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#059669" name="Mentions" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}

export default AnalyticsPage
