/**
 * Smart Nutrition Validation System
 * 
 * World-class nutrition validation with real-time feedback,
 * sports nutrition guidelines, and intelligent recommendations.
 * 
 * Features:
 * - Real-time macro balance validation
 * - Sport-specific nutrition guidelines
 * - Meal timing optimization
 * - Nutrient adequacy assessment
 * - Smart portion recommendations
 * - Progressive validation with context
 * 
 * UX Design Principles:
 * - Instant feedback without overwhelming
 * - Progressive disclosure of validation details
 * - Actionable recommendations
 * - Visual nutrition indicators
 * - Context-aware validation (training vs rest days)
 * 
 * @author Claude Code (Expert Sports Nutritionist & UX Designer)
 * @version 2.0.0 - Smart Nutrition Validation
 */

import { FoodItem } from '../data/foodDatabase'

export interface NutritionTarget {
  calories: { min: number; max: number; optimal: number }
  protein: { min: number; max: number; optimal: number } // grams
  carbs: { min: number; max: number; optimal: number }   // grams
  fat: { min: number; max: number; optimal: number }     // grams
  fiber: { min: number; optimal: number }                // grams
  sodium: { max: number; optimal: number }               // milligrams
  
  // Micronutrients (optional but valuable for athletes)
  iron?: { min: number; optimal: number }                // mg
  calcium?: { min: number; optimal: number }             // mg
  vitaminD?: { min: number; optimal: number }            // IU
  vitaminC?: { min: number; optimal: number }            // mg
}

export interface AthleteProfile {
  // Basic info
  age: number
  gender: 'male' | 'female' | 'other'
  weight: number // kg
  height: number // cm
  bodyFatPercentage?: number
  
  // Activity level
  sport: string
  trainingIntensity: 'low' | 'moderate' | 'high' | 'extreme'
  trainingFrequency: number // sessions per week
  
  // Goals
  primaryGoal: 'performance' | 'weight_loss' | 'muscle_gain' | 'maintenance' | 'recovery'
  
  // Training context
  isTrainingDay: boolean
  trainingType?: 'strength' | 'endurance' | 'power' | 'mixed'
  trainingDuration?: number // minutes
  
  // Dietary preferences
  dietaryRestrictions: string[]
  mealsPerDay: number
}

export interface MealItem {
  food: FoodItem
  portionId: string
  quantity: number
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout'
  timing?: string // HH:MM format
}

export interface NutritionSummary {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sodium: number
  
  // Calculated values
  proteinPercentage: number // % of total calories
  carbsPercentage: number
  fatPercentage: number
  proteinPerKg: number // g per kg body weight
  
  // Micronutrients
  iron?: number
  calcium?: number
  vitaminD?: number
  vitaminC?: number
}

export enum ValidationLevel {
  EXCELLENT = 'excellent',
  GOOD = 'good', 
  FAIR = 'fair',
  POOR = 'poor',
  CRITICAL = 'critical'
}

export interface ValidationResult {
  overall: ValidationLevel
  score: number // 0-100
  
  categories: {
    calories: ValidationCategory
    macros: ValidationCategory
    micronutrients: ValidationCategory
    timing: ValidationCategory
    hydration: ValidationCategory
  }
  
  recommendations: NutritionRecommendation[]
  warnings: NutritionWarning[]
}

export interface ValidationCategory {
  level: ValidationLevel
  score: number
  message: string
  details: string[]
}

export interface NutritionRecommendation {
  type: 'add_food' | 'adjust_portion' | 'timing' | 'replace_food' | 'hydration'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  
  // Actionable suggestions
  suggestedFoods?: string[] // food IDs
  targetMeal?: string
  portionAdjustment?: number // multiplier
  
  // Context
  reasoning: string
  expectedImpact: string
}

export interface NutritionWarning {
  type: 'excess' | 'deficiency' | 'imbalance' | 'timing' | 'safety'
  severity: 'info' | 'warning' | 'error'
  nutrient: string
  message: string
  recommendation: string
}

/**
 * Calculate nutrition targets based on athlete profile
 */
