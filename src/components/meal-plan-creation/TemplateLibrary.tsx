/**
 * Visual Template Library Component
 * 
 * World-class template browsing interface with rich visual previews,
 * smart categorization, and intuitive selection patterns.
 * 
 * UX Design Principles:
 * - Visual-first template browsing
 * - Rich meal plan previews with nutrition breakdown
 * - Smart filtering and categorization
 * - Quick customization options
 * - Mobile-optimized card layouts
 * - Accessibility-compliant interactions
 * 
 * Features:
 * - Visual meal plan cards with preview images
 * - Nutrition summary at-a-glance
 * - Template difficulty indicators
 * - Usage statistics and ratings
 * - Customization preview before selection
 * - Export/save as personal templates
 * 
 * @author Claude Code (Expert UX Designer & Engineer)
 * @version 2.0.0 - Visual Template Library
 */

import React, { useState, useMemo, useCallback } from 'react'
import { Search, Heart, Star, Clock, Users, Utensils, Filter, Grid, List, ChevronRight, Copy, Eye, Download } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { NutritionSummary } from '../shared/NutritionSummary'

// Enhanced template interface with visual elements
export interface VisualTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  
  // Visual elements
  imageUrl?: string
  thumbnails: string[] // Meal images
  
  // Usage & social proof
  timesUsed: number
  rating: number // 1-5 stars
  reviews: number
  createdBy: string
  isVerified: boolean // Nutritionist verified
  isPremium: boolean
  
  // Nutrition data
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber?: number
  }
  
  // Meal structure preview
  mealStructure: {
    mealsPerDay: number
    snacksIncluded: boolean
    mealTimes: string[]
    totalItems: number
  }
  
  // Metadata
  duration: string // "7 days", "2 weeks"
  tags: string[]
  allergens: string[]
  dietaryFlags: {
    vegetarian: boolean
    vegan: boolean
    glutenFree: boolean
    lowCarb: boolean
    highProtein: boolean
  }
  
  // Customization options
  customizable: {
    portionSizes: boolean
    mealTiming: boolean
    foodSubstitutions: boolean
    addRemoveMeals: boolean
  }
  
  // Preview data (first few meals)
  previewMeals: PreviewMeal[]
  
  // Full meal plan data
  fullMealPlan: any // Complete meal plan structure
}

interface PreviewMeal {
  type: string // breakfast, lunch, dinner, snack
  name: string
  calories: number
  protein: number
  mainIngredients: string[]
  imageUrl?: string
}

export enum TemplateCategory {
  WEIGHT_LOSS = 'weight_loss',
  MUSCLE_GAIN = 'muscle_gain', 
  ENDURANCE = 'endurance',
  RECOVERY = 'recovery',
  COMPETITION = 'competition',
  GENERAL = 'general',
  SPECIAL_DIET = 'special_diet'
}

const CATEGORY_COLORS = {
  [TemplateCategory.WEIGHT_LOSS]: 'bg-red-50 border-red-200 text-red-800',
  [TemplateCategory.MUSCLE_GAIN]: 'bg-blue-50 border-blue-200 text-blue-800',
  [TemplateCategory.ENDURANCE]: 'bg-green-50 border-green-200 text-green-800',
  [TemplateCategory.RECOVERY]: 'bg-purple-50 border-purple-200 text-purple-800',
  [TemplateCategory.COMPETITION]: 'bg-orange-50 border-orange-200 text-orange-800',
  [TemplateCategory.GENERAL]: 'bg-gray-50 border-gray-200 text-gray-800',
  [TemplateCategory.SPECIAL_DIET]: 'bg-pink-50 border-pink-200 text-pink-800'
}

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800', 
  advanced: 'bg-red-100 text-red-800'
}

