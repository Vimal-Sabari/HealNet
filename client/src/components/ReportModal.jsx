import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createReport } from '../features/reports/reportSlice'
import { X, AlertTriangle } from 'lucide-react'

function ReportModal({ isOpen, onClose, experienceId, experienceTitle }) {
    const [reason, setReason] = useState('Inappropriate Content')
    const [details, setDetails] = useState('')
    const dispatch = useDispatch()

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(createReport({ experienceId, reason, details }))
        onClose()
        // Optionally show a toast notification here
        alert('Thank you for your report. We will review it shortly.')
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle size={24} />
                        <h2 className="text-xl font-bold">Report Experience</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <p className="text-gray-600 mb-4 text-sm">
                    You are reporting: <span className="font-semibold">{experienceTitle}</span>
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Reason</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="Inappropriate Content">Inappropriate Content</option>
                            <option value="Spam">Spam</option>
                            <option value="False Information">False Information</option>
                            <option value="Harassment">Harassment</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Additional Details</label>
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 h-24 resize-none"
                            placeholder="Please provide specific details..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ReportModal
