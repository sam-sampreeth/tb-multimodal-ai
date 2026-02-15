import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { TrendingUp, TrendingDown, Download, ChevronRight } from "lucide-react"
import { Area, AreaChart } from "recharts"
import { Link } from "react-router-dom"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { RecentPatients } from "@/components/dashboard/recent-patients"

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

const overviewData = {
    "1d": [
        { name: "00:00", total: 12 }, { name: "04:00", total: 8 }, { name: "08:00", total: 45 },
        { name: "12:00", total: 82 }, { name: "16:00", total: 65 }, { name: "20:00", total: 34 }
    ],
    "30d": [
        { name: "Week 1", total: 245 }, { name: "Week 2", total: 312 }, { name: "Week 3", total: 280 }, { name: "Week 4", total: 356 }
    ],
    "6m": [
        { name: "Jan", total: 1200 }, { name: "Feb", total: 1560 }, { name: "Mar", total: 1340 },
        { name: "Apr", total: 1800 }, { name: "May", total: 1650 }, { name: "Jun", total: 2100 }
    ],
    "1y": [
        { name: "Jan", total: 1200 }, { name: "Feb", total: 1560 }, { name: "Mar", total: 1340 }, { name: "Apr", total: 1800 },
        { name: "May", total: 1650 }, { name: "Jun", total: 2100 }, { name: "Jul", total: 1950 }, { name: "Aug", total: 2300 },
        { name: "Sep", total: 2150 }, { name: "Oct", total: 2600 }, { name: "Nov", total: 2400 }, { name: "Dec", total: 2800 }
    ]
}

const statsData = {
    "1d": [
        { title: "Total Cases", value: "42", trend: "+4", data: [{ value: 5 }, { value: 8 }, { value: 12 }, { value: 7 }, { value: 10 }] },
        { title: "TB Positive", value: "3", trend: "-1", data: [{ value: 0 }, { value: 1 }, { value: 0 }, { value: 2 }, { value: 0 }] },
        { title: "Avg. Confidence", value: "95.8%", trend: "+1.2%", data: [{ value: 92 }, { value: 94 }, { value: 96 }, { value: 95 }, { value: 97 }] }
    ],
    "30d": [
        { title: "Total Cases", value: "1,284", trend: "+12.5%", data: [{ value: 400 }, { value: 300 }, { value: 500 }, { value: 450 }, { value: 600 }] },
        { title: "TB Positive", value: "156", trend: "+15.2%", data: [{ value: 10 }, { value: 25 }, { value: 15 }, { value: 30 }, { value: 20 }] },
        { title: "Avg. Confidence", value: "94.2%", trend: "+4.5%", data: [{ value: 85 }, { value: 88 }, { value: 92 }, { value: 90 }, { value: 95 }] }
    ],
    "6m": [
        { title: "Total Cases", value: "8,432", trend: "+8.2%", data: [{ value: 1200 }, { value: 1500 }, { value: 1300 }, { value: 1800 }, { value: 1600 }] },
        { title: "TB Positive", value: "942", trend: "+10.5%", data: [{ value: 80 }, { value: 120 }, { value: 95 }, { value: 150 }, { value: 130 }] },
        { title: "Avg. Confidence", value: "93.5%", trend: "+2.1%", data: [{ value: 90 }, { value: 92 }, { value: 94 }, { value: 93 }, { value: 95 }] }
    ],
    "1y": [
        { title: "Total Cases", value: "15,842", trend: "+15.4%", data: [{ value: 1000 }, { value: 1400 }, { value: 1800 }, { value: 2200 }, { value: 2600 }] },
        { title: "TB Positive", value: "1,856", trend: "+12.8%", data: [{ value: 150 }, { value: 180 }, { value: 210 }, { value: 240 }, { value: 270 }] },
        { title: "Avg. Confidence", value: "92.8%", trend: "+3.4%", data: [{ value: 88 }, { value: 90 }, { value: 92 }, { value: 93 }, { value: 95 }] }
    ]
}

export default function Dashboard() {
    const [timeRange, setTimeRange] = useState("1d")

    const currentStats = statsData[timeRange as keyof typeof statsData]

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

            <Tabs defaultValue="1d" className="space-y-4" onValueChange={setTimeRange}>
                <TabsList>
                    <TabsTrigger value="1d">1 day</TabsTrigger>
                    <TabsTrigger value="30d">30 days</TabsTrigger>
                    <TabsTrigger value="6m">6 months</TabsTrigger>
                    <TabsTrigger value="1y">1 year</TabsTrigger>
                </TabsList>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {currentStats.map((stat, index) => {
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
                                        {/* Row space for consistency */}
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
                            <Overview data={overviewData[timeRange as keyof typeof overviewData]} />
                        </CardContent>
                    </Card>
                    <Card className="col-span-3 overflow-hidden">
                        <CardHeader>
                            <CardTitle>Recent Patients</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <RecentPatients />
                        </CardContent>
                    </Card>
                </div>
            </Tabs>
        </div>
    )
}

