import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, Server } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// Menu data - start dengan Home
const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Plano Vm",
      url: "/plano-vm",
      icon: Server,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredNav = React.useMemo(
    () =>
      data.navMain.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
      ),
    [searchTerm]
  )

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Home className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">My App</span>
                  <span className="text-xs">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SearchForm
          onSubmit={(event) => event.preventDefault()}
          inputProps={{
            id: "sidebar-search",
            value: searchTerm,
            onChange: (event) => setSearchTerm(event.target.value),
            placeholder: "Search pages...",
          }}
        />
        <SidebarGroup>
          <SidebarMenu>
            {filteredNav.length === 0 ? (
              <div className="px-4 py-3 text-sm text-sidebar-foreground/70">
                No matching pages found.
              </div>
            ) : (
              filteredNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      {item.icon && <item.icon className="size-4" />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