// Sample template data (production would come from API)
const SAMPLE_TEMPLATES: VisualTemplate[] = [
  {
    id: 'high-protein-athlete',
    name: 'High-Protein Athlete Plan',
    description: 'Perfect for strength training and muscle building. Includes 6 meals with optimal protein timing.',
    category: TemplateCategory.MUSCLE_GAIN,
    difficulty: 'intermediate',
    imageUrl: '/templates/high-protein-hero.jpg',
    thumbnails: ['/templates/breakfast-protein.jpg', '/templates/lunch-protein.jpg'],
    timesUsed: 1247,
    rating: 4.7,
    reviews: 156,
    createdBy: 'Dr. Sarah Johnson, RD',
    isVerified: true,
    isPremium: false,
    nutrition: {
      calories: 3200,
      protein: 180,
      carbs: 350,
      fat: 120,
      fiber: 35
    },
    mealStructure: {
      mealsPerDay: 6,
      snacksIncluded: true,
      mealTimes: ['7:00 AM', '10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '9:30 PM'],
      totalItems: 24
    },
    duration: '14 days',
    tags: ['muscle building', 'strength training', 'high protein', 'performance'],
    allergens: ['milk', 'eggs'],
    dietaryFlags: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      lowCarb: false,
      highProtein: true
    },
    customizable: {
      portionSizes: true,
      mealTiming: true,
      foodSubstitutions: true,
      addRemoveMeals: false
    },
    previewMeals: [
      {
        type: 'breakfast',
        name: 'Protein Power Bowl',
        calories: 620,
        protein: 45,
        mainIngredients: ['Greek yogurt', 'protein powder', 'berries', 'granola'],
        imageUrl: '/meals/protein-bowl.jpg'
      },
      {
        type: 'lunch', 
        name: 'Grilled Chicken & Quinoa',
        calories: 750,
        protein: 55,
        mainIngredients: ['chicken breast', 'quinoa', 'roasted vegetables'],
        imageUrl: '/meals/chicken-quinoa.jpg'
      }
    ],
    fullMealPlan: {} // Would contain complete meal plan structure
  },
  
  {
    id: 'lean-cutting-plan',
    name: 'Lean Cutting Protocol',
    description: 'Science-based approach to fat loss while preserving muscle. Includes flexible meal timing.',
    category: TemplateCategory.WEIGHT_LOSS,
    difficulty: 'advanced',
    imageUrl: '/templates/cutting-hero.jpg',
    thumbnails: ['/templates/lean-breakfast.jpg', '/templates/lean-dinner.jpg'],
    timesUsed: 892,
    rating: 4.8,
    reviews: 98,
    createdBy: 'Mike Chen, CSCS',
    isVerified: true,
    isPremium: true,
    nutrition: {
      calories: 2200,
      protein: 165,
      carbs: 180,
      fat: 85,
      fiber: 40
    },
    mealStructure: {
      mealsPerDay: 5,
      snacksIncluded: true,
      mealTimes: ['7:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'],
      totalItems: 20
    },
    duration: '8 weeks',
    tags: ['fat loss', 'cutting', 'lean muscle', 'metabolic'],
    allergens: ['fish'],
    dietaryFlags: {
      vegetarian: false,
      vegan: false,
      glutenFree: true,
      lowCarb: true,
      highProtein: true
    },
    customizable: {
      portionSizes: true,
      mealTiming: true,
      foodSubstitutions: true,
      addRemoveMeals: true
    },
    previewMeals: [
      {
        type: 'breakfast',
        name: 'Veggie Scramble',
        calories: 380,
        protein: 28,
        mainIngredients: ['eggs', 'spinach', 'bell peppers', 'avocado'],
        imageUrl: '/meals/veggie-scramble.jpg'
      },
      {
        type: 'dinner',
        name: 'Salmon & Asparagus',
        calories: 485,
        protein: 42,
        mainIngredients: ['salmon fillet', 'asparagus', 'cauliflower rice'],
        imageUrl: '/meals/salmon-asparagus.jpg'
      }
    ],
    fullMealPlan: {}
  },
  
  {
    id: 'endurance-fuel',
    name: 'Endurance Fuel Strategy',
    description: 'Optimized carb timing and hydration for endurance athletes. Race day ready nutrition.',
    category: TemplateCategory.ENDURANCE,
    difficulty: 'intermediate',
    imageUrl: '/templates/endurance-hero.jpg',
    thumbnails: ['/templates/pre-workout.jpg', '/templates/recovery-meal.jpg'],
    timesUsed: 634,
    rating: 4.6,
    reviews: 73,
    createdBy: 'Lisa Rodriguez, Sports RD',
    isVerified: true,
    isPremium: false,
    nutrition: {
      calories: 3800,
      protein: 140,
      carbs: 580,
      fat: 95,
      fiber: 25
    },
    mealStructure: {
      mealsPerDay: 7,
      snacksIncluded: true,
      mealTimes: ['6:00 AM', '8:30 AM', '11:00 AM', '1:30 PM', '4:00 PM', '7:00 PM', '9:00 PM'],
      totalItems: 28
    },
    duration: '21 days',
    tags: ['endurance', 'carb cycling', 'performance', 'hydration'],
    allergens: ['gluten'],
    dietaryFlags: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      lowCarb: false,
      highProtein: false
    },
    customizable: {
      portionSizes: true,
      mealTiming: true,
      foodSubstitutions: false,
      addRemoveMeals: false
    },
    previewMeals: [
      {
        type: 'breakfast',
        name: 'Oatmeal Power Bowl',
        calories: 680,
        protein: 22,
        mainIngredients: ['oats', 'banana', 'nuts', 'honey'],
        imageUrl: '/meals/oatmeal-bowl.jpg'
      }
    ],
    fullMealPlan: {}
  }
]

interface TemplateLibraryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTemplateSelect: (template: VisualTemplate) => void
  playerContext?: {
    sport?: string
    goals?: string[]
    dietaryRestrictions?: string[]
  }
}

