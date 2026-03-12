import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ArrowUpRight, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import type { CaseSummary } from "@/types/api"

interface RecentPatientsProps {
    cases: CaseSummary[]
    isLoading?: boolean
}

export function RecentPatients({ cases, isLoading }: RecentPatientsProps) {
    const navigate = useNavigate()
    if (isLoading) {
        return (
            <div className="flex h-[200px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!cases || cases.length === 0) {
        return (
            <div className="flex h-[150px] items-center justify-center text-sm text-muted-foreground">
                No recent patients found.
            </div>
        )
    }

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
                            {cases.map((c) => (
                                <tr key={c.case_id} className="border-b last:border-0 transition-colors hover:bg-muted/40 group">
                                    <td className="py-2 px-4 align-middle">
                                        <div className="font-medium text-sm">{c.patient_id}</div>
                                        <div className="text-[10px] text-muted-foreground">{c.case_id}</div>
                                    </td>
                                    <td className="py-2 px-4 align-middle text-left">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "rounded-md px-2 py-0.5 font-medium text-[10px] capitalize tracking-wide",
                                                c.tb_zone === "DETECTED" && "bg-destructive/10 text-destructive dark:text-red-400 border-destructive/20",
                                                c.tb_zone === "NOT_DETECTED" && "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
                                                c.tb_zone === "BORDERLINE" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                            )}
                                        >
                                            {c.tb_zone.replace("_", " ").toLowerCase()}
                                        </Badge>
                                    </td>
                                    <td className="py-2 px-4 align-middle text-left text-xs text-muted-foreground">
                                        {new Date(c.timestamp).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-4 align-middle text-right">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button 
                                                        onClick={() => navigate(`/history/${c.case_id}`)}
                                                        className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                                                    >
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
