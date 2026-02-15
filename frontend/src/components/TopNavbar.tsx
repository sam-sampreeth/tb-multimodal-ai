import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { GlobalSearch } from "./GlobalSearch"

export function TopNavbar({ title }: { title: string }) {
    const { theme, setTheme } = useTheme()

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-8 bg-background/0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hover:text-foreground cursor-pointer transition-colors font-medium">NexTB</span>
                <span>/</span>
                <span className="text-foreground font-medium">{title}</span>
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

                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold shadow-sm ring-1 ring-border">
                        DR
                    </div>
                </div>
            </div>
        </header>
    )
}
