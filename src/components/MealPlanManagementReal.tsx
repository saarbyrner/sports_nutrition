'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Search,
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  User,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertTriangle,
  Brain,
  Utensils,
  Calendar,
  Target,
  Sparkles,
  BookOpen,
  Clock,
  Activity
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useMealPlanService } from '@/hooks/useMealPlanService'
import { MealPlan, Template } from '@/lib/services/types'
import { format } from 'date-fns'
import CreatePlanModal from './CreatePlanModalNew'
import CreatePlanPage from './CreatePlanPage'
import TemplateDetailsModal from './TemplateDetailsModal'
import MealPlanDetailsModal from './MealPlanDetailsModal'
import TemplateEditorModal from './TemplateEditorModal'
import MealPlanEditorModal from './MealPlanEditorModal'

interface MealPlanManagementRealProps {
  onPlanSelect?: (planId: string) => void
}

export default function MealPlanManagementReal({ onPlanSelect }: MealPlanManagementRealProps) {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planTypeFilter, setPlanTypeFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCreatePage, setShowCreatePage] = useState(false)
  const [activeTab, setActiveTab] = useState('plans')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [showTemplateDetails, setShowTemplateDetails] = useState(false)
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null)
  const [showMealPlanDetails, setShowMealPlanDetails] = useState(false)
  const [showTemplateEditor, setShowTemplateEditor] = useState(false)
  const [showMealPlanEditor, setShowMealPlanEditor] = useState(false)
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create')

  const {
    loading,
    error,
    clearError,
    getMealPlans,
    getTemplates,
    deleteMealPlan,
    getMealPlanStats,
    createMealPlan,
    updateMealPlan,
    createTemplate,
    updateTemplate
  } = useMealPlanService()

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    completed: 0,
    archived: 0,
    byPlanType: {} as Record<string, number>,
    avgCalories: 0,
    avgProtein: 0
  })

  // Load meal plans and stats
  const loadData = useCallback(async () => {
    const filters: any = {}
    
    if (searchTerm) filters.search = searchTerm
    if (statusFilter !== 'all') filters.status = statusFilter
    if (planTypeFilter !== 'all') filters.plan_type = planTypeFilter

    const [plansResult, templatesResult, statsResult] = await Promise.all([
      getMealPlans({
        pagination: { page: currentPage, limit: pageSize },
        sort: { column: 'created_at', ascending: false },
        filters
      }),
      getTemplates({
        sort: { column: 'times_used', ascending: false }
      }),
      getMealPlanStats()
    ])

    if (plansResult?.data) {
      setMealPlans(plansResult.data)
    }

    if (templatesResult?.data) {
      setTemplates(templatesResult.data)
    }

    if (statsResult) {
      setStats(statsResult)
    }
  }, [searchTerm, statusFilter, planTypeFilter, currentPage, pageSize, getMealPlans, getTemplates, getMealPlanStats])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDeletePlan = async (planId: string) => {
    if (window.confirm('Are you sure you want to delete this meal plan? This action cannot be undone.')) {
      const success = await deleteMealPlan(planId)
      if (success) {
        await loadData() // Refresh the list
      }
    }
  }

  const handleViewTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setShowTemplateDetails(true)
  }

  const handleViewMealPlan = (mealPlan: MealPlan) => {
    setSelectedMealPlan(mealPlan)
    setShowMealPlanDetails(true)
  }

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setEditorMode('edit')
    setShowTemplateEditor(true)
  }

  const handleEditMealPlan = (mealPlan: MealPlan) => {
    setSelectedMealPlan(mealPlan)
    setEditorMode('edit')
    setShowMealPlanEditor(true)
  }

  const handleSaveTemplate = async (templateData: Partial<Template>): Promise<boolean> => {
    try {
      if (editorMode === 'create') {
        await createTemplate(templateData)
      } else {
        await updateTemplate(templateData.id!, templateData)
      }
      await loadData() // Refresh the data
      return true
    } catch (error) {
      console.error('Error saving template:', error)
      return false
    }
  }

  const handleSaveMealPlan = async (mealPlanData: Partial<MealPlan>): Promise<boolean> => {
    try {
      if (editorMode === 'create') {
        await createMealPlan(mealPlanData)
      } else {
        await updateMealPlan(mealPlanData.id!, mealPlanData)
      }
      await loadData() // Refresh the data
      return true
    } catch (error) {
      console.error('Error saving meal plan:', error)
      return false
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'draft': return 'secondary'
      case 'completed': return 'outline'
      case 'archived': return 'destructive'
      default: return 'secondary'
    }
  }

  const getPlanTypeBadgeColor = (planType: string) => {
    switch (planType) {
      case 'training': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'competition': return 'bg-red-100 text-red-800 border-red-300'
      case 'recovery': return 'bg-green-100 text-green-800 border-green-300'
      case 'general': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return 'Unknown'
    }
  }

  if (showCreatePage) {
    return (
      <CreatePlanPage
        onBack={() => setShowCreatePage(false)}
        onPlanCreate={loadData}
      />
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nutrition Planning</h1>
          <p className="text-muted-foreground">
            Create and manage personalized nutrition plans for your athletes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowCreatePage(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Plan
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/15 border border-destructive/20 rounded-lg p-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="ghost" size="sm" onClick={clearError} className="ml-auto">
            Dismiss
          </Button>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            My Plans ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Templates ({templates.length})
          </TabsTrigger>
        </TabsList>

        {/* Meal Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">All Plans</CardTitle>
                <Utensils className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Calories</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgCalories}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Protein</CardTitle>
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgProtein}g</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search plans..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={planTypeFilter} onValueChange={setPlanTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                    <SelectItem value="recovery">Recovery</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Meal Plans Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Plans ({mealPlans.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Calories</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
                          Loading your nutrition plans...
                        </TableCell>
                      </TableRow>
                    ) : mealPlans.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                          <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <div className="space-y-2">
                            <p className="font-medium">No nutrition plans yet</p>
                            <p className="text-sm">Create your first plan to get started</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      mealPlans.map((plan) => (
                        <TableRow key={plan.id}>
                          <TableCell>
                            <div className="font-medium">{plan.title}</div>
                            {plan.description && (
                              <div className="text-sm text-muted-foreground max-w-xs truncate">
                                {plan.description}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={plan.player?.user?.avatar_url} />
                                <AvatarFallback>
                                  {plan.player?.user ? 
                                    `${plan.player.user.first_name.charAt(0)}${plan.player.user.last_name.charAt(0)}` : 
                                    'P'
                                  }
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {plan.player?.user ? 
                                    `${plan.player.user.first_name} ${plan.player.user.last_name}` : 
                                    `Player ${plan.player_id.substring(0, 8)}...`
                                  }
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {plan.player?.team || 'No team'}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {plan.plan_type && (
                              <Badge className={getPlanTypeBadgeColor(plan.plan_type)}>
                                {plan.plan_type}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(plan.status)}>
                              {plan.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{plan.calories || 0}</div>
                            <div className="text-sm text-muted-foreground">
                              {plan.protein || 0}g protein
                            </div>
                          </TableCell>
                          <TableCell>
                            {plan.duration_days ? `${plan.duration_days} days` : '-'}
                          </TableCell>
                          <TableCell>{formatDate(plan.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewMealPlan(plan)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditMealPlan(plan)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Plan
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeletePlan(plan.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Plan
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan Templates ({templates.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          {template.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {template.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Calories:</span>
                          <span className="font-medium">{template.calories || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Used:</span>
                          <span className="font-medium">{template.times_used} times</span>
                        </div>
                        {template.category && (
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleViewTemplate(template)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {templates.length === 0 && !loading && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <div className="space-y-2">
                      <p className="font-medium">No templates saved yet</p>
                      <p className="text-sm">Save successful plans as templates for quick reuse</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Plan Modal */}
      <CreatePlanModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onPlanCreate={loadData}
        onAdvancedCreate={() => {
          setShowCreateModal(false);
          setShowCreatePage(true);
        }}
      />

      {/* Template Details Modal */}
      <TemplateDetailsModal
        template={selectedTemplate}
        open={showTemplateDetails}
        onOpenChange={setShowTemplateDetails}
      />

      {/* Meal Plan Details Modal */}
      <MealPlanDetailsModal
        mealPlan={selectedMealPlan}
        open={showMealPlanDetails}
        onOpenChange={setShowMealPlanDetails}
      />

      {/* Template Editor Modal */}
      <TemplateEditorModal
        template={selectedTemplate}
        open={showTemplateEditor}
        onOpenChange={setShowTemplateEditor}
        onSave={handleSaveTemplate}
        mode={editorMode}
      />

      {/* Meal Plan Editor Modal */}
      <MealPlanEditorModal
        mealPlan={selectedMealPlan}
        open={showMealPlanEditor}
        onOpenChange={setShowMealPlanEditor}
        onSave={handleSaveMealPlan}
        mode={editorMode}
      />
    </div>
  )
}