import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Sidebar } from "./Sidebar"
import { TopNavbar } from "./TopNavbar"

const titles: Record<string, string> = {
    "/": "Dashboard",
    "/dashboard": "Dashboard",
    "/new-case": "New Case",
    "/history": "Case History",
    "/analytics": "Analytics",
    "/settings": "Settings",
    "/profile": "Profile",
}

export function MainLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const location = useLocation()
    const title = titles[location.pathname] || "NexTB"

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            <div className={cn(
                "flex flex-1 flex-col transition-all duration-300 ease-in-out",
                isCollapsed ? "pl-20" : "pl-64"
            )}>
                <TopNavbar title={title} />
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

