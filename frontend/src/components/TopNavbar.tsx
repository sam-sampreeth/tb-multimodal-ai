import { Moon, Sun, LogOut, User } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { GlobalSearch } from "./GlobalSearch"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"

export function TopNavbar({ title }: { title: string }) {
    const { theme, setTheme } = useTheme()
    const navigate = useNavigate()
    const userEmail = localStorage.getItem("userEmail") || "doctor@nextb.ai"
    const userName = userEmail.split("@")[0]
    const currentHour = new Date().getHours()
    let greeting = "Good morning"
    if (currentHour >= 12) greeting = "Good afternoon"
    if (currentHour >= 18) greeting = "Good evening"

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("userEmail")
        navigate("/login")
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-8 bg-background/0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hover:text-foreground cursor-pointer transition-colors font-medium">NexTB</span>
                <span>/</span>
                <span className="text-foreground font-medium">{title}</span>
                <span className="mx-2 h-4 w-[1px] bg-border" />
                <span className="text-muted-foreground/80 hidden sm:inline-block">
                    {greeting}, Dr. <span className="capitalize">{userName}</span>
                </span>
            </div>

            <div className="flex items-center gap-4">
                <GlobalSearch />

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-md"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    {theme === "dark" ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full px-0 py-0 overflow-hidden ring-1 ring-border/50 hover:ring-border transition-all flex items-center justify-center">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold w-full h-full flex items-center justify-center">DR</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Logged in as</p>
                                <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/profile")}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
