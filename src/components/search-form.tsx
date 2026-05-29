import type { ComponentProps } from "react"
import { Search } from "lucide-react"

import { Label } from "@/components/ui/label"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar"

export function SearchForm({
  inputProps,
  ...props
}: ComponentProps<"form"> & {
  inputProps?: ComponentProps<typeof SidebarInput>
}) {
  const inputId = inputProps?.id ?? "search"

  return (
    <form {...props}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor={inputId} className="sr-only">
            Search
          </Label>
          <SidebarInput
            id={inputId}
            placeholder="Search the docs..."
            className="pl-8"
            {...inputProps}
          />
          <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  )
}
