"use client"

import type { TabRow } from "./tab-creator"
import { Input } from "@/components/ui/input"

interface TabEditorProps {
  tabRows: TabRow[]
  updateTabCell: (rowIndex: number, string: keyof TabRow, cellIndex: number, value: string) => void
}

export function TabEditor({ tabRows, updateTabCell }: TabEditorProps) {
  const strings: (keyof TabRow)[] = ["1", "2", "3", "4", "5", "6"]

  const handleInputChange = (rowIndex: number, string: keyof TabRow, cellIndex: number, value: string) => {
    // Allow numbers, letters, and common guitar notation symbols
    // This includes: numbers, h (hammer-on), p (pull-off), b (bend), / \ (slides), ~ (vibrato), etc.
    if (/^[0-9a-zA-Z/\\$$$$[\]{}.,\-_+=*&^%$#@!?><~`'";:hp\b\r\t\s]{1,3}$/.test(value)) {
      updateTabCell(rowIndex, string, cellIndex, value)
    }
  }

  return (
    <div className="overflow-x-auto">
      {tabRows.map((row, rowIndex) => (
        <div key={rowIndex} className="mb-8 border rounded-lg p-4 bg-white">
          {strings.map((string) => (
            <div key={string} className="flex items-center mb-2">
              <div className="w-8 font-mono font-bold text-right pr-2">{string}|</div>
              <div className="flex-1 grid grid-cols-16 gap-1">
                {row[string].map((cell, cellIndex) => (
                  <Input
                    key={cellIndex}
                    type="text"
                    value={cell}
                    onChange={(e) => handleInputChange(rowIndex, string, cellIndex, e.target.value)}
                    className="w-full h-8 text-center font-mono p-0 text-xs md:text-sm"
                    maxLength={3}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
