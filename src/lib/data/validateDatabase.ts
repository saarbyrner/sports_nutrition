/**
 * Manual Database Validation Script
 * 
 * Validates our food database implementation and logs results.
 * Run this during development to ensure data quality.
 */

import { FOODS_DATABASE, foodSearch, FoodCategory, Allergen } from './foodDatabase'

export function validateFoodDatabase() {
  console.log('🔍 Validating Food Database...\n')
  
  let errors = 0
  let warnings = 0

  // Test 1: Data integrity
  console.log('1️⃣ Testing data integrity...')
  FOODS_DATABASE.forEach((food, index) => {
    if (!food.id || !food.name || !food.category) {
      console.error(`❌ Food at index ${index} missing required fields`)
      errors++
    }
    
    if (food.portions.length === 0) {
      console.error(`❌ Food "${food.name}" has no portions`)
      errors++
    }
    
    if (!food.portions.some(p => p.isDefault)) {
      console.warn(`⚠️ Food "${food.name}" has no default portion`)
      warnings++
    }
  })
  console.log(`✅ Tested ${FOODS_DATABASE.length} foods\n`)

  // Test 2: Search functionality
  console.log('2️⃣ Testing search functionality...')
  
  const searchTests = [
    { query: 'chicken', expectedResults: true },
    { query: 'salmon', expectedResults: true },
    { query: 'quinoa', expectedResults: true },
    { query: 'invalidfoodname123', expectedResults: false }
  ]
  
  searchTests.forEach(test => {
    const results = foodSearch.search(test.query, { maxResults: 10 })
    if (test.expectedResults && results.length === 0) {
      console.error(`❌ Search for "${test.query}" returned no results but should have`)
      errors++
    } else if (!test.expectedResults && results.length > 0) {
      console.warn(`⚠️ Search for "${test.query}" returned results: ${results.map(r => r.name).join(', ')}`)
      warnings++
    } else {
      console.log(`✅ Search "${test.query}": ${results.length} results`)
    }
  })
  console.log()

  // Test 3: Category filtering
  console.log('3️⃣ Testing category filtering...')
  Object.values(FoodCategory).forEach(category => {
    const results = foodSearch.getFoodsByCategory(category)
    console.log(`✅ ${category}: ${results.length} foods`)
  })
  console.log()

  // Test 4: Dietary filtering
  console.log('4️⃣ Testing dietary filtering...')
  
  const vegetarianFoods = foodSearch.search('', { 
    dietaryRequirements: { vegetarian: true },
    maxResults: 50
  })
  console.log(`✅ Vegetarian foods: ${vegetarianFoods.length}`)
  
  const glutenFreeFoods = foodSearch.search('', { 
    dietaryRequirements: { glutenFree: true },
    maxResults: 50
  })
  console.log(`✅ Gluten-free foods: ${glutenFreeFoods.length}`)
  
  const noMilkFoods = foodSearch.search('', { 
    excludeAllergens: [Allergen.MILK],
    maxResults: 50
  })
  console.log(`✅ Dairy-free foods: ${noMilkFoods.length}`)
  console.log()

  // Test 5: Performance
  console.log('5️⃣ Testing search performance...')
  const startTime = performance.now()
  
  for (let i = 0; i < 100; i++) {
    foodSearch.search('chicken protein')
  }
  
  const endTime = performance.now()
  const avgTime = (endTime - startTime) / 100
  
  if (avgTime > 10) {
    console.warn(`⚠️ Average search time: ${avgTime.toFixed(2)}ms (should be < 10ms)`)
    warnings++
  } else {
    console.log(`✅ Average search time: ${avgTime.toFixed(2)}ms`)
  }
  console.log()

  // Summary
  console.log('📊 VALIDATION SUMMARY')
  console.log(`✅ Total foods: ${FOODS_DATABASE.length}`)
  console.log(`❌ Errors: ${errors}`)
  console.log(`⚠️ Warnings: ${warnings}`)
  
  if (errors === 0) {
    console.log('🎉 Food database validation PASSED!')
    return true
  } else {
    console.log('💥 Food database validation FAILED!')
    return false
  }
}

// Auto-run validation during development
if (typeof window === 'undefined') {
  validateFoodDatabase()
}