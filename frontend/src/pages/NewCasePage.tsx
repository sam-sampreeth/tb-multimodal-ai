import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Shield, Loader2, AlertCircle } from "lucide-react"
import { api } from "@/lib/api"
import type { PatientIn } from "@/types/api"

export default function NewCasePage() {
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [dragActive, setDragActive] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Patient State
    const [patient, setPatient] = useState<PatientIn>({
        patient_id: `P-${Math.floor(Math.random() * 100000)}`,
        age: 30,
        gender: "Male",
        district: "Kathmandu",
        cough_present: false,
        fever: false,
        night_sweats: false,
        weight_loss: false,
        tb_contact: false,
        diabetes: false,
        alcoholism: false,
        immunosuppressed: false,
        previous_tb: "No",
        comorbidities: "",
        symptom_duration: 1
    })

    const handlePatientChange = (field: keyof PatientIn, value: any) => {
        setPatient(prev => ({ ...prev, [field]: value }))
    }

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1]
                resolve(base64)
            }
            reader.onerror = error => reject(error)
        })
    }

    const handleSubmit = async () => {
        if (!file) return;
        setIsSubmitting(true)
        setError(null)

        try {
            const imageBase64 = await fileToBase64(file)
            const response = await api.predict({
                patient: {
                    ...patient,
                    // Remove UI-only fields that backend might reject
                    comorbidities: undefined,
                    symptom_duration: undefined
                } as any,
                xray_base64: imageBase64
            })
            
            // Navigate to results page (if it exists) or history
            navigate(`/history?highlight=${response.case_id}`)
        } catch (err: any) {
            console.error("Prediction failed", err)
            setError(err.message || "Something went wrong during analysis.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleFile = (file: File) => {
        if (file.type.startsWith("image/")) {
            setFile(file)
            const reader = new FileReader()
            reader.onload = (e) => setPreview(e.target?.result as string)
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Patient Information</CardTitle>
                        <CardDescription>Enter patient demographics and medical history</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="patient_id">Patient ID</Label>
                                <Input 
                                    id="patient_id" 
                                    value={patient.patient_id} 
                                    disabled
                                    className="bg-muted font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age">Age</Label>
                                <Input 
                                    id="age" 
                                    type="number" 
                                    value={patient.age} 
                                    onChange={(e) => handlePatientChange("age", parseInt(e.target.value, 10))} 
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select 
                                    value={patient.gender} 
                                    onValueChange={(v) => handlePatientChange("gender", v)}
                                >
                                    <SelectTrigger id="gender">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="district">District (Karnataka)</Label>
                                <Select 
                                    value={patient.district} 
                                    onValueChange={(v) => handlePatientChange("district", v)}
                                >
                                    <SelectTrigger id="district">
                                        <SelectValue placeholder="Select District" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[
                                            "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", 
                                            "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", 
                                            "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", 
                                            "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", 
                                            "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", 
                                            "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"
                                        ].map(d => (
                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Label>Symptoms</Label>
                            <div className="grid grid-cols-2 gap-4 border rounded-md p-3">
                                {[
                                    { id: "cough_present", label: "Cough" },
                                    { id: "fever", label: "Fever" },
                                    { id: "night_sweats", label: "Night Sweats" },
                                    { id: "weight_loss", label: "Weight Loss" }
                                ].map(s => (
                                    <div key={s.id} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={s.id} 
                                            checked={(patient as any)[s.id]} 
                                            onCheckedChange={(checked) => handlePatientChange(s.id as any, !!checked)} 
                                        />
                                        <Label htmlFor={s.id} className="text-sm font-normal">{s.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Label>Clinical History</Label>
                            <div className="grid grid-cols-2 gap-4 border rounded-md p-3">
                                {[
                                    { id: "tb_contact", label: "Contact with TB" },
                                    { id: "diabetes", label: "Diabetes" },
                                    { id: "alcoholism", label: "Alcoholism" },
                                    { id: "immunosuppressed", label: "Immunosuppressed" }
                                ].map(h => (
                                    <div key={h.id} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={h.id} 
                                            checked={(patient as any)[h.id]} 
                                            onCheckedChange={(checked) => handlePatientChange(h.id as any, !!checked)} 
                                        />
                                        <Label htmlFor={h.id} className="text-sm font-normal">{h.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <Label htmlFor="comorbidities">Other Comorbidities</Label>
                            <Input 
                                id="comorbidities" 
                                placeholder="Diabetes, Hypertension, etc." 
                                value={patient.comorbidities}
                                onChange={(e) => handlePatientChange("comorbidities", e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/20 text-primary">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-primary">AI-Powered Analysis</h4>
                                <p className="text-sm text-muted-foreground">
                                    Our advanced deep learning model will analyze the X-ray for patterns indicative of tuberculosis.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>X-ray Upload</CardTitle>
                        <CardDescription>Upload a high-resolution chest X-ray image (DICOM, JPG, PNG)</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        {!preview ? (
                            <div
                                className={`flex h-full min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
                                    }`}
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleFile(e.target.files[0])
                                        }
                                    }}
                                />
                                <div className="flex flex-col items-center text-center p-6 text-xs sm:text-sm">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="mb-1 text-lg font-semibold">Click to upload or drag and drop</h3>
                                    <p className="text-sm text-muted-foreground">Maximum file size: 20MB</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border bg-muted aspect-square">
                                <img src={preview} alt="X-ray preview" className="h-full w-full object-cover" />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 rounded-full h-8 w-8"
                                    onClick={() => {
                                        setFile(null)
                                        setPreview(null)
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="pt-0 flex flex-col gap-4">
                        {error && (
                            <div className="w-full p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2 border border-destructive/20">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}
                        <Button 
                            className="w-full" 
                            disabled={!file || isSubmitting} 
                            size="lg"
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                "Analyze Image"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
