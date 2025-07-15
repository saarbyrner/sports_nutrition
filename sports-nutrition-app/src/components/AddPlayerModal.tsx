import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  CalendarDays,
  User,
  Mail,
  Phone,
  Ruler,
  Weight,
  Trophy,
  Users,
  AlertTriangle,
  Utensils,
  Save,
  X,
  Plus
} from 'lucide-react';

interface PlayerFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  
  // Physical Data
  height: string;
  weight: string;
  position: string;
  sport: string;
  
  // Team Assignment
  team: string;
  squad: string;
  
  // Health & Dietary
  allergies: string;
  dietaryRestrictions: string;
  medicalConditions: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  
  // Additional Notes
  notes: string;
}

interface AddPlayerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlayerAdd: (playerData: PlayerFormData) => void;
}

const initialFormData: PlayerFormData = {
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  gender: '',
  phoneNumber: '',
  height: '',
  weight: '',
  position: '',
  sport: '',
  team: '',
  squad: '',
  allergies: '',
  dietaryRestrictions: '',
  medicalConditions: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',
  notes: ''
};

// Mock data for dropdowns - in real implementation, these would come from your database
const mockTeams = [
  'Men\'s Soccer',
  'Women\'s Soccer', 
  'Men\'s Basketball',
  'Women\'s Basketball',
  'Track & Field',
  'Swimming',
  'Tennis',
  'Volleyball'
];

const mockSquads = [
  'Varsity',
  'Junior Varsity',
  'U23',
  'U21',
  'U19',
  'U18',
  'Academy',
  'Development'
];

const mockSports = [
  'Soccer',
  'Basketball',
  'Track & Field',
  'Swimming',
  'Tennis',
  'Volleyball',
  'Baseball',
  'Softball',
  'Wrestling',
  'Cross Country'
];

const mockPositions = {
  'Soccer': ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
  'Basketball': ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'],
  'Track & Field': ['Sprinter', 'Distance Runner', 'Jumper', 'Thrower', 'Multi-Event'],
  'Swimming': ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Individual Medley'],
  'Tennis': ['Singles', 'Doubles'],
  'Volleyball': ['Outside Hitter', 'Middle Blocker', 'Setter', 'Libero', 'Opposite Hitter'],
  'Baseball': ['Pitcher', 'Catcher', 'Infielder', 'Outfielder'],
  'Softball': ['Pitcher', 'Catcher', 'Infielder', 'Outfielder'],
  'Wrestling': ['Flyweight', 'Bantamweight', 'Featherweight', 'Lightweight', 'Welterweight', 'Middleweight', 'Light Heavyweight', 'Heavyweight'],
  'Cross Country': ['Distance Runner']
};

function AddPlayerModal({ open, onOpenChange, onPlayerAdd }: AddPlayerModalProps) {
  const [formData, setFormData] = useState<PlayerFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<PlayerFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof PlayerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PlayerFormData> = {};

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.team) newErrors.team = 'Team is required';
    if (!formData.sport) newErrors.sport = 'Sport is required';

    // Optional field validation (format checking)
    if (formData.height && !/^\d+(\.\d+)?$/.test(formData.height)) {
      newErrors.height = 'Please enter a valid height (numbers only)';
    }
    if (formData.weight && !/^\d+(\.\d+)?$/.test(formData.weight)) {
      newErrors.weight = 'Please enter a valid weight (numbers only)';
    }
    if (formData.phoneNumber && !/^[\d\s\-\+\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    if (formData.emergencyContactPhone && !/^[\d\s\-\+\(\)]+$/.test(formData.emergencyContactPhone)) {
      newErrors.emergencyContactPhone = 'Please enter a valid phone number';
    }

    // Date validation
    if (formData.dateOfBirth && new Date(formData.dateOfBirth) > new Date()) {
      newErrors.dateOfBirth = 'Date of birth cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, this would make an API call to create the player in Supabase
      // For now, we'll just call the parent callback
      onPlayerAdd(formData);
      
      // Reset form and close modal
      setFormData(initialFormData);
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating player:', error);
      // Handle error appropriately
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setErrors({});
    onOpenChange(false);
  };

  const getPositionOptions = () => {
    if (formData.sport && mockPositions[formData.sport as keyof typeof mockPositions]) {
      return mockPositions[formData.sport as keyof typeof mockPositions];
    }
    return [];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Player
          </DialogTitle>
          <DialogDescription>
            Enter the player's information to create their profile. Required fields are marked with *.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="w-4 h-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="Enter phone number"
                    className={`pl-10 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  Date of Birth *
                </Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className={`pl-10 ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-600">{errors.dateOfBirth}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">
                  Gender *
                </Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-600">{errors.gender}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Physical & Sport Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="w-4 h-4" />
                Physical & Sport Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">
                  Height (cm)
                </Label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="height"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder="Enter height in cm"
                    className={`pl-10 ${errors.height ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.height && (
                  <p className="text-sm text-red-600">{errors.height}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">
                  Weight (kg)
                </Label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="Enter weight in kg"
                    className={`pl-10 ${errors.weight ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.weight && (
                  <p className="text-sm text-red-600">{errors.weight}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sport">
                  Sport *
                </Label>
                <Select value={formData.sport} onValueChange={(value) => {
                  handleInputChange('sport', value);
                  // Reset position when sport changes
                  handleInputChange('position', '');
                }}>
                  <SelectTrigger className={errors.sport ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSports.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sport && (
                  <p className="text-sm text-red-600">{errors.sport}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">
                  Position
                </Label>
                <Select 
                  value={formData.position} 
                  onValueChange={(value) => handleInputChange('position', value)}
                  disabled={!formData.sport}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.sport ? "Select position" : "Select sport first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {getPositionOptions().map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="team">
                  Team *
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Select value={formData.team} onValueChange={(value) => handleInputChange('team', value)}>
                    <SelectTrigger className={`pl-10 ${errors.team ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTeams.map((team) => (
                        <SelectItem key={team} value={team}>
                          {team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.team && (
                  <p className="text-sm text-red-600">{errors.team}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="squad">
                  Squad/Level
                </Label>
                <Select value={formData.squad} onValueChange={(value) => handleInputChange('squad', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select squad" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSquads.map((squad) => (
                      <SelectItem key={squad} value={squad}>
                        {squad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Health & Dietary Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="w-4 h-4" />
                Health & Dietary Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="allergies">
                  Allergies
                </Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="List any known allergies (e.g., peanuts, shellfish, dairy)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietaryRestrictions">
                  Dietary Restrictions/Preferences
                </Label>
                <Textarea
                  id="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                  placeholder="Enter dietary restrictions or preferences (e.g., vegetarian, vegan, gluten-free)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalConditions">
                  Medical Conditions
                </Label>
                <Textarea
                  id="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                  placeholder="List any relevant medical conditions or medications"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Phone className="w-4 h-4" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">
                  Contact Name
                </Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                  placeholder="Enter emergency contact name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelation">
                  Relationship
                </Label>
                <Select value={formData.emergencyContactRelation} onValueChange={(value) => handleInputChange('emergencyContactRelation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="emergencyContactPhone">
                  Contact Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                    placeholder="Enter emergency contact phone number"
                    className={`pl-10 ${errors.emergencyContactPhone ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.emergencyContactPhone && (
                  <p className="text-sm text-red-600">{errors.emergencyContactPhone}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any additional information about the player"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="w-4 h-4" />
            <span>Fields marked with * are required</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Add Player
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddPlayerModal;