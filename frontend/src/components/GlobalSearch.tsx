import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
    LayoutDashboard,
    PlusSquare,
    History,
    BarChart3,
    Settings,
    User,
    Search,
    Moon,
    Sun
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { useTheme } from "@/components/theme-provider"

export function GlobalSearch() {
    const [open, setOpen] = React.useState(false)
    const navigate = useNavigate()
    const { theme, setTheme } = useTheme()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="group flex h-9 w-full items-center justify-between rounded-md border border-input bg-muted/20 px-3 text-sm text-muted-foreground transition-all hover:bg-muted/40 md:w-64"
            >
                <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span>Search...</span>
                </div>
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Navigation">
                        <CommandItem onSelect={() => runCommand(() => navigate("/dashboard"))}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate("/new-case"))}>
                            <PlusSquare className="mr-2 h-4 w-4" />
                            <span>New Case</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate("/history"))}>
                            <History className="mr-2 h-4 w-4" />
                            <span>Case History</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate("/analytics"))}>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            <span>Analytics</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Account">
                        <CommandItem onSelect={() => runCommand(() => navigate("/profile"))}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate("/settings"))}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem onSelect={() => runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))}>
                            {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                            <span>Toggle Theme</span>
                            <CommandShortcut>⌘T</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
