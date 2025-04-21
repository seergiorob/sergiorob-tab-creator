"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface TabDisplayProps {
  selectedNotes: { [key: string]: { [key: number]: string } }
  tabName: string
}

export function TabDisplay({ selectedNotes, tabName }: TabDisplayProps) {
  const [showNotes, setShowNotes] = useState(true)
  const [useStringNames, setUseStringNames] = useState(true)

  // Convert the selected notes into a tab format
  const generateTab = () => {
    const strings = ["1", "2", "3", "4", "5", "6"]
    const stringNames = ["E", "B", "G", "D", "A", "E"]

    let tab = tabName ? `${tabName}\n\n` : ""

    // Find the highest fret number to determine tab width
    let maxFret = 0
    for (const string in selectedNotes) {
      for (const fret in selectedNotes[string]) {
        maxFret = Math.max(maxFret, Number.parseInt(fret))
      }
    }

    // Create tab lines
    strings.forEach((string, index) => {
      // Use string names or numbers based on the toggle
      const stringIdentifier = useStringNames ? stringNames[index] : string
      tab += `${stringIdentifier}|`

      // Get all frets for this string and sort them
      const stringFrets = Object.keys(selectedNotes[string] || {})
        .map((fret) => Number.parseInt(fret))
        .sort((a, b) => a - b)

      if (stringFrets.length === 0) {
        // If no frets selected for this string, fill with dashes
        tab += "-".repeat(maxFret * 2 + 10)
      } else {
        // Create the tab line with proper spacing
        let currentPosition = 0
        let tabLine = ""

        stringFrets.forEach((fret) => {
          // Add dashes to reach the current fret position
          const spacesToAdd = (fret - currentPosition) * 2
          if (spacesToAdd > 0) {
            tabLine += "-".repeat(spacesToAdd)
          }

          // Add the note or fret number
          if (showNotes) {
            const noteName = selectedNotes[string][fret].split("/")[0].replace(/[0-9]/g, "")
            tabLine += noteName
          } else {
            tabLine += fret.toString()
          }

          // Update current position (add 1 for the note/fret we just added)
          currentPosition = fret + 1
        })

        // Add trailing dashes
        tabLine += "-".repeat(Math.max(0, (maxFret + 5 - currentPosition) * 2))
        tab += tabLine
      }

      tab += "|\n"
    })

    return tab
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
        <h2 className="text-lg font-bold">Tab</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowNotes(!showNotes)}>
            {showNotes ? "Show Fret Numbers" : "Show Note Names"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setUseStringNames(!useStringNames)}>
            {useStringNames ? "Use String Numbers" : "Use String Names"}
          </Button>
        </div>
      </div>

      <pre className="font-mono text-sm p-4 bg-black rounded-md border border-gray-700 whitespace-pre overflow-x-auto">
        {generateTab()}
      </pre>
    </div>
  )
}
