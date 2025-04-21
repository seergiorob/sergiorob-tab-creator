"use client"

import { useState, useEffect, useRef } from "react"
import { Fretboard } from "./fretboard"
import { TabDisplay } from "./tab-display"
import { SavedTabs } from "./saved-tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
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
  selectedNotes: { [key: string]: { [key: number]: string } }
}

export function TabCreator() {
  const [selectedNotes, setSelectedNotes] = useState<{ [key: string]: { [key: number]: string } }>({})
  const [tabName, setTabName] = useState("")
  const [savedTabs, setSavedTabs] = useState<SavedTab[]>([])
  const [useStringNumbers, setUseStringNumbers] = useState(false)
  const tabRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedTabsFromStorage = localStorage.getItem("savedTabs")
    if (savedTabsFromStorage) {
      setSavedTabs(JSON.parse(savedTabsFromStorage))
    }
  }, [])

  const handleAddNote = (string: string, fret: number, note: string) => {
    setSelectedNotes((prev) => {
      const newNotes = { ...prev }
      if (!newNotes[string]) {
        newNotes[string] = {}
      }
      newNotes[string][fret] = note
      return newNotes
    })
  }

  const handleClearNote = (string: string, fret: number) => {
    setSelectedNotes((prev) => {
      const newNotes = { ...prev }
      if (newNotes[string] && newNotes[string][fret] !== undefined) {
        const { [fret]: _, ...rest } = newNotes[string]
        newNotes[string] = rest
        // If string has no more notes, remove the string entry
        if (Object.keys(newNotes[string]).length === 0) {
          const { [string]: _, ...restStrings } = newNotes
          return restStrings
        }
      }
      return newNotes
    })
  }

  const clearTab = () => {
    setSelectedNotes({})
  }

  const saveTab = () => {
    if (!tabName.trim()) {
      toast({
        title: "Enter tab name",
        duration: 2000,
      })
      return
    }

    if (Object.keys(selectedNotes).length === 0) {
      toast({
        title: "Add some notes to save",
        duration: 2000,
      })
      return
    }

    const newTab: SavedTab = {
      id: Date.now().toString(),
      name: tabName,
      selectedNotes: { ...selectedNotes },
    }

    const updatedTabs = [...savedTabs, newTab]
    setSavedTabs(updatedTabs)
    localStorage.setItem("savedTabs", JSON.stringify(updatedTabs))

    toast({
      title: `Tab saved: ${tabName}`,
      duration: 2000,
    })

    setTabName("")
  }

  const loadTab = (tab: SavedTab) => {
    setSelectedNotes(tab.selectedNotes)
    setTabName(tab.name)
  }

  const deleteTab = (id: string) => {
    const updatedTabs = savedTabs.filter((tab) => tab.id !== id)
    setSavedTabs(updatedTabs)
    localStorage.setItem("savedTabs", JSON.stringify(updatedTabs))
  }

  const exportAsScreenshot = async () => {
    if (!tabRef.current) return

    try {
      // Use the entire tab content for the screenshot
      const canvas = await html2canvas(tabRef.current, {
        backgroundColor: "#0f172a", // Dark background
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
        allowTaint: true,
        onclone: (document, element) => {
          // Make sure all pre elements preserve whitespace
          const preElements = element.querySelectorAll("pre")
          preElements.forEach((pre) => {
            pre.style.whiteSpace = "pre"
            pre.style.fontFamily = "monospace"
          })
        },
      })

      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = `${tabName || "guitar-tab"}.png`
      link.click()

      toast({
        title: "Screenshot exported!",
        duration: 2000,
      })
    } catch (error) {
      console.error("Error exporting screenshot:", error)
      toast({
        title: "Error exporting screenshot",
        variant: "destructive",
        duration: 2000,
      })
    }
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Sergio's Tab Generator</h1>
      </div>

      <div className="bg-card p-2 md:p-6 rounded-lg shadow-sm" ref={tabRef}>
        {tabName && <h2 className="text-xl font-bold text-center mb-2 md:mb-4">{tabName}</h2>}

        <div className="flex justify-end mb-2">
          <Button variant="outline" size="sm" onClick={() => setUseStringNumbers(!useStringNumbers)}>
            {useStringNumbers ? "Use String Names" : "Use String Numbers"}
          </Button>
        </div>

        <Fretboard
          onAddNote={handleAddNote}
          selectedNotes={selectedNotes}
          onClearNote={handleClearNote}
          useStringNumbers={useStringNumbers}
        />

        <TabDisplay selectedNotes={selectedNotes} tabName={tabName} />
      </div>

      <div className="flex flex-wrap gap-1 md:gap-2 mt-2 md:mt-4">
        <Button onClick={clearTab} size="sm" className="text-xs md:text-sm md:size-default">
          Clear Tab
        </Button>
        <Button variant="outline" onClick={exportAsScreenshot} size="sm" className="text-xs md:text-sm md:size-default">
          Export as Image
        </Button>
      </div>

      <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="tabName" className="text-sm">
            Tab Name
          </Label>
          <Input id="tabName" value={tabName} onChange={(e) => setTabName(e.target.value)} className="mt-1" />
        </div>
        <div className="flex items-end">
          <Button onClick={saveTab} className="w-full">
            Save
          </Button>
        </div>
      </div>

      <SavedTabs savedTabs={savedTabs} loadTab={loadTab} deleteTab={deleteTab} />

      <Toaster />
    </div>
  )
}