export function calculateNutritionTargets(profile: AthleteProfile): NutritionTarget {
  const { weight, gender, age, trainingIntensity, primaryGoal, isTrainingDay } = profile
  
  // Base Metabolic Rate (Mifflin-St Jeor Equation)
  const bmr = gender === 'male' 
    ? (10 * weight) + (6.25 * profile.height) - (5 * age) + 5
    : (10 * weight) + (6.25 * profile.height) - (5 * age) - 161
  
  // Activity multipliers for athletes
  const activityMultipliers = {
    low: isTrainingDay ? 1.6 : 1.4,
    moderate: isTrainingDay ? 1.8 : 1.5,
    high: isTrainingDay ? 2.0 : 1.6,
    extreme: isTrainingDay ? 2.2 : 1.8
  }
  
  const baseCalories = bmr * activityMultipliers[trainingIntensity]
  
  // Goal adjustments
  const goalMultipliers = {
    weight_loss: 0.85,
    muscle_gain: 1.15,
    performance: 1.0,
    maintenance: 1.0,
    recovery: 1.05
  }
  
  const targetCalories = baseCalories * goalMultipliers[primaryGoal]
  
  // Protein targets (sport-specific)
  const proteinPerKg = (() => {
    if (profile.sport.includes('strength') || profile.sport.includes('power')) {
      return primaryGoal === 'muscle_gain' ? 2.2 : 2.0
    }
    if (profile.sport.includes('endurance')) {
      return isTrainingDay ? 1.6 : 1.4
    }
    return primaryGoal === 'muscle_gain' ? 2.0 : 1.6 // General athletes
  })()
  
  const proteinTarget = proteinPerKg * weight
  
  // Carb targets (training day vs rest day)
  const carbsPerKg = (() => {
    if (!isTrainingDay) return 3 // Rest day
    
    if (trainingIntensity === 'extreme') return 8
    if (trainingIntensity === 'high') return 6
    if (trainingIntensity === 'moderate') return 5
    return 4
  })()
  
  const carbsTarget = carbsPerKg * weight
  
  // Fat targets (remaining calories)
  const proteinCalories = proteinTarget * 4
  const carbsCalories = carbsTarget * 4
  const fatCalories = targetCalories - proteinCalories - carbsCalories
  const fatTarget = Math.max(fatCalories / 9, weight * 0.8) // Minimum 0.8g/kg
  
  return {
    calories: {
      min: targetCalories * 0.9,
      max: targetCalories * 1.1,
      optimal: targetCalories
    },
    protein: {
      min: proteinTarget * 0.8,
      max: proteinTarget * 1.3,
      optimal: proteinTarget
    },
    carbs: {
      min: carbsTarget * 0.7,
      max: carbsTarget * 1.3, 
      optimal: carbsTarget
    },
    fat: {
      min: weight * 0.8,
      max: fatTarget * 1.5,
      optimal: fatTarget
    },
    fiber: {
      min: 25,
      optimal: 35
    },
    sodium: {
      max: 2300,
      optimal: 1500
    },
    iron: {
      min: gender === 'male' ? 8 : 18,
      optimal: gender === 'male' ? 12 : 25
    },
    calcium: {
      min: 1000,
      optimal: 1200
    },
    vitaminD: {
      min: 600,
      optimal: 1000
    },
    vitaminC: {
      min: gender === 'male' ? 90 : 75,
      optimal: 200
    }
  }
}

/**
 * Calculate nutrition summary from meal items
 */
