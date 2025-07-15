import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  FileBarChart,
  Users,
  TrendingUp,
  Calendar,
  Target,
  Droplets,
  Scale,
  Activity,
  ChefHat,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Save,
  X,
  ArrowLeft,
  ChevronDown,
  Search,
  Grid3X3,
  List,
  Eye,
  BarChart3
} from 'lucide-react';

// Mock data for different reports
const teamOverviewData = [
  { player: 'Marcus Johnson', calories: 3200, protein: 180, carbs: 420, fat: 110, compliance: 92 },
  { player: 'Sarah Chen', calories: 2800, protein: 140, carbs: 350, fat: 95, compliance: 88 },
  { player: 'Diego Martinez', calories: 3400, protein: 200, carbs: 450, fat: 120, compliance: 95 },
  { player: 'Emma Wilson', calories: 2600, protein: 130, carbs: 320, fat: 85, compliance: 90 },
  { player: 'James Thompson', calories: 3100, protein: 175, carbs: 400, fat: 105, compliance: 87 },
  { player: 'Aisha Patel', calories: 2900, protein: 155, carbs: 380, fat: 100, compliance: 93 },
];

const weightProgressData = [
  { week: 'Week 1', target: 82.5, actual: 82.8, difference: 0.3 },
  { week: 'Week 2', target: 82.3, actual: 82.6, difference: 0.3 },
  { week: 'Week 3', target: 82.1, actual: 82.2, difference: 0.1 },
  { week: 'Week 4', target: 81.9, actual: 81.8, difference: -0.1 },
  { week: 'Week 5', target: 81.7, actual: 81.5, difference: -0.2 },
  { week: 'Week 6', target: 81.5, actual: 81.2, difference: -0.3 },
];

const macroComplianceData = [
  { name: 'Carbohydrates', value: 89, color: '#8884d8' },
  { name: 'Protein', value: 94, color: '#82ca9d' },
  { name: 'Fat', value: 87, color: '#ffc658' },
  { name: 'Calories', value: 91, color: '#ff7300' }
];

const hydrationData = [
  { day: 'Mon', target: 3.5, actual: 3.2, temp: 24 },
  { day: 'Tue', target: 3.5, actual: 3.8, temp: 26 },
  { day: 'Wed', target: 4.0, actual: 3.9, temp: 28 },
  { day: 'Thu', target: 4.0, actual: 4.2, temp: 29 },
  { day: 'Fri', target: 3.5, actual: 3.4, temp: 25 },
  { day: 'Sat', target: 4.5, actual: 4.1, temp: 30 },
  { day: 'Sun', target: 3.0, actual: 2.8, temp: 22 }
];

const gameAnalysisData = [
  { meal: 'Pre-Game -3h', calories: 450, carbs: 75, protein: 20, fat: 12 },
  { meal: 'Pre-Game -1h', calories: 200, carbs: 45, protein: 5, fat: 2 },
  { meal: 'Half-Time', calories: 150, carbs: 35, protein: 3, fat: 1 },
  { meal: 'Post-Game +30min', calories: 300, carbs: 50, protein: 25, fat: 8 },
  { meal: 'Post-Game +2h', calories: 600, carbs: 80, protein: 35, fat: 18 }
];

interface Report {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  category: string;
  createdBy?: string;
  isCustom?: boolean;
  status: 'active' | 'draft' | 'archived';
  metrics?: {
    label: string;
    value: string;
    change?: string;
    trend?: 'up' | 'down' | 'stable';
  }[];
}

