'use client'

import React, { useState, useCallback } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  X,
  FileSpreadsheet
} from 'lucide-react'
import { usePlayerService } from '@/hooks/usePlayerService'
import { CreatePlayerData } from '@/lib/services/types'

interface PlayerImportModalProps {
  onPlayersImported?: () => void
  trigger?: React.ReactNode
}

interface ImportResult {
  success: number
  errors: { data: CreatePlayerData; error: string }[]
  total: number
}

export default function PlayerImportModal({ onPlayersImported, trigger }: PlayerImportModalProps) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<CreatePlayerData[]>([])
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [progress, setProgress] = useState(0)

  const { bulkCreatePlayers, error, clearError } = usePlayerService()

  // CSV template for download
  const csvTemplate = `first_name,last_name,email,phone,date_of_birth,gender,height,weight,position,sport,team,squad,jersey_number,status,tags,allergies,dietary_restrictions,medical_conditions,emergency_contact_name,emergency_contact_relationship,emergency_contact_phone,emergency_contact_email,notes
John,Doe,john.doe@example.com,555-0123,1995-06-15,Male,180.0,75.5,Forward,Soccer,Varsity Men,First Team,10,active,"Speed,Striker",None,Vegetarian,None,Jane Doe,Mother,555-0124,jane.doe@example.com,Promising young player
Jane,Smith,jane.smith@example.com,555-0125,1997-03-22,Female,165.0,60.0,Guard,Basketball,Varsity Women,First Team,23,active,"Defense,Leadership",Peanuts,Gluten-free,Asthma,Robert Smith,Father,555-0126,robert.smith@example.com,Team captain`

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'player_import_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const parseCSV = (text: string): CreatePlayerData[] => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map(h => h.trim())
    const players: CreatePlayerData[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const player: CreatePlayerData = {
        email: '',
        first_name: '',
        last_name: '',
        status: 'active',
        tags: []
      }

      headers.forEach((header, index) => {
        const value = values[index] || ''
        
        switch (header) {
          case 'first_name':
            player.first_name = value
            break
          case 'last_name':
            player.last_name = value
            break
          case 'email':
            player.email = value
            break
          case 'phone':
            player.phone = value || undefined
            break
          case 'date_of_birth':
            player.date_of_birth = value || undefined
            break
          case 'gender':
            player.gender = value || undefined
            break
          case 'height':
            player.height = value ? parseFloat(value) : undefined
            break
          case 'weight':
            player.weight = value ? parseFloat(value) : undefined
            break
          case 'position':
            player.position = value || undefined
            break
          case 'sport':
            player.sport = value || undefined
            break
          case 'team':
            player.team = value || undefined
            break
          case 'squad':
            player.squad = value || undefined
            break
          case 'jersey_number':
            player.jersey_number = value ? parseInt(value) : undefined
            break
          case 'status':
            player.status = (value as any) || 'active'
            break
          case 'tags':
            player.tags = value ? value.split(';').map(t => t.trim()).filter(Boolean) : []
            break
          case 'allergies':
            player.allergies = value || undefined
            break
          case 'dietary_restrictions':
            player.dietary_restrictions = value || undefined
            break
          case 'medical_conditions':
            player.medical_conditions = value || undefined
            break
          case 'emergency_contact_name':
          case 'emergency_contact_relationship':
          case 'emergency_contact_phone':
          case 'emergency_contact_email':
            if (!player.emergency_contact) {
              player.emergency_contact = { name: '', relationship: '', phone: '' }
            }
            const contactField = header.replace('emergency_contact_', '')
            player.emergency_contact[contactField as keyof typeof player.emergency_contact] = value
            break
          case 'notes':
            player.notes = value || undefined
            break
        }
      })

      // Only add players with required fields
      if (player.first_name && player.last_name && player.email) {
        players.push(player)
      }
    }

    return players
  }

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.csv')) {
      alert('Please select a CSV file')
      return
    }

    setFile(selectedFile)
    setImportResult(null)
    clearError()

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      try {
        const parsed = parseCSV(text)
        setCsvData(parsed)
      } catch (err) {
        console.error('Failed to parse CSV:', err)
        alert('Failed to parse CSV file. Please check the format.')
      }
    }
    reader.readAsText(selectedFile)
  }, [clearError])

  const handleImport = async () => {
    if (csvData.length === 0) return

    setImporting(true)
    setProgress(0)
    clearError()

    try {
      const result = await bulkCreatePlayers(csvData)
      
      if (result) {
        setImportResult({
          success: result.success.length,
          errors: result.errors,
          total: csvData.length
        })
        
        if (result.success.length > 0) {
          onPlayersImported?.()
        }
      }
    } catch (err) {
      console.error('Import failed:', err)
    } finally {
      setImporting(false)
      setProgress(100)
    }
  }

  const resetImport = () => {
    setFile(null)
    setCsvData([])
    setImportResult(null)
    setProgress(0)
    clearError()
  }

  const handleClose = () => {
    if (!importing) {
      setOpen(false)
      resetImport()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Players
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Players from CSV
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import multiple players at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Step 1: Download Template</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Download our CSV template to ensure your data is formatted correctly.
              </p>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV Template
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Step 2: Upload CSV File</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-file">Select CSV File</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={importing}
                  />
                </div>

                {file && (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <Badge variant="secondary">{csvData.length} players</Badge>
                    {!importing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetImport}
                        className="ml-auto"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {csvData.length > 0 && !importResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Step 3: Preview & Import</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Found {csvData.length} players ready to import.
                  </p>
                  
                  <div className="max-h-40 overflow-y-auto border rounded-lg">
                    <div className="p-3 border-b bg-muted text-sm font-medium">
                      Preview (first 5 players)
                    </div>
                    {csvData.slice(0, 5).map((player, index) => (
                      <div key={index} className="p-3 border-b last:border-b-0 text-sm">
                        <span className="font-medium">{player.first_name} {player.last_name}</span>
                        <span className="text-muted-foreground ml-2">({player.email})</span>
                        {player.team && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {player.team}
                          </Badge>
                        )}
                      </div>
                    ))}
                    {csvData.length > 5 && (
                      <div className="p-3 text-sm text-muted-foreground text-center">
                        ... and {csvData.length - 5} more players
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress */}
          {importing && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Importing players...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {importResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Import Complete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {importResult.success}
                      </div>
                      <div className="text-sm text-muted-foreground">Successful</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {importResult.errors.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Failed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {importResult.total}
                      </div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                  </div>

                  {importResult.errors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-destructive flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Import Errors
                      </h4>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {importResult.errors.map((error, index) => (
                          <div key={index} className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm">
                            <div className="font-medium">
                              {error.data.first_name} {error.data.last_name} ({error.data.email})
                            </div>
                            <div className="text-destructive">{error.error}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-destructive/15 border border-destructive/20 rounded-lg p-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={importing}>
            {importResult ? 'Close' : 'Cancel'}
          </Button>
          {csvData.length > 0 && !importResult && (
            <Button onClick={handleImport} disabled={importing}>
              {importing ? 'Importing...' : `Import ${csvData.length} Players`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}