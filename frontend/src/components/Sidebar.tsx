import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    PlusSquare,
    History,
    BarChart3,
    Settings,
    User,
    LogOut,
    Microscope
} from "lucide-react"

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: PlusSquare, label: "New Case", path: "/new-case" },
    { icon: History, label: "History", path: "/history" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
]

const accountItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: User, label: "Profile", path: "/profile" },
]

export function Sidebar() {
    const location = useLocation()

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card lg:translate-x-0">
            <div className="flex h-full flex-col px-3 py-4">
                <div className="mb-10 flex items-center px-2">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Microscope className="h-6 w-6" />
                    </div>
                    <span className="text-xl font-bold">TB Detect AI</span>
                </div>

                <div className="flex-1 space-y-1">
                    <p className="px-2 pb-2 text-xs font-semibold uppercase text-muted-foreground">Analysis</p>
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={cn(
                                "flex items-center rounded-lg px-2 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                                location.pathname === item.path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}

                    <p className="px-2 pb-2 pt-6 text-xs font-semibold uppercase text-muted-foreground">Account</p>
                    {accountItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={cn(
                                "flex items-center rounded-lg px-2 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                                location.pathname === item.path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                </div>

                <button
                    onClick={() => {
                        localStorage.removeItem("isLoggedIn")
                        window.location.href = "/login"
                    }}
                    className="mt-auto flex items-center rounded-lg px-2 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </button>
            </div>
        </aside>
    )
}
