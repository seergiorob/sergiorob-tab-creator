"use client"

import { useState } from "react"
import { useLanguage } from "./language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Pause } from "lucide-react"

export function StrummingPatterns() {
  const { t } = useLanguage()
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null)

  const patterns = [
    {
      id: "basic",
      name: "Basic (D D D D)",
      pattern: ["D", "D", "D", "D"],
    },
    {
      id: "waltz",
      name: "Waltz (D D U)",
      pattern: ["D", "D", "U"],
    },
    {
      id: "country",
      name: "Country (D DU DU)",
      pattern: ["D", "D", "U", "D", "U"],
    },
    {
      id: "rock",
      name: "Rock (D DU UDU)",
      pattern: ["D", "D", "U", "U", "D", "U"],
    },
    {
      id: "ballad",
      name: "Ballad (D D DU UDU)",
      pattern: ["D", "D", "D", "U", "U", "D", "U"],
    },
    {
      id: "reggae",
      name: "Reggae (D R U R)",
      pattern: ["D", "R", "U", "R"],
    },
    {
      id: "folk",
      name: "Folk (D DU UD DU)",
      pattern: ["D", "D", "U", "U", "D", "D", "U"],
    },
    {
      id: "blues",
      name: "Blues (D U D U D U)",
      pattern: ["D", "U", "D", "U", "D", "U"],
    },
  ]

  const renderStrum = (type: string) => {
    switch (type) {
      case "D":
        return <ArrowDown className="h-6 w-6 text-blue-500" />
      case "U":
        return <ArrowUp className="h-6 w-6 text-green-500" />
      case "R":
        return <Pause className="h-6 w-6 text-gray-500" />
      default:
        return null
    }
  }

  const getStrumName = (type: string) => {
    switch (type) {
      case "D":
        return t("downStrum")
      case "U":
        return t("upStrum")
      case "R":
        return t("rest")
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {patterns.map((pattern) => (
          <Card
            key={pattern.id}
            className={`cursor-pointer transition-all ${selectedPattern === pattern.id ? "border-primary" : ""}`}
            onClick={() => setSelectedPattern(pattern.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{pattern.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-2">
                {pattern.pattern.map((strum, index) => (
                  <div key={index} title={getStrumName(strum)}>
                    {renderStrum(strum)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPattern && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{patterns.find((p) => p.id === selectedPattern)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="flex justify-center space-x-4 mb-4">
                {patterns
                  .find((p) => p.id === selectedPattern)
                  ?.pattern.map((strum, index) => (
                    <div key={index} className="flex flex-col items-center" title={getStrumName(strum)}>
                      {renderStrum(strum)}
                      <span className="text-sm mt-1">{strum}</span>
                    </div>
                  ))}
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  D = {t("downStrum")} | U = {t("upStrum")} | R = {t("rest")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