export function calculateNutritionSummary(
  meals: MealItem[], 
  profile: AthleteProfile
): NutritionSummary {
  const totalNutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sodium: 0,
    iron: 0,
    calcium: 0,
    vitaminD: 0,
    vitaminC: 0
  }
  
  meals.forEach(meal => {
    const portion = meal.food.portions.find(p => p.id === meal.portionId)
    if (!portion) return
    
    const multiplier = (portion.grams / 100) * meal.quantity
    const nutrition = meal.food.nutrition
    
    totalNutrition.calories += nutrition.calories * multiplier
    totalNutrition.protein += nutrition.protein * multiplier
    totalNutrition.carbs += nutrition.carbs * multiplier
    totalNutrition.fat += nutrition.fat * multiplier
    totalNutrition.fiber += (nutrition.fiber || 0) * multiplier
    totalNutrition.sodium += (nutrition.sodium || 0) * multiplier
    totalNutrition.iron += (nutrition.iron || 0) * multiplier
    totalNutrition.calcium += (nutrition.calcium || 0) * multiplier
    totalNutrition.vitaminD += (nutrition.vitaminD || 0) * multiplier
    totalNutrition.vitaminC += (nutrition.vitaminC || 0) * multiplier
  })
  
  const totalCalories = totalNutrition.calories
  
  return {
    calories: Math.round(totalNutrition.calories),
    protein: Math.round(totalNutrition.protein * 10) / 10,
    carbs: Math.round(totalNutrition.carbs * 10) / 10,
    fat: Math.round(totalNutrition.fat * 10) / 10,
    fiber: Math.round(totalNutrition.fiber * 10) / 10,
    sodium: Math.round(totalNutrition.sodium),
    
    proteinPercentage: Math.round((totalNutrition.protein * 4 / totalCalories) * 100),
    carbsPercentage: Math.round((totalNutrition.carbs * 4 / totalCalories) * 100),
    fatPercentage: Math.round((totalNutrition.fat * 9 / totalCalories) * 100),
    proteinPerKg: Math.round((totalNutrition.protein / profile.weight) * 10) / 10,
    
    iron: Math.round(totalNutrition.iron * 10) / 10,
    calcium: Math.round(totalNutrition.calcium),
    vitaminD: Math.round(totalNutrition.vitaminD),
    vitaminC: Math.round(totalNutrition.vitaminC * 10) / 10
  }
}

/**
 * Smart nutrition validation with expert recommendations
 */
export class NutritionValidator {
  private targets: NutritionTarget
  private profile: AthleteProfile
  
  constructor(profile: AthleteProfile) {
    this.profile = profile
    this.targets = calculateNutritionTargets(profile)
  }
  
  validate(meals: MealItem[]): ValidationResult {
    const summary = calculateNutritionSummary(meals, this.profile)
    
    const categories = {
      calories: this.validateCalories(summary),
      macros: this.validateMacros(summary),
      micronutrients: this.validateMicronutrients(summary),
      timing: this.validateTiming(meals),
      hydration: this.validateHydration(meals)
    }
    
    // Calculate overall score
    const weights = { calories: 0.25, macros: 0.35, micronutrients: 0.2, timing: 0.15, hydration: 0.05 }
    const overallScore = Object.entries(categories).reduce((score, [key, category]) => {
      return score + (category.score * weights[key as keyof typeof weights])
    }, 0)
    
    const overall = this.scoreToLevel(overallScore)
    
    return {
      overall,
      score: Math.round(overallScore),
      categories,
      recommendations: this.generateRecommendations(summary, meals),
      warnings: this.generateWarnings(summary)
    }
  }
  
  private validateCalories(summary: NutritionSummary): ValidationCategory {
    const { calories } = this.targets
    const actual = summary.calories
    
    let level: ValidationLevel
    let message: string
    let score: number
    
    if (actual >= calories.min && actual <= calories.max) {
      level = ValidationLevel.EXCELLENT
      score = 95
      message = `Perfect calorie intake for your goals`
    } else if (actual >= calories.min * 0.8 && actual <= calories.max * 1.2) {
      level = ValidationLevel.GOOD
      score = 80
      message = `Good calorie intake, close to target`
    } else if (actual >= calories.min * 0.6 && actual <= calories.max * 1.4) {
      level = ValidationLevel.FAIR
      score = 60
      message = `Calories could be better aligned with goals`
    } else {
      level = ValidationLevel.POOR
      score = 30
      message = `Significant calorie mismatch for your goals`
    }
    
    const details = [
      `Target: ${Math.round(calories.optimal)} calories`,
      `Actual: ${actual} calories`,
      `Range: ${Math.round(calories.min)}-${Math.round(calories.max)} calories`
    ]
    
    return { level, score, message, details }
  }
  
