# Meal Plan UX Design System

**Date:** January 21, 2025  
**Designer:** Claude Code (Expert Software Engineer)  
**System:** Sports Nutrition Application - Meal Plan Creation Standardization

## Design Philosophy

### Progressive Disclosure Principle
Users should be presented with simple options first, with the ability to access more complex functionality as needed.

### Dual Creation Pattern
- **Quick Create Modal**: For simple, fast meal plan creation
- **Advanced Create Page**: For detailed, multi-step meal plan creation

## UX Standards

### When to Use Modal vs Page

#### ✅ Use Modal For:
- Quick plan creation (< 5 fields)
- Template application
- Simple edits
- Confirmation dialogs
- Time-sensitive workflows

#### ✅ Use Page For:
- Complex multi-step workflows
- Multiple data entry sections
- Rich editing experiences
- Plan customization with preview
- Data-heavy operations

## Component Architecture

### Modal Pattern: Quick Create
```
CreatePlanModal
├── Player Selection (required)
├── Plan Type (required) 
├── Duration (required)
├── AI Generate Button
└── Create Button
```

**Purpose**: Get users started quickly with AI-generated plans

### Page Pattern: Advanced Create
```
CreatePlanPage
├── Setup Tab
│   ├── Creation Method Selection (AI/Template/Manual)
│   ├── Player Selection
│   ├── Plan Configuration
│   └── Special Considerations
├── Plan Tab
│   ├── Meal Planning Interface
│   ├── Food Selection
│   └── Nutritional Balance
└── Review Tab
    ├── Plan Summary
    ├── Nutrition Analysis
    └── Publish Options
```

**Purpose**: Comprehensive meal plan creation with full customization

## Visual Design Standards

### Consistency Requirements

#### Spacing
- Modal padding: 6 (24px)
- Page padding: 6 (24px) 
- Card padding: 4 (16px) for compact, 6 (24px) for standard
- Button gaps: 2 (8px) for related, 4 (16px) for sections

#### Typography
- Page titles: text-2xl font-semibold
- Section titles: text-lg font-semibold  
- Card titles: text-base font-semibold
- Body text: text-sm
- Helper text: text-xs text-muted-foreground

#### Button Hierarchy
- Primary actions: solid button with primary color
- Secondary actions: outline variant
- Destructive actions: destructive variant
- Ghost actions: ghost variant for subtle actions

#### Status Indicators
```typescript
const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  draft: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
  archived: 'bg-gray-100 text-gray-800 border-gray-200',
  error: 'bg-red-100 text-red-800 border-red-200'
}
```

## User Flow Standardization

### Entry Points
1. **"Create Plan"** button → Advanced Create Page
2. **"Quick Create"** button → Quick Create Modal
3. **Template "Use"** button → Quick Create Modal (pre-filled)

### Navigation Flow
```
Main App → Meal Plan Management
├── Quick Create Modal → Success → Back to Management
└── Advanced Create Page → Review → Success → Back to Management
```

### Error Handling Standards
- Field-level validation with inline messages
- Form-level validation with summary at top
- Network errors with retry functionality
- Graceful degradation with offline support

## Component Reusability

### Shared Components
- `PlayerSelector`: Unified player selection dropdown
- `MealPlanStatusBadge`: Consistent status display
- `NutritionSummary`: Standardized nutrition display
- `MealTimeSelector`: Time input with presets
- `PlanTypeSelector`: Consistent plan type selection

### Utility Hooks
- `usePlayerSelection`: Manages player dropdown state
- `useMealPlanValidation`: Centralized validation logic
- `useNutritionCalculation`: Macro calculation utilities

## Implementation Standards

### File Organization
```
src/components/meal-plans/
├── creation/
│   ├── CreatePlanModal.tsx        (Quick create)
│   ├── CreatePlanPage.tsx         (Advanced create)
│   └── shared/
│       ├── PlayerSelector.tsx
│       ├── PlanTypeSelector.tsx
│       └── NutritionSummary.tsx
├── management/
│   ├── MealPlanTable.tsx
│   └── MealPlanCard.tsx
└── shared/
    ├── MealPlanStatusBadge.tsx
    └── MealPlanActions.tsx
```

### TypeScript Standards
- All components properly typed with interfaces
- Consistent prop naming conventions
- Proper error type definitions
- Generic types for reusable components

## Success Metrics

### User Experience Goals
- ⚡ Quick create: < 30 seconds to generate plan
- 🎯 Advanced create: Complete workflow in < 5 minutes  
- 📱 Responsive design working on all screen sizes
- ♿ Accessibility compliance (WCAG 2.1 Level AA)

### Technical Goals
- 🚀 Component reuse > 80%
- 🧪 Test coverage > 90%
- 📦 Bundle size optimized
- 🔧 TypeScript strict mode compliance

## Migration Strategy

### Phase 1: Quick Create Optimization
1. Simplify CreatePlanModal to essentials only
2. Improve AI generation UX
3. Add success/error states

### Phase 2: Advanced Create Enhancement  
1. Enhance CreatePlanPage tabs
2. Add real-time preview
3. Implement meal drag-and-drop

### Phase 3: Integration & Polish
1. Consistent styling across both flows
2. Shared component extraction
3. Performance optimization

---

*This design system ensures consistent, user-friendly meal plan creation while maintaining the flexibility for both quick and comprehensive workflows.*