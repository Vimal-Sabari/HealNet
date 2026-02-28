import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getReports, updateReportStatus } from '../features/reports/reportSlice'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react'

function AdminPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { reports, isLoading, isError, message } = useSelector((state) => state.report)
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            // For demo purposes, we might want to allow access or redirect
            // Ideally, redirect to dashboard if not admin
            // alert('Access Denied: Admin only')
            // navigate('/')
        }
        dispatch(getReports())
    }, [user, navigate, dispatch])

    const handleStatusUpdate = (id, status) => {
        dispatch(updateReportStatus({ id, status }))
    }

    if (isLoading) return <div className="text-center py-20">Loading Reports...</div>
    if (isError) return <div className="text-center py-20 text-red-500">Error: {message}</div>

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <header className="flex items-center mb-6 border-b pb-4 gap-4">
                <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={32} className="text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-800">Admin Moderation Panel</h1>
                </div>
            </header>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported Content</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reports.map((report) => (
                            <tr key={report._id}>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">
                                        {report.experienceId ? report.experienceId.condition : 'Unknown Experience'}
                                    </div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                        {report.experienceId ? report.experienceId.hospital : 'N/A'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900 font-semibold">{report.reason}</div>
                                    <div className="text-xs text-gray-500">{report.details}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {report.reporterId ? report.reporterId.name : 'Unknown User'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                            report.status === 'dismissed' ? 'bg-gray-100 text-gray-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {report.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium flex gap-2">
                                    {report.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(report._id, 'resolved')}
                                                className="text-green-600 hover:text-green-900"
                                                title="Resolve (Take Action)"
                                            >
                                                <CheckCircle size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(report._id, 'dismissed')}
                                                className="text-gray-400 hover:text-gray-600"
                                                title="Dismiss"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {reports.length === 0 && (
                    <div className="text-center py-10 text-gray-500">No reports found. Good job!</div>
                )}
            </div>
        </div>
    )
}

export default AdminPage
