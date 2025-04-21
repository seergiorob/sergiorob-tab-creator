"use client"

import type { SavedTab } from "./tab-creator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, FileText } from "lucide-react"

interface SavedTabsProps {
  savedTabs: SavedTab[]
  loadTab: (tab: SavedTab) => void
  deleteTab: (id: string) => void
}

export function SavedTabs({ savedTabs, loadTab, deleteTab }: SavedTabsProps) {
  if (savedTabs.length === 0) {
    return null
  }

  return (
    <Card className="mt-4 md:mt-8">
      <CardHeader className="p-3 md:p-6">
        <CardTitle>Saved Tabs</CardTitle>
        <CardDescription>{savedTabs.length > 0 ? `${savedTabs.length} saved tabs` : "No saved tabs"}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 md:p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          {savedTabs.map((tab) => (
            <Card key={tab.id} className="bg-card">
              <CardContent className="p-2 md:p-4 flex justify-between items-center">
                <div className="font-medium truncate">{tab.name}</div>
                <div className="flex space-x-1 md:space-x-2">
                  <Button variant="outline" size="icon" onClick={() => loadTab(tab)} title="Load">
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => deleteTab(tab.id)} title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
