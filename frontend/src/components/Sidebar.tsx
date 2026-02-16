import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    PlusSquare,
    History,
    BarChart3,
    LogOut,
    GalleryVerticalEnd,
    User,
    ChevronRight,
    Settings
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: PlusSquare, label: "New Case", path: "/new-case" },
    { icon: History, label: "History", path: "/history" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
]

interface SidebarProps {
    isCollapsed: boolean
    onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("userEmail")
        window.location.href = "/login"
    }

    return (
        <aside
            onClick={onToggle}
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 ease-in-out cursor-col-resize select-none overflow-hidden",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex h-full flex-col px-3 py-6">
                {/* Brand Header */}
                <div
                    className={cn(
                        "mb-10 flex items-center px-4 cursor-pointer transition-all duration-300",
                        isCollapsed ? "justify-center px-0" : ""
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
                        "text-xl font-bold tracking-tight text-foreground whitespace-nowrap transition-all duration-300 overflow-hidden",
                        isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    )}>
                        NexTB
                    </span>
                </div>

                {/* Main Menu - Flat List */}
                <div className="flex-1 space-y-1 overflow-x-hidden">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 group overflow-hidden",
                                location.pathname === item.path
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                isCollapsed ? "justify-center px-0" : ""
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 flex-shrink-0 transition-all duration-300",
                                !isCollapsed && "mr-3",
                                location.pathname === item.path ? "text-primary" : "group-hover:text-foreground"
                            )} />
                            <span className={cn(
                                "whitespace-nowrap transition-all duration-300 overflow-hidden",
                                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* User Profile & Logout Bottom Section */}
                <div className="mt-auto border-t border-border/50 pt-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className={cn(
                                    "flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium transition-all duration-300 hover:bg-muted group overflow-hidden outline-none data-[state=open]:bg-muted",
                                    isCollapsed ? "justify-center" : ""
                                )}
                            >
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                                    <User className="h-4 w-4" />
                                </div>
                                <div className={cn(
                                    "flex flex-1 items-center justify-between overflow-hidden ml-3 transition-all duration-300",
                                    isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100"
                                )}>
                                    <span className="truncate text-sm font-medium text-foreground">
                                        My Account
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56" side="right" sideOffset={10}>
                            <DropdownMenuItem onClick={() => navigate("/profile")}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                                <LogOut className="mr-2 h-4 w-4 text-destructive" />
                                <span>Sign Out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </aside>
    )
}
