import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchExperiences } from '../features/search/searchSlice'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Filter, SlidersHorizontal, Flag, ChevronDown } from 'lucide-react'
import ReportModal from '../components/ReportModal'
import { CardSkeleton } from '../components/Skeleton'

function SearchPage() {
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState('newest')
    const [page, setPage] = useState(1)
    const [filters, setFilters] = useState({
        condition: '',
        hospital: '',
        outcome: ''
    })

    // Report Modal State
    const [reportModalOpen, setReportModalOpen] = useState(false)
    const [selectedExpId, setSelectedExpId] = useState(null)
    const [selectedExpTitle, setSelectedExpTitle] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { results, isLoading, isError, message, pages } = useSelector((state) => state.search)

    // Debounced search effect
    useEffect(() => {
        const handler = setTimeout(() => {
            dispatch(searchExperiences({ q: query, sort, ...filters, page }))
        }, 500)

        return () => clearTimeout(handler)
    }, [query, sort, filters, page, dispatch])

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
        setPage(1) // Reset to first page on filter change
    }

    const handleLoadMore = () => {
        setPage(prev => prev + 1)
    }

    const handleReport = (exp) => {
        e.stopPropagation(); // Prevent card click if any
        setSelectedExpId(exp._id)
        setSelectedExpTitle(`${exp.condition} at ${exp.hospital}`)
        setReportModalOpen(true)
    }

    return (
        <div className="container mx-auto p-4 min-h-screen">

            {/* Header */}
            <header className="flex items-center mb-6 border-b pb-4 gap-4">
                <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Search Experiences</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Filters Panel */}
                <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit top-4 sticky">
                    <div className="flex items-center gap-2 mb-4 text-gray-700">
                        <Filter size={20} />
                        <h2 className="font-bold text-lg">Filters</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                            <input
                                type="text"
                                name="condition"
                                value={filters.condition}
                                onChange={handleFilterChange}
                                placeholder="e.g. Migraine"
                                className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
                            <input
                                type="text"
                                name="hospital"
                                value={filters.hospital}
                                onChange={handleFilterChange}
                                placeholder="e.g. General"
                                className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                            <select
                                name="outcome"
                                value={filters.outcome}
                                onChange={handleFilterChange}
                                className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">All</option>
                                <option value="success">Success</option>
                                <option value="failure">Failure</option>
                            </select>
                        </div>

                        <hr className="my-4" />

                        <div>
                            <div className="flex items-center gap-2 mb-2 text-gray-700">
                                <SlidersHorizontal size={16} />
                                <label className="block text-sm font-medium">Sort By</label>
                            </div>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="relevance">Relevance</option>
                            </select>
                        </div>
                    </div>
                </aside>

                {/* Results Area */}
                <main className="lg:col-span-3">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by keywords (e.g. symptoms, treatment, doctor name)..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Results List */}
                    {isLoading && page === 1 ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
                        </div>
                    ) : isError ? (
                        <div className="text-center py-10 text-red-500">Error: {message}</div>
                    ) : results.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border-dashed border-2 border-gray-200">
                            No results found matching your criteria.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {results.map((exp) => (
                                <div key={exp._id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border-l-4 border-blue-500 group relative">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-xl text-gray-800 mb-1">{exp.condition}</h3>
                                            <p className="text-sm text-gray-500 mb-2">
                                                at <span className="font-semibold text-gray-700">{exp.hospital}</span>
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${exp.outcome === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {exp.outcome.toUpperCase()}
                                        </span>
                                    </div>

                                    <p className="text-gray-700 mb-2 line-clamp-2">{exp.treatment}</p>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {exp.symptoms.map((s, idx) => (
                                            <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{s}</span>
                                        ))}
                                    </div>

                                    <div className="mt-4 pt-4 border-t flex justify-between items-center text-xs text-gray-500">
                                        <span>{new Date(exp.createdAt).toLocaleDateString()}</span>
                                        <div className="flex items-center gap-4">
                                            <span>Recovery: {exp.recoveryTime}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleReport(exp)
                                                }}
                                                className="text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                                                title="Report this content"
                                            >
                                                <Flag size={14} /> Report
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Additional Loading Skeletons */}
                            {isLoading && page > 1 && (
                                <div className="space-y-4">
                                    {[1, 2].map(i => <CardSkeleton key={i} />)}
                                </div>
                            )}

                            {/* Load More Button */}
                            {page < pages && !isLoading && (
                                <div className="flex justify-center mt-8 pb-10">
                                    <button
                                        onClick={handleLoadMore}
                                        className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition"
                                    >
                                        <ChevronDown size={20} /> Load More Results
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            <ReportModal
                isOpen={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                experienceId={selectedExpId}
                experienceTitle={selectedExpTitle}
            />
        </div>
    )
}

export default SearchPage
