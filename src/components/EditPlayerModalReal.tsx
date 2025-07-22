'use client'

import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Plus, X, Edit, AlertTriangle, Loader2 } from 'lucide-react'
import { usePlayerService } from '@/hooks/usePlayerService'
import { Player, UpdatePlayerData, PlayerStatus } from '@/lib/services/types'

interface EditPlayerModalRealProps {
  player: Player | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPlayerUpdated?: (player: Player) => void
}

export default function EditPlayerModalReal({ 
  player, 
  open, 
  onOpenChange, 
  onPlayerUpdated 
}: EditPlayerModalRealProps) {
  const [formData, setFormData] = useState<UpdatePlayerData>({})
  const [newTag, setNewTag] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDirty, setIsDirty] = useState(false)

  const { updatePlayer, loading, error, clearError } = usePlayerService()

  // Initialize form data when player changes
  useEffect(() => {
    if (player && open) {
      const initialData: UpdatePlayerData = {
        first_name: player.user?.first_name || '',
        last_name: player.user?.last_name || '',
        phone: player.user?.phone || '',
        date_of_birth: player.date_of_birth || '',
        gender: player.gender || '',
        height: player.height,
        weight: player.weight,
        position: player.position || '',
        sport: player.sport || '',
        team: player.team || '',
        squad: player.squad || '',
        jersey_number: player.jersey_number,
        status: player.status,
        tags: [...(player.tags || [])],
        allergies: player.allergies || '',
        dietary_restrictions: player.dietary_restrictions || '',
        medical_conditions: player.medical_conditions || '',
        emergency_contact: player.emergency_contact ? {
          name: player.emergency_contact.name || '',
          relationship: player.emergency_contact.relationship || '',
          phone: player.emergency_contact.phone || '',
          email: player.emergency_contact.email || ''
        } : {
          name: '',
          relationship: '',
          phone: '',
          email: ''
        },
        notes: player.notes || ''
      }
      setFormData(initialData)
      setIsDirty(false)
      setErrors({})
      clearError()
    }
  }, [player, open, clearError])

  // Track form changes to show unsaved changes warning
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setIsDirty(true)
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleEmergencyContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      emergency_contact: {
        ...prev.emergency_contact!,
        [field]: value
      }
    }))
    setIsDirty(true)
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }))
      setNewTag('')
      setIsDirty(true)
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
    setIsDirty(true)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
    if (!formData.first_name?.trim()) newErrors.first_name = 'First name is required'
    if (!formData.last_name?.trim()) newErrors.last_name = 'Last name is required'

    // Jersey number uniqueness would need server-side validation
    if (formData.jersey_number !== undefined && formData.jersey_number < 0) {
      newErrors.jersey_number = 'Jersey number cannot be negative'
    }

    // Height and weight validation
    if (formData.height !== undefined && (formData.height <= 0 || formData.height > 300)) {
      newErrors.height = 'Height must be between 1 and 300 cm'
    }
    if (formData.weight !== undefined && (formData.weight <= 0 || formData.weight > 500)) {
      newErrors.weight = 'Weight must be between 1 and 500 kg'
    }

    // Emergency contact validation
    if (formData.emergency_contact?.name && !formData.emergency_contact?.phone) {
      newErrors.emergency_contact_phone = 'Emergency contact phone is required when name is provided'
    }

    // Email validation for emergency contact
    if (formData.emergency_contact?.email && !/\S+@\S+\.\S+/.test(formData.emergency_contact.email)) {
      newErrors.emergency_contact_email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!player || !validateForm()) return

    // Only send changed data to API
    const changedData: UpdatePlayerData = {}
    
    // Compare with original player data and only include changed fields
    if (formData.first_name !== player.user?.first_name) changedData.first_name = formData.first_name
    if (formData.last_name !== player.user?.last_name) changedData.last_name = formData.last_name
    if (formData.phone !== player.user?.phone) changedData.phone = formData.phone
    if (formData.date_of_birth !== player.date_of_birth) changedData.date_of_birth = formData.date_of_birth
    if (formData.gender !== player.gender) changedData.gender = formData.gender
    if (formData.height !== player.height) changedData.height = formData.height
    if (formData.weight !== player.weight) changedData.weight = formData.weight
    if (formData.position !== player.position) changedData.position = formData.position
    if (formData.sport !== player.sport) changedData.sport = formData.sport
    if (formData.team !== player.team) changedData.team = formData.team
    if (formData.squad !== player.squad) changedData.squad = formData.squad
    if (formData.jersey_number !== player.jersey_number) changedData.jersey_number = formData.jersey_number
    if (formData.status !== player.status) changedData.status = formData.status
    if (JSON.stringify(formData.tags) !== JSON.stringify(player.tags)) changedData.tags = formData.tags
    if (formData.allergies !== player.allergies) changedData.allergies = formData.allergies
    if (formData.dietary_restrictions !== player.dietary_restrictions) changedData.dietary_restrictions = formData.dietary_restrictions
    if (formData.medical_conditions !== player.medical_conditions) changedData.medical_conditions = formData.medical_conditions
    if (formData.notes !== player.notes) changedData.notes = formData.notes
    
    // Handle emergency contact comparison
    const currentEmergencyContact = player.emergency_contact
    const newEmergencyContact = formData.emergency_contact
    if (JSON.stringify(currentEmergencyContact) !== JSON.stringify(newEmergencyContact)) {
      changedData.emergency_contact = newEmergencyContact
    }

    // If no changes, close modal
    if (Object.keys(changedData).length === 0) {
      handleClose()
      return
    }

    clearError()
    
    const result = await updatePlayer(player.id, changedData)
    
    if (result) {
      setIsDirty(false)
      onOpenChange(false)
      onPlayerUpdated?.(result)
    }
  }

  const handleClose = () => {
    if (isDirty) {
      const shouldClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close without saving?'
      )
      if (!shouldClose) return
    }
    
    onOpenChange(false)
    setIsDirty(false)
    clearError()
    setErrors({})
  }

  if (!player) return null

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Player: {player.user?.first_name} {player.user?.last_name}
          </DialogTitle>
          <DialogDescription>
            Update player information. Only modified fields will be saved.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/15 border border-destructive/20 rounded-lg p-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="athletic">Athletic</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name *</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name || ''}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className={errors.first_name ? 'border-destructive' : ''}
                      />
                      {errors.first_name && (
                        <p className="text-sm text-destructive">{errors.first_name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name *</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name || ''}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className={errors.last_name ? 'border-destructive' : ''}
                      />
                      {errors.last_name && (
                        <p className="text-sm text-destructive">{errors.last_name}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={player.user?.email || ''}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={formData.date_of_birth || ''}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select 
                        value={formData.gender || ''} 
                        onValueChange={(value) => handleInputChange('gender', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="athletic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Athletic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sport">Sport</Label>
                      <Input
                        id="sport"
                        value={formData.sport || ''}
                        onChange={(e) => handleInputChange('sport', e.target.value)}
                        placeholder="e.g., Soccer, Basketball"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={formData.position || ''}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        placeholder="e.g., Forward, Guard"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jersey_number">Jersey Number</Label>
                      <Input
                        id="jersey_number"
                        type="number"
                        value={formData.jersey_number?.toString() || ''}
                        onChange={(e) => handleInputChange('jersey_number', e.target.value ? parseInt(e.target.value) : undefined)}
                        className={errors.jersey_number ? 'border-destructive' : ''}
                      />
                      {errors.jersey_number && (
                        <p className="text-sm text-destructive">{errors.jersey_number}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="team">Team</Label>
                      <Input
                        id="team"
                        value={formData.team || ''}
                        onChange={(e) => handleInputChange('team', e.target.value)}
                        placeholder="e.g., Varsity Men's Soccer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="squad">Squad</Label>
                      <Input
                        id="squad"
                        value={formData.squad || ''}
                        onChange={(e) => handleInputChange('squad', e.target.value)}
                        placeholder="e.g., First Team, JV"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        value={formData.height?.toString() || ''}
                        onChange={(e) => handleInputChange('height', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className={errors.height ? 'border-destructive' : ''}
                      />
                      {errors.height && (
                        <p className="text-sm text-destructive">{errors.height}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={formData.weight?.toString() || ''}
                        onChange={(e) => handleInputChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className={errors.weight ? 'border-destructive' : ''}
                      />
                      {errors.weight && (
                        <p className="text-sm text-destructive">{errors.weight}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={formData.status || 'active'} 
                        onValueChange={(value) => handleInputChange('status', value as PlayerStatus)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="injured">Injured</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {formData.tags?.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies || ''}
                      onChange={(e) => handleInputChange('allergies', e.target.value)}
                      placeholder="List any known allergies..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
                    <Textarea
                      id="dietary_restrictions"
                      value={formData.dietary_restrictions || ''}
                      onChange={(e) => handleInputChange('dietary_restrictions', e.target.value)}
                      placeholder="List any dietary restrictions or preferences..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medical_conditions">Medical Conditions</Label>
                    <Textarea
                      id="medical_conditions"
                      value={formData.medical_conditions || ''}
                      onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
                      placeholder="List any relevant medical conditions..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes || ''}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any additional notes about the player..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emergency" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergency_name">Contact Name</Label>
                      <Input
                        id="emergency_name"
                        value={formData.emergency_contact?.name || ''}
                        onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency_relationship">Relationship</Label>
                      <Input
                        id="emergency_relationship"
                        value={formData.emergency_contact?.relationship || ''}
                        onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                        placeholder="e.g., Parent, Guardian, Spouse"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergency_phone">Phone Number</Label>
                      <Input
                        id="emergency_phone"
                        value={formData.emergency_contact?.phone || ''}
                        onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                        className={errors.emergency_contact_phone ? 'border-destructive' : ''}
                      />
                      {errors.emergency_contact_phone && (
                        <p className="text-sm text-destructive">{errors.emergency_contact_phone}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency_email">Email (Optional)</Label>
                      <Input
                        id="emergency_email"
                        type="email"
                        value={formData.emergency_contact?.email || ''}
                        onChange={(e) => handleEmergencyContactChange('email', e.target.value)}
                        className={errors.emergency_contact_email ? 'border-destructive' : ''}
                      />
                      {errors.emergency_contact_email && (
                        <p className="text-sm text-destructive">{errors.emergency_contact_email}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !isDirty}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}