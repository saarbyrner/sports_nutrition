/**
 * Meal Plan Setup Flow Component
 * 
 * Progressive disclosure setup flow for meal plan creation with
 * step-by-step validation and clear progress indicators.
 * 
 * @author Claude Code (Expert Software Engineer)
 * @version 1.0.0
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Calendar } from '../ui/calendar';
import { Badge } from '../ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import {
  User,
  Target,
  Brain,
  BookOpen,
  CalendarIcon,
  ArrowLeft
} from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { PlayerSelector } from '../shared/PlayerSelector';

interface SetupFlowProps {
  currentStep: number;
  selectedPlayer: string;
  onPlayerSelect: (playerId: string) => void;
  planName: string;
  onPlanNameChange: (name: string) => void;
  planType: string;
  onPlanTypeChange: (type: string) => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  planMode: 'ai' | 'manual' | 'template';
  onPlanModeChange: (mode: 'ai' | 'manual' | 'template') => void;
  selectedTemplate: any;
  onTemplateSelect: (template: any) => void;
  onTemplateModalOpen: () => void;
  specialConsiderations: string;
  onSpecialConsiderationsChange: (notes: string) => void;
  onStepChange: (step: number) => void;
  onNext: () => void;
  canProceedStep1: boolean;
  canProceedStep2: boolean;
  canProceedStep3: boolean;
  selectedPlayerData: any;
}

const PLAN_TYPES = [
  { value: 'weight_gain', label: 'Weight Gain', icon: Target },
  { value: 'weight_loss', label: 'Weight Loss', icon: Target },
  { value: 'maintenance', label: 'Maintenance', icon: Target },
  { value: 'competition_prep', label: 'Competition Prep', icon: Target },
  { value: 'recovery', label: 'Recovery', icon: Target },
  { value: 'endurance', label: 'Endurance', icon: Target }
];

export function SetupFlow({
  currentStep,
  selectedPlayer,
  onPlayerSelect,
  planName,
  onPlanNameChange,
  planType,
  onPlanTypeChange,
  dateRange,
  onDateRangeChange,
  planMode,
  onPlanModeChange,
  selectedTemplate,
  onTemplateModalOpen,
  specialConsiderations,
  onSpecialConsiderationsChange,
  onStepChange,
  onNext,
  canProceedStep1,
  canProceedStep2,
  canProceedStep3,
  selectedPlayerData
}: SetupFlowProps) {
  
  // Get formatted date range display
  const getDateRangeDisplay = () => {
    if (!dateRange.from) return "Select dates";
    if (!dateRange.to) return format(dateRange.from, "MMM dd, yyyy");
    if (dateRange.from.getTime() === dateRange.to.getTime()) {
      return format(dateRange.from, "MMM dd, yyyy");
    }
    return `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}`;
  };

  // Calculate duration from date range
  const getDurationString = () => {
    if (!dateRange.from || !dateRange.to) return "";
    const days = differenceInDays(dateRange.to, dateRange.from) + 1;
    if (days === 1) return "1 day";
    if (days <= 7) return `${days} days`;
    if (days <= 14) return `${Math.ceil(days / 7)} week${Math.ceil(days / 7) > 1 ? 's' : ''}`;
    if (days <= 31) return `${Math.ceil(days / 7)} weeks`;
    return `${Math.ceil(days / 30)} month${Math.ceil(days / 30) > 1 ? 's' : ''}`;
  };

  // Quick date range presets
  const setQuickRange = (days: number) => {
    const today = new Date();
    const endDate = addDays(today, days - 1);
    onDateRangeChange({ from: today, to: endDate });
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Step 1 */}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  1
                </div>
                <div className="text-sm">
                  <div className="font-medium">Player</div>
                  <div className="text-xs text-muted-foreground">Who is this for?</div>
                </div>
              </div>
              
              <div className={`w-8 h-0.5 ${currentStep > 1 ? 'bg-primary' : 'bg-muted'}`} />
              
              {/* Step 2 */}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  2
                </div>
                <div className="text-sm">
                  <div className="font-medium">Plan Details</div>
                  <div className="text-xs text-muted-foreground">Type & duration</div>
                </div>
              </div>
              
              <div className={`w-8 h-0.5 ${currentStep > 2 ? 'bg-primary' : 'bg-muted'}`} />
              
              {/* Step 3 */}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  3
                </div>
                <div className="text-sm">
                  <div className="font-medium">Method</div>
                  <div className="text-xs text-muted-foreground">How to create</div>
                </div>
              </div>
              
              <div className={`w-8 h-0.5 ${currentStep > 3 ? 'bg-primary' : 'bg-muted'}`} />
              
              {/* Step 4 */}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  4
                </div>
                <div className="text-sm">
                  <div className="font-medium">Generate</div>
                  <div className="text-xs text-muted-foreground">Create the plan</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto">
        {/* Step 1: Player Selection */}
        {currentStep === 1 && (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>Select Player</CardTitle>
              <p className="text-muted-foreground">Choose the athlete for this nutrition plan</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <PlayerSelector
                value={selectedPlayer}
                onPlayerSelect={onPlayerSelect}
                placeholder="Search and select a player..."
                variant="advanced"
                showTeamFilter={true}
                className="min-h-[60px]"
              />
              {selectedPlayerData && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{selectedPlayerData.user?.first_name} {selectedPlayerData.user?.last_name}</div>
                      <div className="text-sm text-muted-foreground">{selectedPlayerData.position} • {selectedPlayerData.team || 'No team'}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Plan Details */}
        {currentStep === 2 && (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>Plan Details</CardTitle>
              <p className="text-muted-foreground">Set the type and duration of the nutrition plan</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Plan Name (Optional)</label>
                <Input
                  placeholder="Enter a custom plan name..."
                  value={planName}
                  onChange={(e) => onPlanNameChange(e.target.value)}
                  className="text-center"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Plan Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {PLAN_TYPES.map(({ value, label, icon: Icon }) => (
                    <Button
                      key={value}
                      variant={planType === value ? "default" : "outline"}
                      onClick={() => onPlanTypeChange(value)}
                      className="h-16 flex-col gap-1"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Duration</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-center text-center font-normal h-16"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <CalendarIcon className="w-5 h-5" />
                        <div className="text-sm">{getDateRangeDisplay()}</div>
                        {getDurationString() && (
                          <div className="text-xs text-muted-foreground">{getDurationString()}</div>
                        )}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <div className="p-3 border-b">
                      <div className="flex gap-2 mb-3">
                        <Button
                          variant={getDurationString() === "1 week" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setQuickRange(7)}
                          className="text-xs flex-1"
                        >
                          1 Week
                        </Button>
                        <Button
                          variant={getDurationString() === "2 weeks" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setQuickRange(14)}
                          className="text-xs flex-1"
                        >
                          2 Weeks
                        </Button>
                        <Button
                          variant={getDurationString() === "4 weeks" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setQuickRange(30)}
                          className="text-xs flex-1"
                        >
                          1 Month
                        </Button>
                      </div>
                    </div>
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => onDateRangeChange(range || {from: undefined, to: undefined})}
                      numberOfMonths={1}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="rounded-md"
                    />
                  </PopoverContent>
                </Popover>
                {dateRange.from && dateRange.to && (
                  <div className="text-sm text-muted-foreground text-center">
                    Plan duration: <span className="font-medium">{getDurationString()}</span>
                    <div className="text-xs">
                      {format(dateRange.from, "MMM dd")} to {format(dateRange.to, "MMM dd, yyyy")}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Creation Method */}
        {currentStep === 3 && (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle>Choose Creation Method</CardTitle>
              <p className="text-muted-foreground">How would you like to create this nutrition plan?</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant={planMode === 'ai' ? 'default' : 'outline'}
                  onClick={() => onPlanModeChange('ai')}
                  className="h-20 flex items-center gap-4 relative p-6"
                >
                  <Badge className="absolute top-2 right-2 text-xs bg-green-500 hover:bg-green-600">
                    Recommended
                  </Badge>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">AI Generated</div>
                    <div className="text-sm text-muted-foreground">Let AI create a personalized plan based on the player's profile</div>
                  </div>
                </Button>
                
                <Button
                  variant={planMode === 'template' ? 'default' : 'outline'}
                  onClick={() => onPlanModeChange('template')}
                  className="h-20 flex items-center gap-4 p-6"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">From Template</div>
                    <div className="text-sm text-muted-foreground">Start with a pre-built template and customize it</div>
                  </div>
                </Button>
                
                <Button
                  variant={planMode === 'manual' ? 'default' : 'outline'}
                  onClick={() => onPlanModeChange('manual')}
                  className="h-20 flex items-center gap-4 p-6"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">Manual Creation</div>
                    <div className="text-sm text-muted-foreground">Create a meal plan from scratch with full control</div>
                  </div>
                </Button>
              </div>

              {planMode === 'template' && (
                <div className="space-y-3 pt-4 border-t">
                  <label className="text-sm font-medium">Select Template</label>
                  <Button
                    variant="outline"
                    onClick={onTemplateModalOpen}
                    className="w-full justify-start h-16"
                  >
                    <BookOpen className="w-4 h-4 mr-3" />
                    <div className="flex-1 text-left">
                      {selectedTemplate ? (
                        <div>
                          <div className="font-medium">{selectedTemplate.name}</div>
                          <div className="text-xs text-muted-foreground">{selectedTemplate.calories} cal • {selectedTemplate.category}</div>
                        </div>
                      ) : (
                        <div>Choose a template...</div>
                      )}
                    </div>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Summary and Generation */}
        {currentStep === 4 && (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>Ready to Generate</CardTitle>
              <p className="text-muted-foreground">Review your selections and create the nutrition plan</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Player:</span>
                  <span className="text-sm">{selectedPlayerData?.user?.first_name} {selectedPlayerData?.user?.last_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Plan Type:</span>
                  <span className="text-sm">{planType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Duration:</span>
                  <span className="text-sm">{getDurationString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Method:</span>
                  <span className="text-sm">
                    {planMode === 'ai' ? 'AI Generated' : planMode === 'template' ? 'Template-based' : 'Manual Creation'}
                  </span>
                </div>
                {selectedTemplate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Template:</span>
                    <span className="text-sm">{selectedTemplate.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Special Considerations (Optional)</label>
                <textarea
                  value={specialConsiderations}
                  onChange={(e) => onSpecialConsiderationsChange(e.target.value)}
                  placeholder="Any special considerations, dietary restrictions, or notes..."
                  rows={3}
                  className="w-full p-3 border rounded-md resize-none text-sm"
                />
              </div>

              <div className="pt-4">
                <Button
                  onClick={onNext}
                  disabled={!canProceedStep3}
                  className="w-full h-12"
                  size="lg"
                >
                  Generate Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Step Navigation */}
      <div className="flex justify-between items-center max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={() => onStepChange(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <div className="text-sm text-muted-foreground">
          Step {currentStep} of 4
        </div>
        <Button
          onClick={() => onStepChange(Math.min(4, currentStep + 1))}
          disabled={
            currentStep === 4 ||
            (currentStep === 1 && !canProceedStep1) ||
            (currentStep === 2 && !canProceedStep2) ||
            (currentStep === 3 && !canProceedStep3)
          }
        >
          Next
          <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
        </Button>
      </div>
    </div>
  );
}