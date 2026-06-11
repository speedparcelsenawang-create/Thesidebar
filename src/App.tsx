import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Home from "@/pages/Home"
import PlanoVm from "@/pages/PlanoVm"
import RouteIist from "@/pages/card/RouteIist"

function AppContent() {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [isPageVisible, setIsPageVisible] = useState(true)

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname || location.search !== displayLocation.search || location.hash !== displayLocation.hash) {
      setIsPageVisible(false)
      const timeout = window.setTimeout(() => {
        setDisplayLocation(location)
        setIsPageVisible(true)
      }, 180)
      return () => window.clearTimeout(timeout)
    }
  }, [location, displayLocation])
  
  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/') return 'Home'
    if (path === '/plano-vm') return 'Plano Vm'
    if (path === '/route-list') return 'Route List'
    return 'Home'
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <div className={isPageVisible ? "app-page-transition app-page-transition--visible" : "app-page-transition app-page-transition--hidden"}>
          <Routes location={displayLocation}>
            <Route path="/" element={<Home />} />
            <Route path="/plano-vm" element={<PlanoVm />} />
            <Route path="/route-list" element={<RouteIist />} />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
