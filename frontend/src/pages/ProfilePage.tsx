
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, Lock, Save, Building, IdCard, Mail } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function ProfilePage() {
    const navigate = useNavigate()
    const userEmail = localStorage.getItem("userEmail") || "doctor@nextb.ai"
    const [name, setName] = useState("Dr. Sampreeth")
    const [org, setOrg] = useState("Apollo Hospital, Bangalore")
    const [license, setLicense] = useState("KA-MC-2024-8921")

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("userEmail")
        navigate("/login")
    }

    const handleSave = () => {
        toast.success("Profile updated successfully")
    }

    const handlePasswordReset = () => {
        toast.info("Password reset link sent to your email")
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Profile & Settings</h1>
                <Badge variant="outline" className="ml-auto">v1.2.0</Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Basic Info Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                            Your personal details and role within the organization.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-center py-4">
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-background shadow-xl">
                                <span className="text-2xl font-bold">DR</span>
                                <Badge className="absolute -bottom-2 border-2 border-background px-2 py-0.5" variant="secondary">
                                    Doctor
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        value={userEmail}
                                        disabled
                                        className="bg-muted pl-9 font-mono text-muted-foreground"
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                    Contact admin for email change.
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="org">Organization / Hospital</Label>
                                <div className="relative">
                                    <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="org"
                                        value={org}
                                        onChange={(e) => setOrg(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="license">Medical License ID</Label>
                                <div className="relative">
                                    <IdCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="license"
                                        value={license}
                                        disabled
                                        onChange={(e) => setLicense(e.target.value)}
                                        className="bg-muted pl-9 font-mono text-muted-foreground"
                                        placeholder="Enter License Number"
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                    Medical license number cannot be changed.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 px-6 py-4">
                        <Button onClick={handleSave} size="sm" className="ml-auto gap-2">
                            <Save className="h-4 w-4" />
                            Save Changes
                        </Button>
                    </CardFooter>
                </Card>

                {/* Quick Actions Section */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Security</CardTitle>
                            <CardDescription>
                                Manage your password and session settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Password</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Last changed 3 months ago
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" onClick={handlePasswordReset}>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Change
                                </Button>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-destructive/5 border-destructive/20">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-destructive">Sign Out</Label>
                                    <p className="text-xs text-destructive/80">
                                        Securely end your current session
                                    </p>
                                </div>
                                <Button variant="destructive" size="sm" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>System Role</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium">Access Level</span>
                                    <span className="text-xs text-muted-foreground">Standard Doctor Permissions</span>
                                </div>
                                <Badge variant="secondary">Doctor</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
