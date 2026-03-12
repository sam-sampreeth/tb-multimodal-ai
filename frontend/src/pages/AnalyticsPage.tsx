import { useState, useEffect } from "react"
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle,
    CardDescription
} from "@/components/ui/card"
import { 
    ChartContainer, 
    ChartTooltip, 
    ChartTooltipContent,
    type ChartConfig
} from "@/components/ui/chart"
import { 
    Bar, 
    BarChart, 
    CartesianGrid, 
    XAxis, 
    YAxis, 
    Pie,
    PieChart, 
    Cell,
    Area,
    AreaChart
} from "recharts"
import { 
    Users, 
    Activity, 
    AlertTriangle, 
    CheckCircle2, 
    TrendingUp,
    MapPin,
    Calendar,
    Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import type { DashboardStats } from "@/types/api"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function AnalyticsPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [days, setDays] = useState("30")

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            try {
                const data = await api.getDashboardStats(parseInt(days))
                setStats(data)
            } catch (error) {
                console.error("Failed to fetch analytics:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [days])

    if (loading || !stats) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Activity className="h-10 w-10 animate-pulse text-primary" />
                    <p className="text-muted-foreground animate-pulse">Aggregating national data...</p>
                </div>
            </div>
        )
    }

    // Chart Data Preparation
    const weeklyData = stats.by_week.map((w: any) => ({
        name: w.week.replace("-W", " Week "),
        total: w.total,
        detected: w.tb_detected
    }))

    const ageData = Object.entries(stats.age_distribution).map(([key, value]) => ({
        age: key,
        count: value
    }))

    const riskData = Object.entries(stats.risk_breakdown).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
        value: value,
        originalKey: key.toLowerCase()
    }))

    const genderData = Object.entries(stats.gender_breakdown).map(([key, value]) => ({
        name: key,
        value: value
    }))

    const zoneData = Object.entries(stats.zone_breakdown).map(([key, value]) => ({
        name: key.toLowerCase().replace("_", " "),
        value: value
    }))

    const chartConfig: ChartConfig = {
        total: { label: "Total Cases", color: "hsl(var(--primary))" },
        detected: { label: "TB Detected", color: "#ef4444" },
    }

    const ageConfig: ChartConfig = {
        count: { label: "Patients", color: "hsl(var(--primary))" },
    }

    const riskConfig: ChartConfig = {
        value: { label: "Total", color: "hsl(var(--primary))" },
    }

    const zoneConfig: ChartConfig = {
        value: { label: "Cases" }
    }

    const genderConfig: ChartConfig = {
        value: { label: "Patients" }
    }

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System analytics</h1>
                    <p className="text-muted-foreground">Comprehensive insights into TB detection and patient demographics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={days} onValueChange={setDays}>
                        <SelectTrigger className="w-[180px] bg-background">
                            <Calendar className="h-4 w-4 mr-2 opacity-50" />
                            <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Last 7 days</SelectItem>
                            <SelectItem value="30">Last 30 days</SelectItem>
                            <SelectItem value="90">Last 90 days</SelectItem>
                            <SelectItem value="365">Last year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Users className="h-12 w-12" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription>Total cases</CardDescription>
                        <CardTitle className="text-3xl font-bold">{stats.total_cases}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-500 font-medium">+12%</span> vs last period
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Activity className="h-12 w-12 text-destructive" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription>Cases detected</CardDescription>
                        <CardTitle className="text-3xl font-bold text-destructive">{stats.tb_detected}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-muted-foreground">
                            Potential high-risk cases identified
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <AlertTriangle className="h-12 w-12 text-amber-500" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription>Detection rate</CardDescription>
                        <CardTitle className="text-3xl font-bold">{(stats.detection_rate * 100).toFixed(1)}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${stats.detection_rate * 100}%` }}></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="h-12 w-12 text-teal-500" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription>Avg probability</CardDescription>
                        <CardTitle className="text-3xl font-bold">{(stats.avg_probability * 100).toFixed(1)}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-muted-foreground">
                            Confidence level across all scans
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trends Chart */}
                <Card className="lg:col-span-2 overflow-hidden">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Case trends</CardTitle>
                                <CardDescription>Volume and detection over time</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-primary" /> Total
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-destructive" /> Detected
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full pb-6">
                        <ChartContainer config={chartConfig} className="h-full w-full">
                            <AreaChart 
                                data={weeklyData}
                                margin={{ left: -20, right: 10, top: 10, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.1)" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={{ stroke: 'var(--color-border)', strokeWidth: 1 }} 
                                    tickLine={{ stroke: 'var(--color-border)', strokeWidth: 1 }} 
                                    tick={{fontSize: 10, fill: 'var(--color-foreground)'}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={{ stroke: 'var(--color-border)', strokeWidth: 1 }} 
                                    tickLine={{ stroke: 'var(--color-border)', strokeWidth: 1 }} 
                                    tick={{fontSize: 10, fill: 'var(--color-foreground)'}}
                                />
                                <ChartTooltip 
                                    cursor={{ stroke: 'hsl(var(--muted-foreground)/0.2)', strokeWidth: 1 }}
                                    content={<ChartTooltipContent indicator="dot" />} 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="total" 
                                    stroke="hsl(var(--primary))" 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill="url(#totalColor)" 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="detected" 
                                    stroke="#ef4444" 
                                    strokeWidth={2}
                                    fill="transparent"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Zone Distribution */}
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle>Detection zones</CardTitle>
                        <CardDescription>Breakdown by diagnostic category</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] pb-2">
                        <ChartContainer config={zoneConfig} className="h-[180px] w-full">
                            <PieChart>
                                <Pie
                                    data={zoneData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {zoneData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                            </PieChart>
                        </ChartContainer>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4 w-full text-[10px]">
                            {zoneData.map((z, i) => (
                                <div key={z.name} className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="capitalize text-muted-foreground truncate">{z.name}</span>
                                    <span className="ml-auto font-medium text-foreground">{z.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Gender Distribution */}
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle>Gender distribution</CardTitle>
                        <CardDescription>Patient demographics breakdown</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] pb-2">
                        <ChartContainer config={genderConfig} className="h-[180px] w-full">
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {genderData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                            </PieChart>
                        </ChartContainer>
                        <div className="flex justify-center gap-6 mt-4 w-full text-[10px]">
                            {genderData.map((g, i) => (
                                <div key={g.name} className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="capitalize text-muted-foreground">{g.name}</span>
                                    <span className="font-medium text-foreground">{g.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Age Distribution */}
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle>Age distribution</CardTitle>
                        <CardDescription>Patient volume by age group</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] pb-10">
                        <ChartContainer config={ageConfig} className="h-full w-full">
                            <BarChart 
                                data={ageData} 
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                                <XAxis 
                                    dataKey="age" 
                                    axisLine={{ stroke: 'var(--color-border)', strokeWidth: 1 }} 
                                    tickLine={{ stroke: 'var(--color-border)', strokeWidth: 1 }} 
                                    tick={{fontSize: 10, fill: 'var(--color-foreground)'}} 
                                />
                                <YAxis 
                                    axisLine={{ stroke: 'var(--color-border)', strokeWidth: 1 }} 
                                    tickLine={{ stroke: 'var(--color-border)', strokeWidth: 1 }} 
                                    tick={{fontSize: 10, fill: 'var(--color-foreground)'}} 
                                />
                                <ChartTooltip 
                                    cursor={{ fill: 'hsl(var(--muted-foreground)/0.05)' }}
                                    content={<ChartTooltipContent indicator="line" />} 
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                                    {ageData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.age === "19-35" ? "var(--color-foreground)" : "var(--color-muted-foreground)"}
                                            fillOpacity={entry.age === "19-35" ? 1 : 0.3}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Risk & Gender Distribution */}
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle>Clinical risk bands</CardTitle>
                        <CardDescription>Case severity classification</CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-[300px] flex flex-col pb-6">
                        <div className="flex-1 w-full">
                            <ChartContainer config={riskConfig} className="h-[220px] w-full">
                                <BarChart 
                                    data={riskData} 
                                    layout="vertical"
                                    margin={{ left: -10, right: 20, top: 0, bottom: 0 }}
                                >
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        tick={{fontSize: 10, fill: 'var(--color-foreground)'}}
                                        axisLine={{ stroke: 'var(--color-border)', strokeWidth: 1 }}
                                        tickLine={false}
                                        width={80}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={25}>
                                        {riskData.map((entry: any, index: number) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.originalKey === "high" ? "#ef4444" : entry.originalKey === "medium" ? "#f59e0b" : "var(--color-foreground)"} 
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </div>
                        <div className="space-y-1.5 mt-4 pt-4 border-t border-border/50">
                            {riskData.map((r: any) => (
                                <div key={r.name} className="flex items-center justify-between text-[11px]">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: r.originalKey === "high" ? "#ef4444" : r.originalKey === "medium" ? "#f59e0b" : "var(--color-foreground)" }} />
                                        <span className="capitalize text-muted-foreground">{r.name} Risk</span>
                                    </div>
                                    <span className="font-semibold text-foreground">{r.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* District Prevalence */}
                <Card>
                    <CardHeader>
                        <CardTitle>Regional prevalence</CardTitle>
                        <CardDescription>Detection rates by district</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y text-xs">
                            {stats.by_district.slice(0, 6).map((d: any) => (
                                <div key={d.district} className="p-3 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                        <span className="font-medium">{d.district}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-baseline gap-1">
                                                <span className="font-bold text-destructive">{d.tb_detected}</span>
                                                <span className="text-[10px] text-muted-foreground">of {d.total}</span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground leading-none">Cases Detected</span>
                                        </div>
                                        <Badge variant="outline" className="text-[9px] font-semibold bg-muted/30">
                                            {(d.rate * 100).toFixed(0)}% Rate
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {stats.by_district.length > 6 && (
                            <Button variant="ghost" className="w-full text-xs h-8 text-primary rounded-none border-t">
                                View all {stats.by_district.length} districts
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
