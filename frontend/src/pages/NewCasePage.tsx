import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, X, Shield } from "lucide-react"

export default function NewCasePage() {
    const [dragActive, setDragActive] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

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
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age">Age</Label>
                                <Input id="age" type="number" placeholder="45" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Input id="gender" placeholder="Male" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input id="dob" type="date" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" placeholder="New York, NY" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="history">Medical History</Label>
                            <textarea
                                id="history"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Briefly describe patient history..."
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
                                className={`flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
                                    }`}
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                            >
                                <div className="flex flex-col items-center text-center p-6">
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
                    <CardFooter className="pt-0">
                        <Button className="w-full" disabled={!file} size="lg">
                            Analyze Image
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
