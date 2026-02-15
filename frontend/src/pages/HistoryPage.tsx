import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

const historyData = [
    { id: "#TB-2024-0156", name: "John Doe", age: 45, result: "Positive", confidence: "92%", date: "Feb 15, 2026" },
    { id: "#TB-2024-0155", name: "Jane Smith", age: 32, result: "Negative", confidence: "96%", date: "Feb 15, 2026" },
    { id: "#TB-2024-0154", name: "Robert Johnson", age: 58, result: "Negative", confidence: "98%", date: "Feb 14, 2026" },
    { id: "#TB-2024-0153", name: "Maria Garcia", age: 41, result: "Positive", confidence: "89%", date: "Feb 14, 2026" },
    { id: "#TB-2024-0152", name: "David Wilson", age: 29, result: "Negative", confidence: "97%", date: "Feb 13, 2026" },
    { id: "#TB-2024-0151", name: "Sarah Lee", age: 52, result: "Negative", confidence: "95%", date: "Feb 13, 2026" },
]

export default function HistoryPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredData = historyData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search patients..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Case Records</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead>
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">ID</th>
                                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Patient Name</th>
                                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Age</th>
                                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Date</th>
                                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Result</th>
                                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Confidence</th>
                                    <th className="h-10 px-2 text-right align-middle font-medium text-muted-foreground">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((c) => (
                                    <tr key={c.id} className="border-b transition-colors hover:bg-muted/50 cursor-pointer">
                                        <td className="p-2 align-middle font-medium text-primary">{c.id}</td>
                                        <td className="p-2 align-middle font-medium">{c.name}</td>
                                        <td className="p-2 align-middle">{c.age}</td>
                                        <td className="p-2 align-middle">{c.date}</td>
                                        <td className="p-2 align-middle">
                                            <Badge variant={c.result === "Positive" ? "destructive" : "success"}>
                                                {c.result}
                                            </Badge>
                                        </td>
                                        <td className="p-2 align-middle">
                                            <div className="flex w-[120px] items-center gap-2">
                                                <div className="h-1.5 w-full rounded-full bg-secondary">
                                                    <div
                                                        className="h-full rounded-full bg-primary"
                                                        style={{ width: c.confidence }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium">{c.confidence}</span>
                                            </div>
                                        </td>
                                        <td className="p-2 align-middle text-right">
                                            <Button variant="ghost" size="sm">View</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