const initialReports: Report[] = [
  {
    id: 'team-overview',
    title: 'Team Nutrition Overview',
    description: 'Complete nutritional status across all team members',
    lastUpdated: '2 hours ago',
    category: 'Team Reports',
    status: 'active',
    metrics: [
      { label: 'Avg Compliance', value: '91%', change: '+3%', trend: 'up' },
      { label: 'Active Athletes', value: '24', change: '+2', trend: 'up' },
      { label: 'At Risk', value: '2', change: '0', trend: 'stable' }
    ]
  },
  {
    id: 'compliance-tracking',
    title: 'Compliance Tracking',
    description: 'Adherence to nutrition plans and targets',
    lastUpdated: '4 hours ago',
    category: 'Team Reports',
    status: 'active',
    metrics: [
      { label: 'Weekly Avg', value: '88%', change: '+5%', trend: 'up' },
      { label: 'Top Performer', value: '98%', change: '+2%', trend: 'up' }
    ]
  },
  {
    id: 'weight-management',
    title: 'Weight Management Progress',
    description: 'Individual player weight tracking and goals',
    lastUpdated: '1 day ago',
    category: 'Individual Reports',
    status: 'active',
    metrics: [
      { label: 'On Track', value: '18/24', change: '+3', trend: 'up' },
      { label: 'Avg Progress', value: '94%', change: '+1%', trend: 'up' }
    ]
  },
  {
    id: 'macro-analysis',
    title: 'Macronutrient Analysis',
    description: 'Detailed breakdown of macro consumption vs targets',
    lastUpdated: '6 hours ago',
    category: 'Nutrition Analysis',
    status: 'active',
    metrics: [
      { label: 'Protein Compliance', value: '94%', change: '+2%', trend: 'up' },
      { label: 'Carb Timing', value: '89%', change: '+8%', trend: 'up' }
    ]
  },
  {
    id: 'hydration-monitoring',
    title: 'Hydration Monitoring',
    description: 'Daily fluid intake tracking and environmental factors',
    lastUpdated: '3 hours ago',
    category: 'Performance Reports',
    status: 'active',
    metrics: [
      { label: 'Daily Avg', value: '3.6L', change: '+0.2L', trend: 'up' },
      { label: 'Compliance', value: '86%', change: '-2%', trend: 'down' }
    ]
  },
  {
    id: 'game-day-nutrition',
    title: 'Game Day Nutrition Analysis',
    description: 'Pre, during, and post-game nutrition compliance',
    lastUpdated: '1 day ago',
    category: 'Performance Reports',
    status: 'active',
    metrics: [
      { label: 'Protocol Adherence', value: '95%', change: '+3%', trend: 'up' },
      { label: 'Recovery Timing', value: '92%', change: '+1%', trend: 'up' }
    ]
  },
  {
    id: 'supplement-usage',
    title: 'Supplement Usage Report',
    description: 'Tracking of approved supplements and timing',
    lastUpdated: '2 days ago',
    category: 'Nutrition Analysis',
    status: 'active',
    metrics: [
      { label: 'Compliance Rate', value: '83%', change: '-2%', trend: 'down' },
      { label: 'Approved Items', value: '12', change: '+1', trend: 'up' }
    ]
  },
  {
    id: 'energy-availability',
    title: 'Energy Availability Assessment',
    description: 'Monitoring for low energy availability risks',
    lastUpdated: '12 hours ago',
    category: 'Health & Safety',
    status: 'active',
    metrics: [
      { label: 'At Risk Athletes', value: '2', change: '0', trend: 'stable' },
      { label: 'Avg EA', value: '42 kcal/kg', change: '+2', trend: 'up' }
    ]
  }
];

const reportCategories = [
  'Team Reports',
  'Individual Reports', 
  'Nutrition Analysis',
  'Performance Reports',
  'Health & Safety'
];

interface ReportFormData {
  title: string;
  description: string;
  category: string;
}

interface AnalyticsProps {
  currentReport?: string;
  onReportChange?: (reportId: string | null) => void;
}

