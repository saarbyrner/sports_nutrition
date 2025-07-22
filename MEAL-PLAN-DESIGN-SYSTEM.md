# Meal Plan Management Design System
*Production-Ready UI/UX Standardization Guide*

## Component Hierarchy & Standards

### Core Principles
1. **Progressive Disclosure** - Show essential info first, advanced options on demand
2. **Consistent Spacing** - Use standardized gaps, padding, and margins
3. **Unified Typography** - Consistent font weights, sizes, and hierarchy
4. **Semantic Colors** - Meaningful color coding for status, nutrition, and actions
5. **Accessibility First** - WCAG 2.1 compliance with proper focus management

---

## Layout Standards

### Grid System
```typescript
// Standardized responsive grid patterns
const GRID_PATTERNS = {
  cards: 'grid gap-4 md:grid-cols-2 lg:grid-cols-3',
  dashboard: 'grid gap-6 md:grid-cols-2 lg:grid-cols-4',
  form: 'grid grid-cols-1 lg:grid-cols-2 gap-8',
  details: 'grid grid-cols-1 md:grid-cols-2 gap-6'
}
```

### Spacing Scale
```typescript
const SPACING = {
  xs: 'space-y-2',    // 8px  - Tight groupings
  sm: 'space-y-3',    // 12px - Form fields
  md: 'space-y-4',    // 16px - Card sections
  lg: 'space-y-6',    // 24px - Page sections
  xl: 'space-y-8'     // 32px - Major sections
}
```

---

## Typography Hierarchy

### Headings
```typescript
const TYPOGRAPHY = {
  h1: 'text-3xl font-bold tracking-tight',        // Page titles
  h2: 'text-2xl font-semibold',                   // Section titles
  h3: 'text-lg font-semibold',                    // Card titles
  h4: 'text-base font-medium',                    // Subsection titles
  body: 'text-sm',                                // Body text
  caption: 'text-xs text-muted-foreground',       // Helper text
  label: 'text-sm font-medium',                   // Form labels
}
```

### Text Colors
```typescript
const TEXT_COLORS = {
  primary: 'text-foreground',
  secondary: 'text-muted-foreground', 
  success: 'text-green-600',
  warning: 'text-amber-600',
  error: 'text-destructive',
  info: 'text-blue-600'
}
```

---

## Nutrition Color System

### Macronutrient Colors
```typescript
const NUTRITION_COLORS = {
  calories: {
    icon: 'text-orange-600',
    bg: 'bg-orange-100',
    border: 'border-orange-300',
    text: 'text-orange-800'
  },
  protein: {
    icon: 'text-blue-600',
    bg: 'bg-blue-100', 
    border: 'border-blue-300',
    text: 'text-blue-800'
  },
  carbs: {
    icon: 'text-green-600',
    bg: 'bg-green-100',
    border: 'border-green-300', 
    text: 'text-green-800'
  },
  fat: {
    icon: 'text-purple-600',
    bg: 'bg-purple-100',
    border: 'border-purple-300',
    text: 'text-purple-800'
  }
}
```

### Status Colors
```typescript
const STATUS_COLORS = {
  active: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  draft: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
  completed: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  archived: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' }
}
```

---

## Component Standards

### Button Hierarchy
```typescript
const BUTTON_STYLES = {
  primary: 'Button default',           // Main actions
  secondary: 'Button variant="outline"', // Secondary actions  
  tertiary: 'Button variant="ghost"',  // Low-priority actions
  destructive: 'Button variant="destructive"', // Delete actions
  
  // Sizes for different contexts
  xs: 'size="sm" className="h-8 px-2"',      // Table actions
  sm: 'size="sm" className="h-9 px-3"',      // Modal actions
  md: 'size="default" className="h-10 px-4"', // Form actions
  lg: 'size="lg" className="h-11 px-6"',     // Primary CTAs
}
```

### Card Components
```typescript
const CARD_PATTERNS = {
  stat: 'Card with icon + value + label',
  summary: 'Card with header + nutrition display',
  list: 'Card with header + table/list content',
  form: 'Card with header + form fields',
  preview: 'Card with image/icon + content + actions'
}
```

### Input Standards
```typescript
const INPUT_STYLES = {
  default: 'Input className="h-10"',           // Standard forms
  compact: 'Input className="h-8"',           // Inline editing
  large: 'Input className="h-12"',            // Prominent forms
  
  // States
  error: 'border-destructive focus:ring-destructive',
  success: 'border-green-500 focus:ring-green-500'
}
```

---

## Modal vs Page Pattern (Standardized)

### When to Use Modal
- **Quick Create** - Essential fields only (3-5 inputs)
- **Quick Edit** - Single property changes
- **Confirmations** - Delete, archive, status changes
- **Previews** - View details without navigation

### When to Use Full Page
- **Advanced Create** - Complex forms (6+ fields)
- **Detailed Edit** - Multiple sections, file uploads
- **Multi-step Workflows** - Wizards, guided processes
- **Data-heavy Views** - Tables, charts, comprehensive displays