  private validateMacros(summary: NutritionSummary): ValidationCategory {
    const proteinScore = this.validateNutrient(summary.protein, this.targets.protein)
    const carbsScore = this.validateNutrient(summary.carbs, this.targets.carbs)
    const fatScore = this.validateNutrient(summary.fat, this.targets.fat)
    
    const avgScore = (proteinScore + carbsScore + fatScore) / 3
    const level = this.scoreToLevel(avgScore)
    
    const details = [
      `Protein: ${summary.protein}g (${summary.proteinPercentage}% calories, ${summary.proteinPerKg}g/kg)`,
      `Carbs: ${summary.carbs}g (${summary.carbsPercentage}% calories)`,
      `Fat: ${summary.fat}g (${summary.fatPercentage}% calories)`
    ]
    
    let message = 'Macro balance '
    if (level === ValidationLevel.EXCELLENT) message += 'is excellent for your sport'
    else if (level === ValidationLevel.GOOD) message += 'is good with minor adjustments needed'
    else if (level === ValidationLevel.FAIR) message += 'needs some improvement'
    else message += 'needs significant improvement'
    
    return { level, score: Math.round(avgScore), message, details }
  }
  
  private validateMicronutrients(summary: NutritionSummary): ValidationCategory {
    const scores: number[] = []
    const details: string[] = []
    
    // Fiber
    if (this.targets.fiber) {
      const fiberScore = this.validateNutrient(summary.fiber, { 
        min: this.targets.fiber.min, 
        max: this.targets.fiber.optimal * 1.5, 
        optimal: this.targets.fiber.optimal 
      })
      scores.push(fiberScore)
      details.push(`Fiber: ${summary.fiber}g (target: ${this.targets.fiber.optimal}g)`)
    }
    
    // Sodium
    const sodiumScore = summary.sodium <= this.targets.sodium.optimal ? 100 :
      summary.sodium <= this.targets.sodium.max ? 80 : 40
    scores.push(sodiumScore)
    details.push(`Sodium: ${summary.sodium}mg (max: ${this.targets.sodium.max}mg)`)
    
    // Iron (if available)
    if (summary.iron && this.targets.iron) {
      const ironScore = this.validateNutrient(summary.iron, {
        min: this.targets.iron.min,
        max: this.targets.iron.optimal * 2,
        optimal: this.targets.iron.optimal
      })
      scores.push(ironScore)
      details.push(`Iron: ${summary.iron}mg (target: ${this.targets.iron.optimal}mg)`)
    }
    
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 80
    const level = this.scoreToLevel(avgScore)
    
    return {
      level,
      score: Math.round(avgScore),
      message: `Micronutrient profile is ${level}`,
      details
    }
  }
  
  private validateTiming(meals: MealItem[]): ValidationCategory {
    // Simplified timing validation
    const mealTypes = meals.map(m => m.mealType)
    const hasPreWorkout = mealTypes.includes('pre_workout')
    const hasPostWorkout = mealTypes.includes('post_workout')
    
    let score = 70 // Base score
    const details: string[] = []
    
    if (this.profile.isTrainingDay) {
      if (hasPreWorkout) {
        score += 15
        details.push('✓ Pre-workout nutrition included')
      } else {
        details.push('⚠ Consider adding pre-workout nutrition')
      }
      
      if (hasPostWorkout) {
        score += 15
        details.push('✓ Post-workout recovery nutrition included')
      } else {
        details.push('⚠ Post-workout nutrition recommended')
      }
    }
    
    return {
      level: this.scoreToLevel(score),
      score,
      message: `Meal timing is ${this.scoreToLevel(score)} for your training`,
      details
    }
  }
  