function Analytics({ currentReport, onReportChange }: AnalyticsProps) {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    description: '',
    category: 'Team Reports'
  });

  // Homepage state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const isHomepage = !currentReport;
  const activeReport = reports.find(r => r.id === currentReport);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateReport = () => {
    if (!formData.title.trim()) return;

    const newReport: Report = {
      id: `custom-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      lastUpdated: 'Just now',
      createdBy: 'Dr. Sarah Johnson',
      isCustom: true,
      status: 'draft'
    };

    setReports(prev => [...prev, newReport]);
    setShowCreateDialog(false);
    setFormData({ title: '', description: '', category: 'Team Reports' });
  };

  const handleEditReport = (report: Report) => {
    setEditingReport(report);
    setFormData({
      title: report.title,
      description: report.description,
      category: report.category
    });
  };

  const handleUpdateReport = () => {
    if (!editingReport || !formData.title.trim()) return;

    setReports(prev => prev.map(report => 
      report.id === editingReport.id 
        ? {
            ...report,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            lastUpdated: 'Just now'
          }
        : report
    ));

    setEditingReport(null);
    setFormData({ title: '', description: '', category: 'Team Reports' });
  };

  const handleDeleteReport = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
    if (currentReport === reportId && onReportChange) {
      onReportChange(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingReport(null);
    setFormData({ title: '', description: '', category: 'Team Reports' });
  };

  const handleReportClick = (reportId: string) => {
    if (onReportChange) {
      onReportChange(reportId);
    }
  };

  const handleBackToHomepage = () => {
    if (onReportChange) {
      onReportChange(null);
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-600" />;
      case 'down':
        return <TrendingUp className="w-3 h-3 text-red-600 rotate-180" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400" />;
    }
  };

  if (isHomepage) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Browse and manage nutrition reports for your organization
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>
                  Create a custom report to track specific nutrition metrics for your team.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="report-title">Report Title</Label>
                  <Input
                    id="report-title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter report title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-description">Description</Label>
                  <Textarea
                    id="report-description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this report will track"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateReport} disabled={!formData.title.trim()}>
                  <Save className="w-4 h-4 mr-2" />
                  Create Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {reportCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Reports Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <Card 
                key={report.id} 
                className="cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => handleReportClick(report.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      <Badge variant={report.status === 'active' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleReportClick(report.id); }}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Report
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditReport(report); }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                              onClick={(e) => e.stopPropagation()}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Report</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{report.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteReport(report.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {report.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Metrics */}
                  {report.metrics && (
                    <div className="space-y-3 mb-4">
                      {report.metrics.map((metric, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{metric.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{metric.value}</span>
                            {metric.change && (
                              <div className="flex items-center gap-1">
                                {getTrendIcon(metric.trend)}
                                <span className={`text-xs ${
                                  metric.trend === 'up' ? 'text-green-600' : 
                                  metric.trend === 'down' ? 'text-red-600' : 
                                  'text-muted-foreground'
                                }`}>
                                  {metric.change}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{report.category}</span>
                    <span>Updated {report.lastUpdated}</span>
                  </div>
                  
                  {report.isCustom && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        Custom Report
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card 
                key={report.id} 
                className="cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => handleReportClick(report.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{report.title}</h3>
                          <Badge variant={report.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {report.status}
                          </Badge>
                          {report.isCustom && (
                            <Badge variant="outline" className="text-xs">
                              Custom
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{report.category}</span>
                          <span>Updated {report.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                    
                    {report.metrics && (
                      <div className="flex items-center gap-6 mr-4">
                        {report.metrics.slice(0, 2).map((metric, index) => (
                          <div key={index} className="text-center">
                            <div className="text-sm font-medium">{metric.value}</div>
                            <div className="text-xs text-muted-foreground">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleReportClick(report.id); }}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Report
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditReport(report); }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                              onClick={(e) => e.stopPropagation()}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Report</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{report.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteReport(report.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingReport} onOpenChange={(open) => !open && handleCancelEdit()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Report</DialogTitle>
              <DialogDescription>
                Update the report details and configuration.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Report Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter report title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this report will track"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reportCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleUpdateReport} disabled={!formData.title.trim()}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Individual Report View
  const renderReportContent = () => {
    switch (currentReport) {
      case 'team-overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Total Athletes</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">24</p>
                  <p className="text-xs text-muted-foreground">6 on active plans</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Avg Compliance</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">91%</p>
                  <p className="text-xs text-green-600">+3% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium">At Risk</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">2</p>
                  <p className="text-xs text-muted-foreground">Low energy availability</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Goals Met</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">18</p>
                  <p className="text-xs text-muted-foreground">Weekly targets achieved</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Player Compliance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={teamOverviewData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="player" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="compliance" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Calorie Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={teamOverviewData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="player" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="calories" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Marcus Johnson completed meal plan</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sarah Chen missed pre-training meal</p>
                      <p className="text-xs text-muted-foreground">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Diego Martinez logged hydration</p>
                      <p className="text-xs text-muted-foreground">6 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Weekly weigh-ins scheduled</p>
                      <p className="text-xs text-muted-foreground">Tomorrow 9:00 AM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'weight-management':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Current Weight</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">81.2 kg</p>
                  <p className="text-xs text-green-600">-0.3kg from target</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Target Weight</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">81.5 kg</p>
                  <p className="text-xs text-muted-foreground">Season goal</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Weekly Change</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">-0.3 kg</p>
                  <p className="text-xs text-muted-foreground">From last week</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Weight Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[80.5, 83.5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="target" stroke="#8884d8" strokeDasharray="5 5" name="Target" />
                    <Line type="monotone" dataKey="actual" stroke="#82ca9d" name="Actual" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        );

      case 'macro-analysis':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {macroComplianceData.map((macro) => (
                <Card key={macro.name}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{macro.name}</span>
                      <span className="text-lg font-semibold">{macro.value}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${macro.value}%`,
                          backgroundColor: macro.color 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Team average compliance</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Macronutrient Compliance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={macroComplianceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {macroComplianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        );

      case 'hydration-monitoring':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Daily Average</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">3.6L</p>
                  <p className="text-xs text-green-600">+0.2L from target</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium">Avg Temperature</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">26°C</p>
                  <p className="text-xs text-muted-foreground">Training environment</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Compliance Rate</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">86%</p>
                  <p className="text-xs text-muted-foreground">Weekly target met</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Hydration vs Temperature</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={hydrationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Area yAxisId="left" type="monotone" dataKey="target" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    <Area yAxisId="left" type="monotone" dataKey="actual" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Line yAxisId="right" type="monotone" dataKey="temp" stroke="#ff7300" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        );

      case 'game-day-nutrition':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Game Day Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gameAnalysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="meal" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calories" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Total Calories</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">1,700</p>
                  <p className="text-xs text-muted-foreground">Game day intake</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Carbohydrates</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">285g</p>
                  <p className="text-xs text-green-600">Optimal for performance</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Timing Compliance</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">95%</p>
                  <p className="text-xs text-muted-foreground">Protocol adherence</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        // Show custom report template for user-created reports
        const report = reports.find(r => r.id === currentReport);
        if (report?.isCustom) {
          return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <FileBarChart className="w-16 h-16 text-muted-foreground" />
              <div className="text-center">
                <h3 className="text-lg font-semibold">{report.title}</h3>
                <p className="text-muted-foreground">{report.description}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Created by {report.createdBy} • {report.lastUpdated}
                </p>
                <div className="mt-4">
                  <Button variant="outline">
                    Configure Report Data
                  </Button>
                </div>
              </div>
            </div>
          );
        }
        
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Report not found</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Header with Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBackToHomepage}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reports
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="text-2xl font-semibold">{activeReport?.title}</h1>
            <p className="text-muted-foreground">
              {activeReport?.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Report Switcher Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Switch Report
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {reportCategories.map((category) => {
                const categoryReports = reports.filter(r => r.category === category);
                if (categoryReports.length === 0) return null;
                
                return (
                  <div key={category}>
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      {category}
                    </div>
                    {categoryReports.map((report) => (
                      <DropdownMenuItem
                        key={report.id}
                        onClick={() => handleReportClick(report.id)}
                        className={currentReport === report.id ? 'bg-accent' : ''}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        <div className="flex-1">
                          <div className="text-sm">{report.title}</div>
                          <div className="text-xs text-muted-foreground">
                            Updated {report.lastUpdated}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Report Content */}
      {renderReportContent()}
    </div>
  );
}

export default Analytics;