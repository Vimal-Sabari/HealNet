import { useSelector, useDispatch } from 'react-redux'
import { toggleAnonymous } from '../features/preferences/preferenceSlice'
import { Eye, EyeOff } from 'lucide-react'

function AnonymousToggle() {
    const dispatch = useDispatch()
    const { isAnonymous } = useSelector((state) => state.preference)

    return (
        <button
            onClick={() => dispatch(toggleAnonymous())}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-200 ${isAnonymous
                    ? 'bg-gray-800 text-white hover:bg-gray-900'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
            title={isAnonymous ? "You are posting anonymously" : "You are posting publicly"}
        >
            {isAnonymous ? <EyeOff size={18} /> : <Eye size={18} />}
            <span className="text-sm font-medium">
                {isAnonymous ? 'Anonymous Mode: ON' : 'Anonymous Mode: OFF'}
            </span>
        </button>
    )
}

export default AnonymousToggle
