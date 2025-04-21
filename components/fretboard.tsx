"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

// Define the notes for standard tuning
const STRING_NOTES = {
  "1": {
    open: "E4",
    notes: [
      "F4",
      "F#4/Gb4",
      "G4",
      "G#4/Ab4",
      "A4",
      "A#4/Bb4",
      "B4",
      "C5",
      "C#5/Db5",
      "D5",
      "D#5/Eb5",
      "E5",
      "F5",
      "F#5/Gb5",
      "G5",
      "G#5/Ab5",
      "A5",
      "A#5/Bb5",
      "B5",
      "C6",
      "C#6/Db6",
      "D6",
      "D#6/Eb6",
      "E6",
    ],
  },
  "2": {
    open: "B3",
    notes: [
      "C4",
      "C#4/Db4",
      "D4",
      "D#4/Eb4",
      "E4",
      "F4",
      "F#4/Gb4",
      "G4",
      "G#4/Ab4",
      "A4",
      "A#4/Bb4",
      "B4",
      "C5",
      "C#5/Db5",
      "D5",
      "D#5/Eb5",
      "E5",
      "F5",
      "F#5/Gb5",
      "G5",
      "G#5/Ab5",
      "A5",
      "A#5/Bb5",
      "B5",
    ],
  },
  "3": {
    open: "G3",
    notes: [
      "G#3/Ab3",
      "A3",
      "A#3/Bb3",
      "B3",
      "C4",
      "C#4/Db4",
      "D4",
      "D#4/Eb4",
      "E4",
      "F4",
      "F#4/Gb4",
      "G4",
      "G#4/Ab4",
      "A4",
      "A#4/Bb4",
      "B4",
      "C5",
      "C#5/Db5",
      "D5",
      "D#5/Eb5",
      "E5",
      "F5",
      "F#5/Gb5",
      "G5",
    ],
  },
  "4": {
    open: "D3",
    notes: [
      "D#3/Eb3",
      "E3",
      "F3",
      "F#3/Gb3",
      "G3",
      "G#3/Ab3",
      "A3",
      "A#3/Bb3",
      "B3",
      "C4",
      "C#4/Db4",
      "D4",
      "D#4/Eb4",
      "E4",
      "F4",
      "F#4/Gb4",
      "G4",
      "G#4/Ab4",
      "A4",
      "A#4/Bb4",
      "B4",
      "C5",
      "C#5/Db5",
      "D5",
    ],
  },
  "5": {
    open: "A2",
    notes: [
      "A#2/Bb2",
      "B2",
      "C3",
      "C#3/Db3",
      "D3",
      "D#3/Eb3",
      "E3",
      "F3",
      "F#3/Gb3",
      "G3",
      "G#3/Ab3",
      "A3",
      "A#3/Bb3",
      "B3",
      "C4",
      "C#4/Db4",
      "D4",
      "D#4/Eb4",
      "E4",
      "F4",
      "F#4/Gb4",
      "G4",
      "G#4/Ab4",
      "A4",
    ],
  },
  "6": {
    open: "E2",
    notes: [
      "F2",
      "F#2/Gb2",
      "G2",
      "G#2/Ab2",
      "A2",
      "A#2/Bb2",
      "B2",
      "C3",
      "C#3/Db3",
      "D3",
      "D#3/Eb3",
      "E3",
      "F3",
      "F#3/Gb3",
      "G3",
      "G#3/Ab3",
      "A3",
      "A#3/Bb3",
      "B3",
      "C4",
      "C#4/Db4",
      "D4",
      "D#4/Eb4",
      "E4",
    ],
  },
}

// Define string names for display
const STRING_NAMES = {
  "1": "E",
  "2": "B",
  "3": "G",
  "4": "D",
  "5": "A",
  "6": "E",
}

// Define the note for each fret position
const getNote = (string: string, fret: number): string => {
  if (fret === 0) {
    return STRING_NOTES[string as keyof typeof STRING_NOTES].open
  }
  return STRING_NOTES[string as keyof typeof STRING_NOTES].notes[fret - 1]
}

// Get the simple note name (without octave)
const getSimpleNoteName = (note: string): string => {
  return note.replace(/[0-9]/g, "").split("/")[0]
}

interface FretboardProps {
  onAddNote: (string: string, fret: number, note: string) => void
  selectedNotes: { [key: string]: { [key: number]: string } }
  onClearNote: (string: string, fret: number) => void
  useStringNumbers?: boolean
}

export function Fretboard({ onAddNote, selectedNotes, onClearNote, useStringNumbers = false }: FretboardProps) {
  const [showFretboard, setShowFretboard] = useState(true)
  const [numFrets, setNumFrets] = useState(16)

  const strings = ["1", "2", "3", "4", "5", "6"]
  const frets = Array.from({ length: numFrets + 1 }, (_, i) => i) // 0 to numFrets

  const handleFretClick = (string: string, fret: number) => {
    const note = getNote(string, fret)
    onAddNote(string, fret, note)
  }

  const isNoteSelected = (string: string, fret: number) => {
    return selectedNotes[string] && selectedNotes[string][fret] !== undefined
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Fretboard</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFretboard(!showFretboard)}>
            {showFretboard ? "Hide Fretboard" : "Show Fretboard"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setNumFrets(numFrets === 16 ? 24 : 16)}>
            {numFrets === 16 ? "Show More Frets" : "Show Fewer Frets"}
          </Button>
        </div>
      </div>

      {showFretboard && (
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[800px]">
            {/* Fret numbers */}
            <div className="flex">
              <div className="w-8 flex-shrink-0"></div>
              {frets.map((fret) => (
                <div key={`top-${fret}`} className="flex-1 text-center text-xs">
                  {fret}
                </div>
              ))}
            </div>

            {/* Strings and frets */}
            {strings.map((string) => (
              <div key={string} className="flex">
                <div className="w-8 flex-shrink-0 flex items-center justify-center font-bold text-orange-500">
                  {useStringNumbers ? string : STRING_NAMES[string as keyof typeof STRING_NAMES]}
                </div>
                {frets.map((fret) => (
                  <div
                    key={`${string}-${fret}`}
                    className={`
                      flex-1 relative border-b border-gray-400 
                      ${fret === 0 ? "bg-gray-700" : "bg-amber-950"} 
                      ${[3, 5, 7, 9, 12, 15, 17, 19, 21, 24].includes(fret) ? 'after:content-[""] after:absolute after:w-2 after:h-2 after:rounded-full after:bg-gray-300 after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-30' : ""}
                      ${fret === 12 ? "after:w-3 after:h-3 after:opacity-50" : ""}
                      h-8 cursor-pointer hover:opacity-80
                    `}
                    onClick={() => handleFretClick(string, fret)}
                  >
                    {isNoteSelected(string, fret) && (
                      <div className="absolute inset-1 bg-green-500 rounded flex items-center justify-center">
                        <button
                          className="absolute top-0 right-0 text-xs text-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            onClearNote(string, fret)
                          }}
                        >
                          <X size={12} />
                        </button>
                        <span className="text-xs font-bold text-white">{fret}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {/* Fret numbers (bottom) */}
            <div className="flex">
              <div className="w-8 flex-shrink-0"></div>
              {frets.map((fret) => (
                <div key={`bottom-${fret}`} className="flex-1 text-center text-xs">
                  {fret}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
