import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Users, Activity, CheckCircle } from "lucide-react"

export default function Dashboard() {
    const stats = [
        { title: "Total Cases", value: "1,284", icon: Users, color: "text-primary" },
        { title: "TB Positive", value: "156", icon: Activity, color: "text-primary" },
        { title: "Avg. Confidence", value: "94.2%", icon: CheckCircle, color: "text-primary" },
    ]

    const recentCases = [
        { id: "#TB-2024-0156", name: "John Doe", result: "Positive", confidence: "92%", date: "Feb 15, 2026" },
        { id: "#TB-2024-0155", name: "Jane Smith", result: "Negative", confidence: "96%", date: "Feb 15, 2026" },
        { id: "#TB-2024-0154", name: "Robert Johnson", result: "Negative", confidence: "98%", date: "Feb 14, 2026" },
    ]

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">+12% from last month</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Cases</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead>
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">ID</th>
                                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Patient</th>
                                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Result</th>
                                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Confidence</th>
                                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentCases.map((c) => (
                                    <tr key={c.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-2 align-middle font-medium">{c.id}</td>
                                        <td className="p-2 align-middle">{c.name}</td>
                                        <td className="p-2 align-middle">
                                            <Badge variant={c.result === "Positive" ? "destructive" : "success"}>
                                                {c.result}
                                            </Badge>
                                        </td>
                                        <td className="p-2 align-middle">
                                            <div className="flex w-[100px] items-center gap-2">
                                                <div className="h-2 w-full rounded-full bg-secondary">
                                                    <div
                                                        className="h-full rounded-full bg-primary"
                                                        style={{ width: c.confidence }}
                                                    />
                                                </div>
                                                <span className="text-xs">{c.confidence}</span>
                                            </div>
                                        </td>
                                        <td className="p-2 align-middle text-muted-foreground">{c.date}</td>
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
