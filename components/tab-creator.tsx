"use client"

import { useState, useEffect, useRef } from "react"
import { useLanguage } from "./language-provider"
import { TabEditor } from "./tab-editor"
import { SavedTabs } from "./saved-tabs"
import { LanguageSwitcher } from "./language-switcher"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import html2canvas from "html2canvas"

export type TabRow = {
  "1": string[]
  "2": string[]
  "3": string[]
  "4": string[]
  "5": string[]
  "6": string[]
}

export type SavedTab = {
  id: string
  name: string
  rows: TabRow[]
}

// Add a NotationGuide component
function NotationGuide() {
  const { t } = useLanguage()

  return (
    <Collapsible className="mt-6 w-full">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-muted rounded-md">
        <span className="font-medium">{t("notationGuide")}</span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 bg-card rounded-md mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>{t("hammerOn")}</div>
        <div>{t("pullOff")}</div>
        <div>{t("bend")}</div>
        <div>{t("slideUp")}</div>
        <div>{t("slideDown")}</div>
        <div>{t("vibrato")}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function TabCreator() {
  const { t } = useLanguage()
  const [tabRows, setTabRows] = useState<TabRow[]>([createEmptyRow()])
  const [tabName, setTabName] = useState("")
  const [savedTabs, setSavedTabs] = useState<SavedTab[]>([])
  const tabEditorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedTabsFromStorage = localStorage.getItem("savedTabs")
    if (savedTabsFromStorage) {
      setSavedTabs(JSON.parse(savedTabsFromStorage))
    }
  }, [])

  function createEmptyRow(): TabRow {
    return {
      "1": Array(16).fill(""),
      "2": Array(16).fill(""),
      "3": Array(16).fill(""),
      "4": Array(16).fill(""),
      "5": Array(16).fill(""),
      "6": Array(16).fill(""),
    }
  }

  const addRow = () => {
    setTabRows([...tabRows, createEmptyRow()])
  }

  const clearTab = () => {
    setTabRows([createEmptyRow()])
  }

  const updateTabCell = (rowIndex: number, string: keyof TabRow, cellIndex: number, value: string) => {
    const newRows = [...tabRows]
    newRows[rowIndex][string][cellIndex] = value
    setTabRows(newRows)
  }

  const saveTab = () => {
    if (!tabName.trim()) {
      toast({
        title: t("enterTabName"),
        duration: 2000,
      })
      return
    }

    const newTab: SavedTab = {
      id: Date.now().toString(),
      name: tabName,
      rows: tabRows,
    }

    const updatedTabs = [...savedTabs, newTab]
    setSavedTabs(updatedTabs)
    localStorage.setItem("savedTabs", JSON.stringify(updatedTabs))

    toast({
      title: `${t("saveTab")}: ${tabName}`,
      duration: 2000,
    })

    setTabName("")
  }

  const loadTab = (tab: SavedTab) => {
    setTabRows(tab.rows)
    setTabName(tab.name)
  }

  const deleteTab = (id: string) => {
    const updatedTabs = savedTabs.filter((tab) => tab.id !== id)
    setSavedTabs(updatedTabs)
    localStorage.setItem("savedTabs", JSON.stringify(updatedTabs))
  }

  const exportTab = () => {
    let tabText = ""

    if (tabName) {
      tabText += `${tabName}\n\n`
    }

    tabRows.forEach((row) => {
      tabText += `1|${row["1"].join("-")}|\n`
      tabText += `2|${row["2"].join("-")}|\n`
      tabText += `3|${row["3"].join("-")}|\n`
      tabText += `4|${row["4"].join("-")}|\n`
      tabText += `5|${row["5"].join("-")}|\n`
      tabText += `6|${row["6"].join("-")}|\n\n`
    })

    navigator.clipboard.writeText(tabText)

    toast({
      title: t("copied"),
      duration: 2000,
    })
  }

  const exportAsScreenshot = async () => {
    if (!tabEditorRef.current) return

    try {
      // Create a wrapper div for the screenshot that includes the title
      const screenshotWrapper = document.createElement("div")
      screenshotWrapper.style.backgroundColor = "#ffffff"
      screenshotWrapper.style.padding = "20px"
      screenshotWrapper.style.borderRadius = "8px"

      // Add the title if it exists
      if (tabName) {
        const titleElement = document.createElement("h2")
        titleElement.textContent = tabName
        titleElement.style.textAlign = "center"
        titleElement.style.marginBottom = "16px"
        titleElement.style.fontFamily = "sans-serif"
        titleElement.style.fontSize = "24px"
        screenshotWrapper.appendChild(titleElement)
      }

      // Clone the tab editor content
      const tabEditorClone = tabEditorRef.current.cloneNode(true)
      screenshotWrapper.appendChild(tabEditorClone)

      // Temporarily add to document, take screenshot, then remove
      document.body.appendChild(screenshotWrapper)

      const canvas = await html2canvas(screenshotWrapper, {
        backgroundColor: "#ffffff",
        scale: 2, // Higher resolution
      })

      document.body.removeChild(screenshotWrapper)

      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = `${tabName || "guitar-tab"}.png`
      link.click()

      toast({
        title: t("screenshotExported"),
        duration: 2000,
      })
    } catch (error) {
      console.error("Error exporting screenshot:", error)
      toast({
        title: t("screenshotError"),
        variant: "destructive",
        duration: 2000,
      })
    }
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("appTitle")}</h1>
        <LanguageSwitcher />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm" ref={tabEditorRef}>
        {tabName && <h2 className="text-xl font-bold text-center mb-4">{tabName}</h2>}
        <TabEditor tabRows={tabRows} updateTabCell={updateTabCell} />
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <Button onClick={addRow}>{t("addRow")}</Button>
        <Button variant="outline" onClick={clearTab}>
          {t("clearTab")}
        </Button>
        <Button variant="outline" onClick={exportTab}>
          {t("copyToClipboard")}
        </Button>
        <Button variant="outline" onClick={exportAsScreenshot}>
          {t("exportScreenshot")}
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="tabName">{t("tabName")}</Label>
          <Input id="tabName" value={tabName} onChange={(e) => setTabName(e.target.value)} className="mt-1" />
        </div>
        <div className="flex items-end">
          <Button onClick={saveTab} className="w-full">
            {t("save")}
          </Button>
        </div>
      </div>

      <NotationGuide />

      <SavedTabs savedTabs={savedTabs} loadTab={loadTab} deleteTab={deleteTab} />

      <Toaster />
    </div>
  )
}
