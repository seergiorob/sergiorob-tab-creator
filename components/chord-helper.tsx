"use client"

import { useState } from "react"
import { useLanguage } from "./language-provider"
import type { TabRow } from "./tab-creator"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface ChordHelperProps {
  applyChord: (chordFrets: { string: keyof TabRow; fret: string }[], rowIndex?: number) => void
}

type ChordDefinition = {
  name: string
  frets: { string: keyof TabRow; fret: string }[]
}

export function ChordHelper({ applyChord }: ChordHelperProps) {
  const { t } = useLanguage()
  const [selectedChord, setSelectedChord] = useState<string | null>(null)

  const chords: { [key: string]: ChordDefinition } = {
    C: {
      name: "C Major",
      frets: [
        { string: "e", fret: "0" },
        { string: "B", fret: "1" },
        { string: "G", fret: "0" },
        { string: "D", fret: "2" },
        { string: "A", fret: "3" },
        { string: "E", fret: "X" },
      ],
    },
    G: {
      name: "G Major",
      frets: [
        { string: "e", fret: "3" },
        { string: "B", fret: "0" },
        { string: "G", fret: "0" },
        { string: "D", fret: "0" },
        { string: "A", fret: "2" },
        { string: "E", fret: "3" },
      ],
    },
    D: {
      name: "D Major",
      frets: [
        { string: "e", fret: "2" },
        { string: "B", fret: "3" },
        { string: "G", fret: "2" },
        { string: "D", fret: "0" },
        { string: "A", fret: "X" },
        { string: "E", fret: "X" },
      ],
    },
    A: {
      name: "A Major",
      frets: [
        { string: "e", fret: "0" },
        { string: "B", fret: "2" },
        { string: "G", fret: "2" },
        { string: "D", fret: "2" },
        { string: "A", fret: "0" },
        { string: "E", fret: "X" },
      ],
    },
    E: {
      name: "E Major",
      frets: [
        { string: "e", fret: "0" },
        { string: "B", fret: "0" },
        { string: "G", fret: "1" },
        { string: "D", fret: "2" },
        { string: "A", fret: "2" },
        { string: "E", fret: "0" },
      ],
    },
    Am: {
      name: "A Minor",
      frets: [
        { string: "e", fret: "0" },
        { string: "B", fret: "1" },
        { string: "G", fret: "2" },
        { string: "D", fret: "2" },
        { string: "A", fret: "0" },
        { string: "E", fret: "X" },
      ],
    },
    Em: {
      name: "E Minor",
      frets: [
        { string: "e", fret: "0" },
        { string: "B", fret: "0" },
        { string: "G", fret: "0" },
        { string: "D", fret: "2" },
        { string: "A", fret: "2" },
        { string: "E", fret: "0" },
      ],
    },
    Dm: {
      name: "D Minor",
      frets: [
        { string: "e", fret: "1" },
        { string: "B", fret: "3" },
        { string: "G", fret: "2" },
        { string: "D", fret: "0" },
        { string: "A", fret: "X" },
        { string: "E", fret: "X" },
      ],
    },
    F: {
      name: "F Major",
      frets: [
        { string: "e", fret: "1" },
        { string: "B", fret: "1" },
        { string: "G", fret: "2" },
        { string: "D", fret: "3" },
        { string: "A", fret: "3" },
        { string: "E", fret: "1" },
      ],
    },
    B7: {
      name: "B7",
      frets: [
        { string: "e", fret: "0" },
        { string: "B", fret: "0" },
        { string: "G", fret: "2" },
        { string: "D", fret: "1" },
        { string: "A", fret: "2" },
        { string: "E", fret: "X" },
      ],
    },
  }

  const handleChordSelect = (chordKey: string) => {
    setSelectedChord(chordKey)
  }

  const handleApplyChord = () => {
    if (selectedChord && chords[selectedChord]) {
      applyChord(chords[selectedChord].frets)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2">{t("selectChord")}</h3>
          <Select onValueChange={handleChordSelect}>
            <SelectTrigger>
              <SelectValue placeholder={t("selectChord")} />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(chords).map((chordKey) => (
                <SelectItem key={chordKey} value={chordKey}>
                  {chords[chordKey].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleApplyChord} className="mt-4" disabled={!selectedChord}>
            {t("applyChord")}
          </Button>
        </div>

        <div>
          {selectedChord && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">{chords[selectedChord].name}</h3>
                <div className="font-mono">
                  {["e", "B", "G", "D", "A", "E"].map((string) => {
                    const stringFret = chords[selectedChord].frets.find((f) => f.string === string)
                    return (
                      <div key={string} className="flex items-center mb-1">
                        <span className="w-6 text-right pr-2">{string}|</span>
                        <span className="w-6 text-center">{stringFret ? stringFret.fret : "-"}</span>
                        <span>|</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {Object.keys(chords).map((chordKey) => (
          <Button
            key={chordKey}
            variant="outline"
            className={`h-16 ${selectedChord === chordKey ? "border-primary" : ""}`}
            onClick={() => {
              setSelectedChord(chordKey)
              applyChord(chords[chordKey].frets)
            }}
          >
            {chords[chordKey].name}
          </Button>
        ))}
      </div>
    </div>
  )
}
