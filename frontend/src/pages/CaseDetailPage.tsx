import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
    Download, 
    ChevronLeft, 
    User, 
    MapPin, 
    Activity, 
    AlertTriangle,
    CheckCircle2,
    ShieldAlert,
    Loader2,
    Maximize2
} from "lucide-react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogTrigger 
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import type { PredictResponse } from "@/types/api"

const toSentenceCase = (str: string) => {
    if (!str) return ""
    const formatted = str.toLowerCase().replace(/_/g, " ")
    return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export default function CaseDetailPage() {
    const { caseId } = useParams<{ caseId: string }>()
    const navigate = useNavigate()
    const [data, setData] = useState<PredictResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeXray, setActiveXray] = useState<"original" | "heatmap" | "overlay">("overlay")

    useEffect(() => {
        if (!caseId) return

        setIsLoading(true)
        api.getCase(caseId)
            .then(res => {
                setData(res)
                setIsLoading(false)
            })
            .catch(err => {
                console.error("Failed to fetch case details", err)
                setError(err.message || "Failed to load case details")
                setIsLoading(false)
            })
    }, [caseId])

    const handleDownloadPdf = () => {
        if (!caseId) return
        window.open(api.getCasePdfUrl(caseId), "_blank")
    }

    if (isLoading) {
        return (
            <div className="flex h-[600px] flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading case data...</p>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center gap-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <h2 className="text-xl font-semibold">Case Not Found</h2>
                <p className="text-muted-foreground">{error || "The requested case could not be located."}</p>
                <Button onClick={() => navigate("/history")}>Return to History</Button>
            </div>
        )
    }

    const { tb_detection, drug_resistance, clinical_risk, heatmap } = data || {}

    return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/history")}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Case Details</h2>
                        <p className="text-sm text-muted-foreground">ID: {data.case_id} • Analyzed on {new Date(data.timestamp).toLocaleString()}</p>
                    </div>
                </div>
                <Button onClick={handleDownloadPdf}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                {/* Left Column: X-ray and Predictions */}
                <div className="md:col-span-8 space-y-6">
                    {/* X-ray View */}
                    <Card className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 py-4">
                            <CardTitle className="text-lg">Chest Radiograph (X-ray)</CardTitle>
                            <div className="flex gap-2">
                                <Button 
                                    variant={activeXray === "original" ? "default" : "outline"} 
                                    size="sm" 
                                    onClick={() => setActiveXray("original")}
                                >
                                    Original
                                </Button>
                                <Button 
                                    variant={activeXray === "heatmap" ? "default" : "outline"} 
                                    size="sm" 
                                    onClick={() => setActiveXray("heatmap")}
                                >
                                    Heatmap
                                </Button>
                                <Button 
                                    variant={activeXray === "overlay" ? "default" : "outline"} 
                                    size="sm" 
                                    onClick={() => setActiveXray("overlay")}
                                >
                                    Overlay
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 bg-black flex items-center justify-center relative max-h-[450px] overflow-hidden group cursor-zoom-in">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className="w-full h-full flex items-center justify-center relative">
                                        {activeXray === "original" && heatmap?.original_base64 && (
                                            <img 
                                                src={`data:image/jpeg;base64,${heatmap.original_base64}`} 
                                                className="h-full w-full object-contain" 
                                                alt="Original Xray"
                                            />
                                        )}
                                        {activeXray === "heatmap" && heatmap?.heatmap_only_base64 && (
                                            <img 
                                                src={`data:image/jpeg;base64,${heatmap.heatmap_only_base64}`} 
                                                className="h-full w-full object-contain" 
                                                alt="AI Heatmap"
                                            />
                                        )}
                                        {activeXray === "overlay" && heatmap?.overlay_base64 && (
                                            <img 
                                                src={`data:image/jpeg;base64,${heatmap.overlay_base64}`} 
                                                className="h-full w-full object-contain" 
                                                alt="AI Overlay"
                                            />
                                        )}
                                        
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-black/60 p-3 rounded-full backdrop-blur-md border border-white/20">
                                                <Maximize2 className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-black border-none flex flex-col">
                                    <DialogHeader className="p-4 bg-muted/10 border-b border-white/10 shrink-0 flex flex-row items-center justify-between">
                                        <DialogTitle className="text-white flex items-center gap-2">
                                            {toSentenceCase(activeXray)} view — Patient {data.patient_id}
                                        </DialogTitle>
                                        <div className="flex gap-2 mr-8">
                                            <Button 
                                                variant={activeXray === "original" ? "default" : "outline"} 
                                                size="sm" 
                                                className={cn(activeXray !== "original" && "text-white border-white/20 hover:bg-white/10")}
                                                onClick={() => setActiveXray("original")}
                                            >
                                                Original
                                            </Button>
                                            <Button 
                                                variant={activeXray === "heatmap" ? "default" : "outline"} 
                                                size="sm" 
                                                className={cn(activeXray !== "heatmap" && "text-white border-white/20 hover:bg-white/10")}
                                                onClick={() => setActiveXray("heatmap")}
                                            >
                                                Heatmap
                                            </Button>
                                            <Button 
                                                variant={activeXray === "overlay" ? "default" : "outline"} 
                                                size="sm" 
                                                className={cn(activeXray !== "overlay" && "text-white border-white/20 hover:bg-white/10")}
                                                onClick={() => setActiveXray("overlay")}
                                            >
                                                Overlay
                                            </Button>
                                        </div>
                                    </DialogHeader>
                                    <div className="flex-1 w-full h-full relative flex items-center justify-center bg-black min-h-0 overflow-hidden">
                                        {activeXray === "original" && heatmap?.original_base64 && (
                                            <img 
                                                src={`data:image/jpeg;base64,${heatmap.original_base64}`} 
                                                className="w-full h-full object-contain select-none" 
                                                alt="Original xray expanded"
                                            />
                                        )}
                                        {activeXray === "heatmap" && heatmap?.heatmap_only_base64 && (
                                            <img 
                                                src={`data:image/jpeg;base64,${heatmap.heatmap_only_base64}`} 
                                                className="w-full h-full object-contain select-none" 
                                                alt="Ai heatmap expanded"
                                            />
                                        )}
                                        {activeXray === "overlay" && heatmap?.overlay_base64 && (
                                            <img 
                                                src={`data:image/jpeg;base64,${heatmap.overlay_base64}`} 
                                                className="w-full h-full object-contain select-none" 
                                                alt="Ai overlay expanded"
                                            />
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {(!heatmap || !heatmap[`${activeXray}_base64` as keyof typeof heatmap]) && (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <Activity className="h-8 w-8 animate-pulse" />
                                    <p className="text-sm">Image analysis in progress or unavailable</p>
                                </div>
                            )}
                            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-[10px] text-white/80 uppercase tracking-widest font-medium pointer-events-none">
                                AI Analysis Support Layer
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Interpretation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                AI Interpretation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-xl bg-muted/30 border text-sm leading-relaxed">
                                {data.finding_text}
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Recommendations
                                </h4>
                                <ul className="grid gap-2">
                                    {data.recommendations.map((rec, i) => (
                                        <li key={i} className="text-xs text-muted-foreground flex gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Summaries */}
                <div className="md:col-span-4 space-y-6">
                    {/* Detection Summary */}
                    <Card className={cn(
                        "border-t-4",
                        tb_detection?.zone === "DETECTED" ? "border-t-destructive" : 
                        tb_detection?.zone === "BORDERLINE" ? "border-t-amber-500" : "border-t-teal-500"
                    )}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground tracking-wider">Tb detection result</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <div className="text-3xl font-bold flex items-baseline gap-1">
                                    {tb_detection ? Math.round(tb_detection.probability * 100) : "--"}
                                    <span className="text-lg font-normal text-muted-foreground">%</span>
                                </div>
                                {tb_detection && (
                                    <Badge className={cn(
                                        "w-fit px-3 py-1 text-xs font-bold",
                                        tb_detection.zone === "DETECTED" ? "bg-destructive/10 text-destructive border-destructive/20" : 
                                        tb_detection.zone === "BORDERLINE" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-teal-500/10 text-teal-600 border-teal-500/20"
                                    )}>
                                        {toSentenceCase(tb_detection.zone)}
                                    </Badge>
                                )}
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    Threshold used: {tb_detection?.threshold_used || "--"} ({tb_detection?.calibrated ? "Calibrated" : "Uncalibrated"})
                                </p>
                            </div>
 
                            <Separator />
 
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-semibold tracking-wider text-muted-foreground mb-2">Drug resistance prediction</h4>
                                    <div className="flex items-center gap-2">
                                        <ShieldAlert className={cn(
                                            "h-5 w-5",
                                            drug_resistance.prediction === "Resistant" ? "text-destructive" : "text-green-500"
                                        )} />
                                        <span className="font-semibold">{drug_resistance.prediction}</span>
                                    </div>
                                    {drug_resistance.is_demo_mode && (
                                        <p className="text-[10px] text-amber-600 mt-1 dark:text-amber-400">
                                            ⚠️ Predicted based on patient demographics (Demo Mode)
                                        </p>
                                    )}
                                </div>
 
                                <div>
                                    <h4 className="text-xs font-semibold tracking-wider text-muted-foreground mb-2">Clinical risk band</h4>
                                    <Badge className={cn(
                                        "capitalize",
                                        clinical_risk.band === "HIGH" ? "bg-red-500/10 text-red-600" : 
                                        clinical_risk.band === "MEDIUM" ? "bg-orange-500/10 text-orange-600" : "bg-blue-500/10 text-blue-600"
                                    )}>
                                        {toSentenceCase(clinical_risk.band)} risk (Score: {clinical_risk.score})
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
 
                    {/* Patient Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                Patient details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-y-4 text-sm">
                                <div className="space-y-1">
                                    <div className="text-[10px] text-muted-foreground">Patient id</div>
                                    <div className="font-mono bg-muted/50 px-2 py-0.5 rounded w-fit">{data.patient_id}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] text-muted-foreground">Gender</div>
                                    <div className="font-medium capitalize">{data.patient.gender}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] text-muted-foreground">Age</div>
                                    <div className="font-medium">{data.patient.age} years</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] text-muted-foreground">District</div>
                                    <div className="font-medium flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {data.patient.district || "Unknown"}
                                    </div>
                                </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="space-y-3">
                                <h4 className="text-xs font-semibold tracking-wider text-muted-foreground">Clinical flags</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {clinical_risk.factors.length > 0 ? (
                                        clinical_risk.factors.map(f => (
                                            <Badge key={f} variant="outline" className="text-[10px] font-normal py-0">
                                                {f}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic">No specific risk factors flagged.</span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
 
                    {/* Meta Information */}
                    <Card className="bg-muted/10">
                        <CardContent className="p-4 space-y-2">
                            <div className="flex items-center justify-between text-[10px]">
                                <span className="text-muted-foreground tracking-widest">Model version</span>
                                <span className="font-mono">{data.model_meta.model_version}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                                <span className="text-muted-foreground tracking-widest">Processing node</span>
                                <span className="font-mono">{data.model_meta.device}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                                <span className="text-muted-foreground tracking-widest">Validation AUC</span>
                                <span className="font-mono">{data.model_meta.auc.toFixed(4)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
