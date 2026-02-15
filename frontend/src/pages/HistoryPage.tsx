import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Download, ChevronUp, ChevronDown, ChevronsUpDown, MoreHorizontal, Settings2, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn, getPageNumbers } from "@/lib/utils"
import { FacetedFilter } from "@/components/history/faceted-filter"
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

const historyData = [
    { id: "#TB-2024-0156", name: "John Doe", doctor: "Dr. House", age: 45, result: "Positive", confidence: "92%", date: "Feb 15, 2026" },
    { id: "#TB-2024-0157", name: "Jane Smith", doctor: "Dr. Wilson", age: 32, result: "Negative", confidence: "98%", date: "Feb 14, 2026" },
    { id: "#TB-2024-0158", name: "Robert Brown", doctor: "Dr. Cuddy", age: 58, result: "Positive", confidence: "85%", date: "Feb 13, 2026" },
    { id: "#TB-2024-0159", name: "Emily Davis", doctor: "Dr. Chase", age: 24, result: "Negative", confidence: "95%", date: "Feb 12, 2026" },
    { id: "#TB-2024-0160", name: "Michael J.", doctor: "Dr. Foreman", age: 39, result: "Positive", confidence: "88%", date: "Feb 11, 2026" },
    { id: "#TB-2024-0163", name: "Kevin Hart", doctor: "Dr. Strange", age: 42, result: "Undetermined", confidence: "65%", date: "Feb 09, 2026" },
    { id: "#TB-2024-0164", name: "Alice Wong", doctor: "Dr. Smith", age: 29, result: "Undetermined", confidence: "72%", date: "Feb 10, 2026" },
]

type SortConfig = {
    key: "age" | "date" | "confidence" | null
    direction: "asc" | "desc" | null
}

const statusOptions = [
    { label: "Positive", value: "Positive" },
    { label: "Negative", value: "Negative" },
    { label: "Undetermined", value: "Undetermined" },
]

export default function HistoryPage() {
    const [searchParams] = useSearchParams()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set())
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null })

    useEffect(() => {
        const resultParam = searchParams.get("result")
        if (resultParam) {
            setSelectedStatuses(new Set([resultParam]))
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
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const handleSort = (key: "age" | "date" | "confidence") => {
        setSortConfig((prev) => {
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

    const sortedData = useMemo(() => {
        let filtered = historyData.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )

        if (selectedStatuses.size > 0) {
            filtered = filtered.filter(item => selectedStatuses.has(item.result))
        }

        if (!sortConfig.key || !sortConfig.direction) return filtered

        return [...filtered].sort((a, b) => {
            const key = sortConfig.key!
            let aValue: any = a[key]
            let bValue: any = b[key]

            if (key === "confidence") {
                aValue = parseFloat(aValue.replace("%", ""))
                bValue = parseFloat(bValue.replace("%", ""))
            }

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
            return 0
        })
    }, [searchTerm, selectedStatuses, sortConfig])

    const getSortIcon = (key: "age" | "date" | "confidence") => {
        if (sortConfig.key !== key) return <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50" />
        if (sortConfig.direction === "asc") return <ChevronUp className="ml-1 h-3 w-3" />
        return <ChevronDown className="ml-1 h-3 w-3" />
    }

    const totalPages = 50 // Mocked to match the image
    const pageNumbers = getPageNumbers(currentPage, totalPages)

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
                    <Button size="sm" className="h-9">
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
                                        {visibleColumns.id && <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-xs">ID</th>}
                                        {visibleColumns.name && <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-xs">Patient Name</th>}
                                        {visibleColumns.doctor && <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-xs">Doctor</th>}
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
                                    {sortedData.map((c) => (
                                        <tr key={c.id} className="border-b transition-colors hover:bg-muted/40 group">
                                            {visibleColumns.id && <td className="py-2 px-4 align-middle text-xs text-muted-foreground">{c.id}</td>}
                                            {visibleColumns.name && <td className="py-2 px-4 align-middle text-xs">{c.name}</td>}
                                            {visibleColumns.doctor && <td className="py-2 px-4 align-middle text-muted-foreground text-xs">{c.doctor}</td>}
                                            {visibleColumns.age && <td className="py-2 px-4 align-middle text-xs">{c.age}</td>}
                                            {visibleColumns.date && <td className="py-2 px-4 align-middle text-xs">{c.date}</td>}
                                            {visibleColumns.result && (
                                                <td className="py-2 px-4 align-middle text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "rounded-md px-2 py-0.5 font-medium text-[10px] capitalize tracking-wide",
                                                            c.result === "Positive" && "bg-destructive/10 text-destructive dark:text-red-400 border-destructive/20",
                                                            c.result === "Negative" && "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
                                                            c.result === "Undetermined" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                                        )}
                                                    >
                                                        {c.result}
                                                    </Badge>
                                                </td>
                                            )}
                                            {visibleColumns.confidence && (
                                                <td className="py-2 px-4 align-middle">
                                                    <div className="flex w-[80px] items-center gap-2">
                                                        <div className="h-1 w-full rounded-full bg-secondary">
                                                            <div
                                                                className="h-full rounded-full bg-primary"
                                                                style={{ width: c.confidence }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground">{c.confidence}</span>
                                                    </div>
                                                </td>
                                            )}
                                            <td className="py-2 px-4 align-middle text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 transition-opacity">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
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
                                <SelectValue placeholder={pageSize} />
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