  private validateHydration(_meals: MealItem[]): ValidationCategory {
    // Simplified hydration check based on beverage intake
    const beverages = _meals.filter(m => m.food.category === 'beverages')
    const score = beverages.length > 0 ? 90 : 60
    
    return {
      level: this.scoreToLevel(score),
      score,
      message: 'Remember to monitor hydration throughout the day',
      details: ['Track fluid intake separately from food logging']
    }
  }
  
  private validateNutrient(actual: number, target: { min: number; max: number; optimal: number }): number {
    if (actual >= target.min && actual <= target.max) {
      // Perfect range
      const distanceFromOptimal = Math.abs(actual - target.optimal) / target.optimal
      return Math.max(85, 100 - (distanceFromOptimal * 50))
    } else if (actual >= target.min * 0.8 && actual <= target.max * 1.2) {
      // Close to range
      return 75
    } else if (actual >= target.min * 0.6 && actual <= target.max * 1.5) {
      // Somewhat off
      return 50
    } else {
      // Far from target
      return 25
    }
  }
  
  private scoreToLevel(score: number): ValidationLevel {
    if (score >= 90) return ValidationLevel.EXCELLENT
    if (score >= 75) return ValidationLevel.GOOD
    if (score >= 60) return ValidationLevel.FAIR
    if (score >= 40) return ValidationLevel.POOR
    return ValidationLevel.CRITICAL
  }
  
  private generateRecommendations(summary: NutritionSummary, meals: MealItem[]): NutritionRecommendation[] {
    const recommendations: NutritionRecommendation[] = []
    
    // Protein recommendations
    if (summary.protein < this.targets.protein.min) {
      recommendations.push({
        type: 'add_food',
        priority: 'high',
        title: 'Increase Protein Intake',
        description: `Add ${Math.round(this.targets.protein.optimal - summary.protein)}g more protein`,
        suggestedFoods: ['chicken-breast-skinless', 'greek-yogurt-plain-nonfat'],
        reasoning: 'Adequate protein supports muscle recovery and performance',
        expectedImpact: 'Better recovery and muscle protein synthesis'
      })
    }
    
    // Carb recommendations for training days
    if (this.profile.isTrainingDay && summary.carbs < this.targets.carbs.min) {
      recommendations.push({
        type: 'add_food',
        priority: 'high',
        title: 'Increase Carbohydrate Intake',
        description: 'Add quality carbs to fuel your training',
        suggestedFoods: ['quinoa-cooked', 'banana-medium'],
        targetMeal: 'pre_workout',
        reasoning: 'Carbohydrates are essential for high-intensity training',
        expectedImpact: 'Improved training performance and energy levels'
      })
    }
    
    // Fiber recommendation
    if (summary.fiber < this.targets.fiber!.min) {
      recommendations.push({
        type: 'add_food',
        priority: 'medium',
        title: 'Increase Fiber Intake',
        description: 'Add more vegetables and whole grains',
        suggestedFoods: ['broccoli-raw', 'brown-rice-cooked'],
        reasoning: 'Fiber supports digestive health and nutrient absorption',
        expectedImpact: 'Better digestion and sustained energy'
      })
    }
    
    return recommendations
  }
  
  private generateWarnings(summary: NutritionSummary): NutritionWarning[] {
    const warnings: NutritionWarning[] = []
    
    // Excessive sodium
    if (summary.sodium > this.targets.sodium.max) {
      warnings.push({
        type: 'excess',
        severity: 'warning',
        nutrient: 'sodium',
        message: `Sodium intake (${summary.sodium}mg) exceeds recommended maximum`,
        recommendation: 'Reduce processed foods and added salt'
      })
    }
    
    // Very low calories
    if (summary.calories < this.targets.calories.min * 0.7) {
      warnings.push({
        type: 'deficiency',
        severity: 'error',
        nutrient: 'calories',
        message: 'Calorie intake is dangerously low for an athlete',
        recommendation: 'Increase overall food intake to support training demands'
      })
    }
    
    return warnings
  }
}

/**
 * Export convenience function for quick validation
 */
export function validateNutrition(
  meals: MealItem[], 
  profile: AthleteProfile
): ValidationResult {
  const validator = new NutritionValidator(profile)
  return validator.validate(meals)
}