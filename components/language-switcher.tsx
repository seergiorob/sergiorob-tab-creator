"use client"

import { useLanguage } from "./language-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-4 w-4" />
          <span className="sr-only">{t("language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          {t("english")}
          {language === "en" && <span className="ml-2">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("es")}>
          {t("spanish")}
          {language === "es" && <span className="ml-2">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
