import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AppLayout from '../components/layout/AppLayout'
import AISearchCard from '../components/AISearchCard'
import ExperienceFeed from '../components/ExperienceFeed'

function Dashboard() {
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        if (!user) navigate('/login')
    }, [user, navigate])

    if (!user) return null

    return (
        <AppLayout>
            <AISearchCard />
            <ExperienceFeed />
        </AppLayout>
    )
}

export default Dashboard
