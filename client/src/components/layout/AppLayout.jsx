import Navbar from './Navbar'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'

function AppLayout({ children }) {
    return (
        <div className="hn-body">
            <Navbar />
            <div className="hn-layout">
                <LeftSidebar />
                <main className="hn-center">
                    {children}
                </main>
                <RightSidebar />
            </div>
        </div>
    )
}

export default AppLayout
