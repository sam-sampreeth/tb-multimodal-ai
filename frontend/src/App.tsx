import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { MainLayout } from "./components/MainLayout"
import Dashboard from "./pages/Dashboard"
import LoginPage from "./pages/LoginPage"
import NewCasePage from "./pages/NewCasePage"
import HistoryPage from "./pages/HistoryPage"
import ProfilePage from "./pages/ProfilePage"
import CaseDetailPage from "./pages/CaseDetailPage"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="tb-detect-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="new-case" element={<NewCasePage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="history/:caseId" element={<CaseDetailPage />} />
            <Route path="analytics" element={<div className="p-12 text-center text-muted-foreground">Analytics dashboard in development...</div>} />
            <Route path="settings" element={<div className="p-12 text-center text-muted-foreground">Account settings in development...</div>} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" richColors />
    </ThemeProvider >
  )
}


export default App