### Modal Sizing Standards
```typescript
const MODAL_SIZES = {
  sm: 'max-w-md',     // Confirmations, simple forms
  md: 'max-w-lg',     // Quick create modals
  lg: 'max-w-2xl',    // Preview modals
  xl: 'max-w-4xl',    // Complex forms in modals
  full: 'max-w-7xl'   // Data tables in modals
}
```

---

## Loading & Empty States

### Loading Patterns
```typescript
const LOADING_STATES = {
  skeleton: 'Skeleton loaders for content',
  spinner: 'RefreshCw animate-spin for actions',
  overlay: 'Overlay with spinner for page transitions',
  inline: 'Sparkles animate-spin for AI generation'
}
```

### Empty States
```typescript
const EMPTY_STATES = {
  noData: {
    icon: 'Large icon (h-12 w-12)',
    title: 'Descriptive title',
    description: 'Helpful explanation',
    action: 'Primary CTA button'
  },
  noResults: {
    icon: 'Search icon',
    title: 'No results found',
    description: 'Try adjusting filters',
    action: 'Clear filters button'
  }
}
```

---

## Icon System

### Standard Icons by Context
```typescript
const ICON_SYSTEM = {
  // Navigation & Actions
  back: 'ArrowLeft',
  save: 'Save', 
  edit: 'Edit',
  delete: 'Trash2',
  view: 'Eye',
  download: 'Download',
  
  // Nutrition & Food
  calories: 'Zap',
  protein: 'Dumbbell',
  carbs: 'Wheat', 
  fat: 'Droplet',
  meal: 'Utensils',
  
  // Status & Feedback
  success: 'CheckCircle',
  warning: 'AlertTriangle',
  error: 'AlertCircle',
  info: 'Info',
  
  // AI & Generation
  ai: 'Brain',
  generate: 'Sparkles',
  magic: 'Wand2'
}
```

### Icon Sizing Standards
```typescript
const ICON_SIZES = {
  xs: 'h-3 w-3',    // Inline with small text
  sm: 'h-4 w-4',    // Button icons, table actions
  md: 'h-5 w-5',    // Card headers, form labels  
  lg: 'h-6 w-6',    // Page headers, major actions
  xl: 'h-8 w-8',    // Feature highlights
  hero: 'h-12 w-12' // Empty states, loading
}
```

---

## Animation & Transitions

### Standard Transitions
```typescript
const TRANSITIONS = {
  fast: 'transition-all duration-150',      // Hover effects
  normal: 'transition-all duration-200',    // Modal open/close
  slow: 'transition-all duration-300',      // Page transitions
  
  // Specialized animations
  spin: 'animate-spin',                     // Loading spinners
  pulse: 'animate-pulse',                   // Skeleton loading
  bounce: 'animate-bounce'                  // Success feedback
}
```

---

## Accessibility Standards

### Focus Management
```typescript
const FOCUS_STYLES = {
  default: 'focus:ring-2 focus:ring-primary focus:ring-offset-2',
  destructive: 'focus:ring-2 focus:ring-destructive focus:ring-offset-2',
  custom: 'focus:outline-none focus:ring-2 focus:ring-blue-500'
}
```

### ARIA Labels
```typescript
const ARIA_PATTERNS = {
  button: 'aria-label="Action description"',
  input: 'aria-describedby="help-text-id"',
  status: 'role="status" aria-live="polite"',
  alert: 'role="alert" aria-live="assertive"'
}
```

---

## Implementation Checklist

### Component Standards ✅
- [x] PlayerSelector - Unified selection interface
- [x] NutritionSummary - Standardized macro display
- [x] Modal vs Page patterns - Progressive disclosure
- [x] Color system - Semantic nutrition colors
- [x] Typography hierarchy - Consistent text styles

### In Progress 🔄
- [ ] Button component standardization
- [ ] Loading state components
- [ ] Error boundary implementation
- [ ] Animation system integration

### Next Phase 📋
- [ ] Form validation patterns
- [ ] Table component standards
- [ ] Chart/visualization consistency
- [ ] Mobile responsiveness audit
- [ ] Performance optimization review

---

## Usage Examples

### Standard Meal Plan Card
```typescript
<Card>
  <CardHeader className="pb-4">
    <CardTitle className="flex items-center gap-2">
      <Utensils className="h-5 w-5" />
      Plan Name
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <NutritionCards data={nutritionData} />
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="sm">
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </Button>
      <Button size="sm">
        <Eye className="h-4 w-4 mr-2" />
        View
      </Button>
    </div>
  </CardContent>
</Card>
```

### Standard Form Layout
```typescript
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <Card>
    <CardHeader>
      <CardTitle>Configuration</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <SimplePlayerSelector
        value={selectedPlayer}
        onValueChange={setSelectedPlayer}
        required
      />
      {/* Additional form fields */}
    </CardContent>
  </Card>
  <Card>
    <CardHeader>
      <CardTitle>Preview</CardTitle>
    </CardHeader>
    <CardContent>
      <NutritionSummary data={previewData} layout="detailed" />
    </CardContent>
  </Card>
</div>
```

---

*This design system ensures consistent, accessible, and maintainable UI/UX across all meal plan management interfaces. All components should follow these standards for production-ready quality.*