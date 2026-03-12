import { useState, useMemo, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
    Search, 
    Download, 
    ChevronUp, 
    ChevronDown, 
    ChevronsUpDown, 
    MoreHorizontal, 
    Settings2, 
    ChevronsLeft, 
    ChevronLeft, 
    ChevronRight, 
    ChevronsRight, 
    Loader2,
    Trash2
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn, getPageNumbers } from "@/lib/utils"
import { FacetedFilter } from "@/components/history/faceted-filter"
import { api } from "@/lib/api"
import type { CaseSummary } from "@/types/api"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type SortConfig = {
    key: "age" | "date" | "confidence" | null
    direction: "asc" | "desc" | null
}

const statusOptions = [
    { label: "Detected", value: "DETECTED" },
    { label: "Borderline", value: "BORDERLINE" },
    { label: "Not Detected", value: "NOT_DETECTED" },
]

export default function HistoryPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set())
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null })
    
    // API State
    const [cases, setCases] = useState<CaseSummary[]>([])
    const [totalCases, setTotalCases] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const fetchCases = () => {
        setIsLoading(true)
        api.getCases({ 
            page: currentPage, 
            limit: pageSize, 
            search: searchTerm 
        })
        .then(data => {
            setCases(data.cases)
            setTotalCases(data.total)
            setIsLoading(false)
        })
        .catch(err => {
            console.error("Failed to fetch cases", err)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        fetchCases()
    }, [currentPage, pageSize, searchTerm])

    const handleDelete = (caseId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm(`Are you sure you want to delete case ${caseId}?`)) return

        toast.promise(api.deleteCase(caseId), {
            loading: 'Deleting case...',
            success: () => {
                fetchCases()
                return 'Case deleted successfully'
            },
            error: 'Failed to delete case'
        })
    }

    useEffect(() => {
        const resultParam = searchParams.get("result")
        if (resultParam) {
            setSelectedStatuses(new Set([resultParam === "Positive" ? "DETECTED" : resultParam]))
        }
        const sortParam = searchParams.get("sort")
        if (sortParam === "confidence") {
            setSortConfig({ key: "confidence", direction: "desc" })
        }
    }, [searchParams])

    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        name: true,
        doctor: true,
        age: true,
        date: true,
        result: true,
        confidence: true,
    })

    const handleSort = (key: "age" | "date" | "confidence") => {
        setSortConfig((prev: SortConfig) => {
            if (prev.key === key) {
                if (prev.direction === "asc") return { key, direction: "desc" }
                if (prev.direction === "desc") return { key: null, direction: null }
            }
            return { key, direction: "asc" }
        })
    }

    const toggleStatus = (value: string) => {
        const newSet = new Set(selectedStatuses)
        if (newSet.has(value)) {
            newSet.delete(value)
        } else {
            newSet.add(value)
        }
        setSelectedStatuses(newSet)
    }

    const toggleColumn = (column: keyof typeof visibleColumns) => {
        setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }))
    }

    const filteredCases = useMemo(() => {
        let filtered = cases;

        if (selectedStatuses.size > 0) {
            filtered = filtered.filter(item => selectedStatuses.has(item.tb_zone))
        }

        if (!sortConfig.key || !sortConfig.direction) return filtered

        return [...filtered].sort((a, b) => {
            const key = sortConfig.key!
            let aValue: any = key === "confidence" ? a.tb_probability : key === "date" ? a.timestamp : (a as any)[key]
            let bValue: any = key === "confidence" ? b.tb_probability : key === "date" ? b.timestamp : (b as any)[key]

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
            return 0
        })
    }, [cases, selectedStatuses, sortConfig])

    const totalPages = Math.ceil(totalCases / pageSize) || 1
    const pageNumbers = getPageNumbers(currentPage, totalPages)

    const getSortIcon = (key: "age" | "date" | "confidence") => {
        if (sortConfig.key !== key) return <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50" />
        if (sortConfig.direction === "asc") return <ChevronUp className="ml-1 h-3 w-3" />
        return <ChevronDown className="ml-1 h-3 w-3" />
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                    <h2 className="text-2xl font-bold">Case History</h2>
                    <p className="text-muted-foreground text-sm">
                        Manage and review patient history records here.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9">
                        Invite Doctor
                    </Button>
                    <Button size="sm" className="h-9" onClick={() => navigate("/new-case")}>
                        Add Record
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 items-center gap-2 max-w-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Filter users..."
                                className="pl-9 h-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <FacetedFilter
                            title="Result"
                            options={statusOptions}
                            selectedValues={selectedStatuses}
                            onSelect={toggleStatus}
                            onClear={() => setSelectedStatuses(new Set())}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9">
                                    <Settings2 className="mr-2 h-4 w-4" />
                                    View
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[150px]">
                                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                    checked={visibleColumns.id}
                                    onCheckedChange={() => toggleColumn("id")}
                                >
                                    ID
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={visibleColumns.name}
                                    onCheckedChange={() => toggleColumn("name")}
                                >
                                    Name
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={visibleColumns.doctor}
                                    onCheckedChange={() => toggleColumn("doctor")}
                                >
                                    Doctor
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={visibleColumns.age}
                                    onCheckedChange={() => toggleColumn("age")}
                                >
                                    Age
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={visibleColumns.date}
                                    onCheckedChange={() => toggleColumn("date")}
                                >
                                    Date
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={visibleColumns.result}
                                    onCheckedChange={() => toggleColumn("result")}
                                >
                                    Result
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={visibleColumns.confidence}
                                    onCheckedChange={() => toggleColumn("confidence")}
                                >
                                    Confidence
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="outline" size="sm" className="h-9">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                <Card className="rounded-lg border shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead>
                                    <tr className="border-b transition-colors hover:bg-muted/50 bg-muted/20">
                                        {visibleColumns.id && <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-xs">Case ID</th>}
                                        {visibleColumns.name && <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-xs">Patient ID</th>}
                                        {visibleColumns.doctor && <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-xs">District</th>}
                                        {visibleColumns.age && (
                                            <th
                                                className="h-10 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer select-none transition-colors hover:text-foreground text-xs"
                                                onClick={() => handleSort("age")}
                                            >
                                                <div className="flex items-center text-xs">Age {getSortIcon("age")}</div>
                                            </th>
                                        )}
                                        {visibleColumns.date && (
                                            <th
                                                className="h-10 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer select-none transition-colors hover:text-foreground text-xs"
                                                onClick={() => handleSort("date")}
                                            >
                                                <div className="flex items-center text-xs">Date {getSortIcon("date")}</div>
                                            </th>
                                        )}
                                        {visibleColumns.result && <th className="h-10 px-4 text-center align-middle font-medium text-muted-foreground text-xs">Result</th>}
                                        {visibleColumns.confidence && (
                                            <th
                                                className="h-10 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer select-none transition-colors hover:text-foreground text-xs"
                                                onClick={() => handleSort("confidence")}
                                            >
                                                <div className="flex items-center text-xs">Confidence {getSortIcon("confidence")}</div>
                                            </th>
                                        )}
                                        <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground text-xs"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={8} className="py-10 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground">Loading cases...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredCases.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="py-10 text-center text-muted-foreground">
                                                No cases found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCases.map((c) => (
                                            <tr 
                                                key={c.case_id} 
                                                className="border-b transition-colors hover:bg-muted/40 group cursor-pointer"
                                                onClick={() => navigate(`/history/${c.case_id}`)}
                                            >
                                                {visibleColumns.id && <td className="py-2 px-4 align-middle text-xs text-muted-foreground">{c.case_id}</td>}
                                                {visibleColumns.name && <td className="py-2 px-4 align-middle text-xs font-medium">{c.patient_id}</td>}
                                                {visibleColumns.doctor && <td className="py-2 px-4 align-middle text-muted-foreground text-xs">{c.district}</td>}
                                                {visibleColumns.age && <td className="py-2 px-4 align-middle text-xs">24</td>}
                                                {visibleColumns.date && <td className="py-2 px-4 align-middle text-xs">{new Date(c.timestamp).toLocaleDateString()}</td>}
                                                {visibleColumns.result && (
                                                    <td className="py-2 px-4 align-middle text-center">
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
                                                )}
                                                {visibleColumns.confidence && (
                                                    <td className="py-2 px-4 align-middle">
                                                        <div className="flex w-[80px] items-center gap-2">
                                                            <div className="h-1 w-full rounded-full bg-secondary">
                                                                <div
                                                                    className="h-full rounded-full bg-primary"
                                                                    style={{ width: `${c.tb_probability * 100}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground">{Math.round(c.tb_probability * 100)}%</span>
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="py-2 px-4 align-middle text-right flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 transition-opacity">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={(e) => handleDelete(c.case_id, e)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        )))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between px-2 py-4">
                    <div className="flex flex-1 items-center space-x-2">
                        <Select
                            value={`${pageSize}`}
                            onValueChange={(value) => setPageSize(Number(value))}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={`${pageSize}`} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((size) => (
                                    <SelectItem key={size} value={`${size}`}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-sm font-medium text-muted-foreground">Rows per page</p>
                    </div>

                    <div className="flex items-center justify-center text-sm font-medium pr-2">
                        Page {currentPage} of {totalPages}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-1">
                            {pageNumbers.map((page, i) => (
                                <Button
                                    key={i}
                                    variant={currentPage === page ? "secondary" : "ghost"}
                                    className={cn(
                                        "h-8 w-8 p-0 text-xs font-medium",
                                        page === "..." && "cursor-default hover:bg-transparent"
                                    )}
                                    onClick={() => typeof page === "number" && setCurrentPage(page)}
                                    disabled={page === "..."}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            <span className="sr-only">Go to last page</span>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
