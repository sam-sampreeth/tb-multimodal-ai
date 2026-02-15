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
    GalleryVerticalEnd
} from "lucide-react"

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: PlusSquare, label: "New Case", path: "/new-case" },
    { icon: History, label: "History", path: "/history" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
]

const accountItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: User, label: "Profile", path: "/profile" },
]

interface SidebarProps {
    isCollapsed: boolean
    onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const location = useLocation()

    return (
        <aside
            onClick={onToggle}
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 ease-in-out cursor-col-resize select-none overflow-hidden",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div
                className="flex h-full flex-col px-3 py-4"
            >
                <div
                    className={cn(
                        "mb-10 flex items-center px-2 cursor-pointer transition-all duration-300",
                        isCollapsed ? "justify-center" : ""
                    )}
                    onClick={(e) => {
                        e.stopPropagation()
                        onToggle()
                    }}
                >
                    <div className={cn(
                        "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all duration-300",
                        !isCollapsed && "mr-3"
                    )}>
                        <GalleryVerticalEnd className="h-6 w-6" />
                    </div>
                    <span className={cn(
                        "text-xl font-bold whitespace-nowrap transition-all duration-300 overflow-hidden",
                        isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    )}>
                        NexTB
                    </span>
                </div>

                <div className="flex-1 space-y-1 overflow-x-hidden">
                    <p className={cn(
                        "px-2 pb-2 text-xs font-semibold uppercase text-muted-foreground whitespace-nowrap transition-all duration-300 overflow-hidden",
                        isCollapsed ? "h-0 opacity-0 mb-0" : "h-auto opacity-100 mb-2"
                    )}>
                        Analysis
                    </p>
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                "flex items-center rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-muted cursor-pointer overflow-hidden",
                                location.pathname === item.path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
                                isCollapsed ? "justify-center px-0" : ""
                            )}
                        >
                            <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-all duration-300", !isCollapsed && "mr-3")} />
                            <span className={cn(
                                "whitespace-nowrap transition-all duration-300 overflow-hidden",
                                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    ))}

                    <p className={cn(
                        "px-2 pb-2 pt-6 text-xs font-semibold uppercase text-muted-foreground whitespace-nowrap transition-all duration-300 overflow-hidden",
                        isCollapsed ? "h-0 opacity-0 mb-0" : "h-auto opacity-100 mb-2"
                    )}>
                        Account
                    </p>
                    {accountItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                "flex items-center rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-muted cursor-pointer overflow-hidden",
                                location.pathname === item.path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
                                isCollapsed ? "justify-center px-0" : ""
                            )}
                        >
                            <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-all duration-300", !isCollapsed && "mr-3")} />
                            <span className={cn(
                                "whitespace-nowrap transition-all duration-300 overflow-hidden",
                                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        localStorage.removeItem("isLoggedIn")
                        window.location.href = "/login"
                    }}
                    className={cn(
                        "mt-auto flex items-center rounded-lg px-2 py-2.5 text-sm font-medium text-destructive transition-all duration-300 hover:bg-destructive/10 cursor-pointer overflow-hidden",
                        isCollapsed ? "justify-center px-0" : ""
                    )}
                >
                    <LogOut className={cn("h-5 w-5 flex-shrink-0 transition-all duration-300", !isCollapsed && "mr-3")} />
                    <span className={cn(
                        "whitespace-nowrap transition-all duration-300 overflow-hidden",
                        isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    )}>
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    )
}