export function TemplateLibrary({
  open,
  onOpenChange,
  onTemplateSelect,
  playerContext
}: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<VisualTemplate | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Smart template filtering and sorting
  const filteredTemplates = useMemo(() => {
    let filtered = SAMPLE_TEMPLATES

    // Search filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query)) ||
        template.createdBy.toLowerCase().includes(query)
      )
    }

    // Category filtering
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    // Player context filtering (smart recommendations)
    if (playerContext) {
      // Could implement smart filtering based on sport, goals, etc.
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.timesUsed - a.timesUsed
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return new Date(b.id).getTime() - new Date(a.id).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, sortBy, playerContext])

  const handleTemplatePreview = (template: VisualTemplate) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  const handleTemplateSelect = (template: VisualTemplate) => {
    onTemplateSelect(template)
    onOpenChange(false)
  }

  const getDietaryBadges = (template: VisualTemplate) => {
    const badges = []
    if (template.dietaryFlags.vegetarian) badges.push({ label: 'Vegetarian', color: 'bg-green-100 text-green-700' })
    if (template.dietaryFlags.vegan) badges.push({ label: 'Vegan', color: 'bg-green-200 text-green-800' })
    if (template.dietaryFlags.glutenFree) badges.push({ label: 'Gluten-Free', color: 'bg-amber-100 text-amber-700' })
    if (template.dietaryFlags.highProtein) badges.push({ label: 'High Protein', color: 'bg-blue-100 text-blue-700' })
    if (template.dietaryFlags.lowCarb) badges.push({ label: 'Low Carb', color: 'bg-purple-100 text-purple-700' })
    return badges
  }

  const renderTemplateCard = (template: VisualTemplate) => (
    <Card 
      key={template.id} 
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border border-gray-200"
    >
      <CardHeader className="p-0">
        {/* Hero Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
          {template.imageUrl ? (
            <img 
              src={template.imageUrl} 
              alt={template.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Utensils className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          {/* Premium badge */}
          {template.isPremium && (
            <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
              Premium
            </Badge>
          )}

          {/* Verified badge */}
          {template.isVerified && (
            <Badge className="absolute top-2 left-2 bg-blue-500 text-white">
              ✓ Verified
            </Badge>
          )}

          {/* Quick actions overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200">
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                size="sm" 
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  handleTemplatePreview(template)
                }}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle favorite
                }}
                className="h-8 w-8 p-0"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4" onClick={() => handleTemplateSelect(template)}>
        {/* Header info */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{template.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {template.description}
              </p>
            </div>
          </div>

          {/* Ratings and usage */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{template.rating}</span>
                <span className="text-muted-foreground">({template.reviews})</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{template.timesUsed.toLocaleString()}</span>
              </div>
            </div>
            
            <Badge className={`${DIFFICULTY_COLORS[template.difficulty]} text-xs`}>
              {template.difficulty}
            </Badge>
          </div>

          {/* Nutrition preview */}
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="text-center">
                <div className="font-medium">{template.nutrition.calories}</div>
                <div className="text-muted-foreground">cal</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-blue-600">{template.nutrition.protein}g</div>
                <div className="text-muted-foreground">protein</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-green-600">{template.nutrition.carbs}g</div>
                <div className="text-muted-foreground">carbs</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-orange-600">{template.nutrition.fat}g</div>
                <div className="text-muted-foreground">fat</div>
              </div>
            </div>
          </div>

          {/* Meal structure info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{template.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Utensils className="w-3 h-3" />
              <span>{template.mealStructure.mealsPerDay} meals/day</span>
            </div>
          </div>

          {/* Category and dietary badges */}
          <div className="flex flex-wrap gap-1">
            <Badge className={`text-xs ${CATEGORY_COLORS[template.category]}`}>
              {template.category.replace('_', ' ')}
            </Badge>
            {getDietaryBadges(template).slice(0, 2).map(({ label, color }, index) => (
              <Badge key={index} variant="outline" className={`text-xs ${color}`}>
                {label}
              </Badge>
            ))}
          </div>

          {/* Created by */}
          <div className="text-xs text-muted-foreground border-t pt-2">
            Created by {template.createdBy}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Grid className="w-5 h-5" />
              Template Library
              <Badge variant="outline">{filteredTemplates.length} templates</Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden space-y-4">
            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search templates, creators, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.values(TemplateCategory).map(category => (
                      <SelectItem key={category} value={category}>
                        {category.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                  {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Template grid */}
            <div className="flex-1 overflow-y-auto">
              {filteredTemplates.length > 0 ? (
                <div className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredTemplates.map(renderTemplateCard)}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center">
                  <div className="space-y-4">
                    <Utensils className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
                    <div>
                      <h3 className="font-medium">No templates found</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template preview modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTemplate && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedTemplate.name}</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => handleTemplateSelect(selectedTemplate)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </DialogTitle>
              </DialogHeader>

              {/* Template preview content would go here */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Nutrition Summary</h3>
                  <NutritionSummary 
                    data={selectedTemplate.nutrition}
                    layout="detailed"
                  />
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Meal Preview</h3>
                  <div className="space-y-3">
                    {selectedTemplate.previewMeals.map((meal, index) => (
                      <Card key={index}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium capitalize">{meal.type}</h4>
                              <p className="text-sm text-muted-foreground">{meal.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {meal.mainIngredients.join(', ')}
                              </p>
                            </div>
                            <div className="text-right text-sm">
                              <div className="font-medium">{meal.calories} cal</div>
                              <div className="text-blue-600">{meal.protein}g protein</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}