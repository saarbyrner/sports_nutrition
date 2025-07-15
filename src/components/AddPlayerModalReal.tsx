'use client'

import React, { useState } from 'react'
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
  DialogTrigger,
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
import { Plus, X, UserPlus, AlertTriangle } from 'lucide-react'
import { usePlayerService } from '@/hooks/usePlayerService'
import { CreatePlayerData, PlayerStatus } from '@/lib/services/types'

interface AddPlayerModalRealProps {
  onPlayerAdded?: (player: any) => void
  trigger?: React.ReactNode
}

export default function AddPlayerModalReal({ onPlayerAdded, trigger }: AddPlayerModalRealProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<CreatePlayerData>({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    height: undefined,
    weight: undefined,
    position: '',
    sport: '',
    team: '',
    squad: '',
    jersey_number: undefined,
    status: 'active',
    tags: [],
    allergies: '',
    dietary_restrictions: '',
    medical_conditions: '',
    emergency_contact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    notes: ''
  })
  const [newTag, setNewTag] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { createPlayer, loading, error, clearError } = usePlayerService()

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.first_name) newErrors.first_name = 'First name is required'
    if (!formData.last_name) newErrors.last_name = 'Last name is required'

    // Email format validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Emergency contact validation
    if (formData.emergency_contact?.name && !formData.emergency_contact?.phone) {
      newErrors.emergency_contact_phone = 'Emergency contact phone is required when name is provided'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
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
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    clearError()
    
    const result = await createPlayer(formData)
    
    if (result) {
      // Reset form
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        height: undefined,
        weight: undefined,
        position: '',
        sport: '',
        team: '',
        squad: '',
        jersey_number: undefined,
        status: 'active',
        tags: [],
        allergies: '',
        dietary_restrictions: '',
        medical_conditions: '',
        emergency_contact: {
          name: '',
          relationship: '',
          phone: '',
          email: ''
        },
        notes: ''
      })
      setErrors({})
      setOpen(false)
      onPlayerAdded?.(result)
    }
  }

  const handleClose = () => {
    setOpen(false)
    clearError()
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Player
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Player
          </DialogTitle>
          <DialogDescription>
            Create a new player profile with personal, athletic, and medical information.
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
                        value={formData.first_name}
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
                        value={formData.last_name}
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
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
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
                        value={formData.date_of_birth}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
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
                        value={formData.sport}
                        onChange={(e) => handleInputChange('sport', e.target.value)}
                        placeholder="e.g., Soccer, Basketball"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        placeholder="e.g., Forward, Guard"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jersey_number">Jersey Number</Label>
                      <Input
                        id="jersey_number"
                        type="number"
                        value={formData.jersey_number || ''}
                        onChange={(e) => handleInputChange('jersey_number', e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="team">Team</Label>
                      <Input
                        id="team"
                        value={formData.team}
                        onChange={(e) => handleInputChange('team', e.target.value)}
                        placeholder="e.g., Varsity Men's Soccer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="squad">Squad</Label>
                      <Input
                        id="squad"
                        value={formData.squad}
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
                        value={formData.height || ''}
                        onChange={(e) => handleInputChange('height', e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={formData.weight || ''}
                        onChange={(e) => handleInputChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value as PlayerStatus)}>
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
                      value={formData.allergies}
                      onChange={(e) => handleInputChange('allergies', e.target.value)}
                      placeholder="List any known allergies..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
                    <Textarea
                      id="dietary_restrictions"
                      value={formData.dietary_restrictions}
                      onChange={(e) => handleInputChange('dietary_restrictions', e.target.value)}
                      placeholder="List any dietary restrictions or preferences..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medical_conditions">Medical Conditions</Label>
                    <Textarea
                      id="medical_conditions"
                      value={formData.medical_conditions}
                      onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
                      placeholder="List any relevant medical conditions..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
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
                      />
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Player'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}