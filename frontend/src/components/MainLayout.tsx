import { Outlet, useLocation } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { TopNavbar } from "./TopNavbar"

const titles: Record<string, string> = {
    "/": "Dashboard",
    "/new-case": "New Case",
    "/history": "Case History",
    "/analytics": "Analytics",
    "/settings": "Settings",
    "/profile": "Profile",
}

export function MainLayout() {
    const location = useLocation()
    const title = titles[location.pathname] || "TB Detect AI"

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col pl-64">
                <TopNavbar title={title} />
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
