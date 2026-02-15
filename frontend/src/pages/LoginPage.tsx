import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GalleryVerticalEnd, Eye, EyeOff, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

export default function LoginPage() {
    const { theme, setTheme } = useTheme()
    const [view, setView] = useState<"login" | "forgot-password">("login")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [forgotEmail, setForgotEmail] = useState("")
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (email && password) {
            localStorage.setItem("isLoggedIn", "true")
            navigate("/dashboard")
        }
    }

    const handleSignupClick = () => {
        toast.error("New user registration disabled.", {
            description: "Contact the admin for access.",
            action: {
                label: "Dismiss",
                onClick: () => console.log("Dismissed"),
            },
        })
    }

    const handleForgotSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (forgotEmail) {
            toast.success("Reset link sent!", {
                description: `If there is an account with ${forgotEmail}, you will receive directions to reset your password.`,
            })
            setView("login")
            setForgotEmail("")
        }
    }

    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="absolute right-4 top-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    {theme === "dark" ? (
                        <Sun className="h-5 w-5" />
                    ) : (
                        <Moon className="h-5 w-5" />
                    )}
                </Button>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    NexTB
                </a>
                <div className={cn("flex flex-col gap-6")}>
                    <Card>
                        {view === "login" ? (
                            <>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-xl">Welcome back</CardTitle>
                                    <CardDescription>
                                        Login to your account
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid gap-6">
                                            <div className="grid gap-6">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="m@example.com"
                                                        required
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <div className="flex items-center">
                                                        <Label htmlFor="password">Password</Label>
                                                        <button
                                                            type="button"
                                                            onClick={() => setView("forgot-password")}
                                                            className="ml-auto text-sm underline-offset-4 hover:underline cursor-pointer"
                                                        >
                                                            Forgot your password?
                                                        </button>
                                                    </div>
                                                    <div className="relative">
                                                        <Input
                                                            id="password"
                                                            type={showPassword ? "text" : "password"}
                                                            required
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            className="pr-10"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff className="size-4" />
                                                            ) : (
                                                                <Eye className="size-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="remember" />
                                                    <label
                                                        htmlFor="remember"
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        Remember me
                                                    </label>
                                                </div>
                                                <Button type="submit" className="w-full">
                                                    Login
                                                </Button>
                                            </div>
                                            <div className="text-center text-sm">
                                                Don&apos;t have an account?{" "}
                                                <button
                                                    type="button"
                                                    onClick={handleSignupClick}
                                                    className="underline underline-offset-4 hover:text-primary transition-colors cursor-pointer"
                                                >
                                                    Sign up
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                            </>
                        ) : (
                            <>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-xl">Reset Password</CardTitle>
                                    <CardDescription>
                                        Enter your email and we'll send you a link to reset your password.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleForgotSubmit}>
                                        <div className="grid gap-6">
                                            <div className="grid gap-2">
                                                <Label htmlFor="forgot-email">Email</Label>
                                                <Input
                                                    id="forgot-email"
                                                    type="email"
                                                    placeholder="m@example.com"
                                                    required
                                                    value={forgotEmail}
                                                    onChange={(e) => setForgotEmail(e.target.value)}
                                                />
                                            </div>
                                            <Button type="submit" className="w-full">
                                                Send Reset Link
                                            </Button>
                                            <div className="text-center text-sm">
                                                <button
                                                    type="button"
                                                    onClick={() => setView("login")}
                                                    className="underline underline-offset-4 hover:text-primary transition-colors cursor-pointer"
                                                >
                                                    Back to Login
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                            </>
                        )}
                    </Card>
                    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                        and <a href="#">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div>
    )
}

