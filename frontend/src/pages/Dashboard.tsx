import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { TrendingUp, TrendingDown, Download, ChevronRight, Loader2 } from "lucide-react"
import { Area, AreaChart } from "recharts"
import { Link } from "react-router-dom"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { RecentPatients } from "@/components/dashboard/recent-patients"
import { api } from "@/lib/api"
import type { DashboardStats, CaseSummary } from "@/types/api"

const chartConfig = {
    cases: {
        label: "Cases",
        color: "var(--color-primary)",
    },
    positive: {
        label: "Positive",
        color: "var(--color-destructive)",
    },
    confidence: {
        label: "Confidence",
        color: "var(--color-primary)",
    },
} satisfies ChartConfig

const rangeToDays: Record<string, number> = {
  "1d": 1,
  "30d": 30,
  "6m": 180,
  "1y": 365,
}

export default function Dashboard() {
    const [timeRange, setTimeRange] = useState("30d")
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [recentCases, setRecentCases] = useState<CaseSummary[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        Promise.all([
            api.getDashboardStats(rangeToDays[timeRange]),
            api.getCases({ limit: 5 })
        ])
            .then(([statsData, casesData]) => {
                setStats(statsData)
                setRecentCases(casesData.cases)
                setIsLoading(false)
            })
            .catch(err => {
                console.error("Failed to fetch dashboard data", err)
                setIsLoading(false)
            })
    }, [timeRange])

    if (isLoading && !stats) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    // Map data for display
    const currentStatsData = stats ? [
        { 
            title: "Total Cases", 
            value: stats.total_cases.toLocaleString(), 
            trend: "+0%", // Trend logic can be added to backend later
            data: stats.by_week.map(w => ({ value: w.total }))
        },
        { 
            title: "TB Positive", 
            value: stats.tb_detected.toLocaleString(), 
            trend: "+0%", 
            data: stats.by_week.map(w => ({ value: w.tb_detected }))
        },
        { 
            title: "Avg. Confidence", 
            value: `${(stats.avg_probability * 100).toFixed(1)}%`, 
            trend: "+0%", 
            data: stats.by_week.map(() => ({ value: (stats.avg_probability * 100) })) // Minimal charting for confidence
        }
    ] : []

    const overviewDataMap = stats?.by_week.map(w => ({ name: w.week, total: w.total })) || []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                </div>
                <div className="flex items-center space-x-2">
                    <Button size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="30d" className="space-y-4" onValueChange={setTimeRange}>
                <TabsList>
                    <TabsTrigger value="1d">1 day</TabsTrigger>
                    <TabsTrigger value="30d">30 days</TabsTrigger>
                    <TabsTrigger value="6m">6 months</TabsTrigger>
                    <TabsTrigger value="1y">1 year</TabsTrigger>
                </TabsList>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {currentStatsData.map((stat, index) => {
                        const isIncrease = stat.trend.startsWith('+')
                        const isBadTrend =
                            (index === 0 && isIncrease) || // Total Cases increase = bad
                            (index === 1 && isIncrease) || // TB Positive increase = bad
                            (index === 2 && !isIncrease)   // Confidence decrease = bad

                        const trendColorClass = isBadTrend
                            ? "border border-destructive/50 bg-destructive/10 text-destructive"
                            : "border border-foreground/50 bg-foreground/10 text-foreground"

                        const chartColor = "currentColor"
                        const kpiLinks = ["/history", "/history?result=Positive", "/history?sort=confidence"]

                        return (
                            <Card key={stat.title} className="overflow-hidden p-1 shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground">
                                    <CardTitle className="text-sm font-medium group/title">
                                        <Link
                                            to={kpiLinks[index]}
                                            className="flex items-center gap-1 transition-colors hover:text-foreground"
                                        >
                                            {stat.title}
                                            <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover/title:opacity-100" />
                                        </Link>
                                    </CardTitle>
                                    <div className={cn(
                                        "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors",
                                        trendColorClass
                                    )}>
                                        {stat.trend.startsWith('+') ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                        {stat.trend}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground h-4">
                                        {isLoading && <span className="animate-pulse">Loading latest...</span>}
                                    </p>
                                    <div className={cn("h-[60px] w-full mt-2 min-h-0", isBadTrend ? "text-destructive" : "text-foreground")}>
                                        <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
                                            <AreaChart data={stat.data}>
                                                <defs>
                                                    <linearGradient id={`fill-kpi-${index}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.4} />
                                                        <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <Area
                                                    dataKey="value"
                                                    type="natural"
                                                    fill={`url(#fill-kpi-${index})`}
                                                    stroke={chartColor}
                                                    strokeWidth={2}
                                                    dot={false}
                                                />
                                            </AreaChart>
                                        </ChartContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Case Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <Overview data={overviewDataMap} />
                        </CardContent>
                    </Card>
                    <Card className="col-span-3 overflow-hidden">
                        <CardHeader>
                            <CardTitle>Recent Patients</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <RecentPatients cases={recentCases} isLoading={isLoading} />
                        </CardContent>
                    </Card>
                </div>
            </Tabs>
        </div>
    )
}

