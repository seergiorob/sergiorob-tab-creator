"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "es"

type Translations = {
  [key in Language]: {
    [key: string]: string
  }
}

// Add notation guide translations
const translations: Translations = {
  en: {
    appTitle: "Sergio's Tab Creator",
    tabEditor: "Tab Editor",
    addRow: "Add Row",
    clearTab: "Clear Tab",
    saveTab: "Save Tab",
    exportTab: "Export Tab",
    copyToClipboard: "Copy to Clipboard",
    exportScreenshot: "Export as Image",
    screenshotExported: "Screenshot exported!",
    screenshotError: "Error exporting screenshot",
    language: "Language",
    english: "English",
    spanish: "Spanish",
    tabName: "Tab Name",
    save: "Save",
    savedTabs: "Saved Tabs",
    load: "Load",
    delete: "Delete",
    noSavedTabs: "No saved tabs",
    copied: "Copied to clipboard!",
    enterTabName: "Enter tab name",
    notationGuide: "Notation Guide",
    hammerOn: "h - Hammer-on",
    pullOff: "p - Pull-off",
    bend: "b - Bend",
    slideUp: "/ - Slide up",
    slideDown: "\\ - Slide down",
    vibrato: "~ - Vibrato",
  },
  es: {
    appTitle: "Creador de Tablaturas",
    tabEditor: "Editor de Tablatura",
    addRow: "Añadir Fila",
    clearTab: "Limpiar Tablatura",
    saveTab: "Guardar Tablatura",
    exportTab: "Exportar Tablatura",
    copyToClipboard: "Copiar al Portapapeles",
    exportScreenshot: "Exportar como Imagen",
    screenshotExported: "¡Captura exportada!",
    screenshotError: "Error al exportar captura",
    language: "Idioma",
    english: "Inglés",
    spanish: "Español",
    tabName: "Nombre de Tablatura",
    save: "Guardar",
    savedTabs: "Tablaturas Guardadas",
    load: "Cargar",
    delete: "Eliminar",
    noSavedTabs: "No hay tablaturas guardadas",
    copied: "¡Copiado al portapapeles!",
    enterTabName: "Ingrese nombre de tablatura",
    notationGuide: "Guía de Notación",
    hammerOn: "h - Ligado ascendente",
    pullOff: "p - Ligado descendente",
    bend: "b - Bend",
    slideUp: "/ - Deslizamiento ascendente",
    slideDown: "\\ - Deslizamiento descendente",
    vibrato: "~ - Vibrato",
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
