import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const recentCases = [
    { id: "#TB-2024-0156", name: "John Doe", result: "Positive", confidence: "92%", date: "Feb 15, 2026" },
    { id: "#TB-2024-0157", name: "Jane Smith", result: "Negative", confidence: "98%", date: "Feb 14, 2026" },
    { id: "#TB-2024-0158", name: "Robert Brown", result: "Positive", confidence: "85%", date: "Feb 13, 2026" },
    { id: "#TB-2024-0159", name: "Emily Davis", result: "Negative", confidence: "95%", date: "Feb 12, 2026" },
    { id: "#TB-2024-0160", name: "Michael J.", result: "Positive", confidence: "88%", date: "Feb 11, 2026" },
]

export function RecentPatients() {
    return (
        <div className="px-4 pb-4">
            <div className="rounded-lg border overflow-hidden">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead>
                            <tr className="border-b transition-colors hover:bg-muted/50 bg-muted/20">
                                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-xs tracking-wider">Patient</th>
                                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-xs tracking-wider">Result</th>
                                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-xs tracking-wider">Date</th>
                                <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground text-xs tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentCases.map((c) => (
                                <tr key={c.id} className="border-b last:border-0 transition-colors hover:bg-muted/40 group">
                                    <td className="py-2 px-4 align-middle">
                                        <div className="font-medium text-sm">{c.name}</div>
                                        <div className="text-[10px] text-muted-foreground">{c.id}</div>
                                    </td>
                                    <td className="py-2 px-4 align-middle text-left">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "rounded-md px-2 py-0.5 font-medium text-[10px] capitalize tracking-wide",
                                                c.result === "Positive" && "bg-destructive/10 text-destructive dark:text-red-400 border-destructive/20",
                                                c.result === "Negative" && "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20"
                                            )}
                                        >
                                            {c.result}
                                        </Badge>
                                    </td>
                                    <td className="py-2 px-4 align-middle text-left text-xs text-muted-foreground">
                                        {c.date}
                                    </td>
                                    <td className="py-2 px-4 align-middle text-right">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="left">
                                                    <p>View Patient Details</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
