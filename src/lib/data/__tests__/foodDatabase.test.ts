/**
 * Comprehensive Test Suite for Food Database
 * 
 * Tests cover:
 * - Data integrity and validation
 * - Search engine functionality
 * - Performance benchmarks
 * - Edge cases and error handling
 * - Nutrition calculation accuracy
 * - Dietary filtering correctness
 * 
 * @author Claude Code (Expert Test Engineer)
 * @version 2.0.0
 */

import { 
  FoodSearchEngine, 
  foodSearch, 
  FOODS_DATABASE,
  FoodCategory,
  Allergen
} from '../foodDatabase'

describe('FoodDatabase', () => {
  describe('Data Integrity', () => {
    test('all foods have required fields', () => {
      FOODS_DATABASE.forEach(food => {
        expect(food.id).toBeDefined()
        expect(food.name).toBeDefined()
        expect(food.category).toBeDefined()
        expect(food.nutrition).toBeDefined()
        expect(food.portions).toBeDefined()
        expect(food.dietaryInfo).toBeDefined()
        expect(food.searchTerms).toBeDefined()
        expect(food.verified).toBeDefined()
        expect(food.lastUpdated).toBeDefined()
      })
    })

    test('nutrition data is valid', () => {
      FOODS_DATABASE.forEach(food => {
        const { nutrition } = food
        
        expect(nutrition.calories).toBeGreaterThanOrEqual(0)
        expect(nutrition.protein).toBeGreaterThanOrEqual(0)
        expect(nutrition.carbs).toBeGreaterThanOrEqual(0)
        expect(nutrition.fat).toBeGreaterThanOrEqual(0)
        
        // Calorie consistency check (approximate)
        const calculatedCalories = (nutrition.protein * 4) + (nutrition.carbs * 4) + (nutrition.fat * 9)
        const tolerance = nutrition.calories * 0.15 // 15% tolerance for fiber, alcohol, etc.
        
        expect(Math.abs(nutrition.calories - calculatedCalories)).toBeLessThanOrEqual(tolerance)
      })
    })

    test('portions have valid data', () => {
      FOODS_DATABASE.forEach(food => {
        expect(food.portions.length).toBeGreaterThan(0)
        
        // Should have at least one default portion
        const defaultPortions = food.portions.filter(p => p.isDefault)
        expect(defaultPortions.length).toBeGreaterThanOrEqual(1)
        expect(defaultPortions.length).toBeLessThanOrEqual(1) // Only one default
        
        food.portions.forEach(portion => {
          expect(portion.id).toBeDefined()
          expect(portion.name).toBeDefined()
          expect(portion.grams).toBeGreaterThan(0)
          expect(portion.grams).toBeLessThan(10000) // Sanity check
        })
      })
    })

    test('dietary info is consistent', () => {
      FOODS_DATABASE.forEach(food => {
        const { dietaryInfo } = food
        
        // Vegan foods must be vegetarian
        if (dietaryInfo.vegan) {
          expect(dietaryInfo.vegetarian).toBe(true)
        }
        
        // Foods with milk allergen cannot be dairy-free
        if (dietaryInfo.allergens.includes(Allergen.MILK)) {
          expect(dietaryInfo.dairyFree).toBe(false)
        }
        
        // Dairy-free foods shouldn't have milk allergen
        if (dietaryInfo.dairyFree) {
          expect(dietaryInfo.allergens).not.toContain(Allergen.MILK)
        }
        
        // Similar logic for other allergens
        if (dietaryInfo.allergens.includes(Allergen.WHEAT)) {
          expect(dietaryInfo.glutenFree).toBe(false)
        }
        
        if (dietaryInfo.allergens.includes(Allergen.TREE_NUTS) || dietaryInfo.allergens.includes(Allergen.PEANUTS)) {
          expect(dietaryInfo.nutFree).toBe(false)
        }
      })
    })

    test('search terms are lowercase and unique', () => {
      FOODS_DATABASE.forEach(food => {
        food.searchTerms.forEach(term => {
          expect(term).toBe(term.toLowerCase())
        })
        
        // Should not have duplicate search terms
        const uniqueTerms = [...new Set(food.searchTerms)]
        expect(food.searchTerms).toHaveLength(uniqueTerms.length)
      })
    })

    test('categories are valid', () => {
      const validCategories = Object.values(FoodCategory)
      
      FOODS_DATABASE.forEach(food => {
        expect(validCategories).toContain(food.category)
      })
    })
  })

  describe('Search Engine Functionality', () => {
    let searchEngine: FoodSearchEngine

    beforeEach(() => {
      searchEngine = new FoodSearchEngine(FOODS_DATABASE)
    })

    test('search returns relevant results', () => {
      const results = searchEngine.search('chicken')
      
      expect(results.length).toBeGreaterThan(0)
      
      // Should contain chicken breast if it exists
      const hasChicken = results.some(food => 
        food.name.toLowerCase().includes('chicken') ||
        food.searchTerms.some(term => term.includes('chicken'))
      )
      expect(hasChicken).toBe(true)
    })

    test('search handles partial matches', () => {
      const results = searchEngine.search('chick')
      
      // Should find chicken foods even with partial term
      const hasChickenFoods = results.some(food => 
        food.name.toLowerCase().includes('chicken')
      )
      expect(hasChickenFoods).toBe(true)
    })

    test('search respects category filtering', () => {
      const results = searchEngine.search('protein', { 
        category: FoodCategory.PROTEINS 
      })
      
      results.forEach(food => {
        expect(food.category).toBe(FoodCategory.PROTEINS)
      })
    })

    test('search respects dietary requirements', () => {
      const results = searchEngine.search('', { 
        dietaryRequirements: { vegetarian: true },
        maxResults: 50
      })
      
      results.forEach(food => {
        expect(food.dietaryInfo.vegetarian).toBe(true)
      })
    })

    test('search excludes allergens correctly', () => {
      const results = searchEngine.search('', { 
        excludeAllergens: [Allergen.MILK],
        maxResults: 50
      })
      
      results.forEach(food => {
        expect(food.dietaryInfo.allergens).not.toContain(Allergen.MILK)
      })
    })

    test('search limits results correctly', () => {
      const results = searchEngine.search('', { maxResults: 5 })
      
      expect(results.length).toBeLessThanOrEqual(5)
    })

    test('empty search returns reasonable defaults', () => {
      const results = searchEngine.search('')
      
      expect(results.length).toBeGreaterThan(0)
      expect(results.length).toBeLessThanOrEqual(20) // Default limit
    })

    test('getFoodById works correctly', () => {
      const firstFood = FOODS_DATABASE[0]
      const result = searchEngine.getFoodById(firstFood.id)
      
      expect(result).toEqual(firstFood)
    })

    test('getFoodById returns undefined for non-existent id', () => {
      const result = searchEngine.getFoodById('non-existent-id')
      
      expect(result).toBeUndefined()
    })

    test('getFoodsByCategory returns correct foods', () => {
      const category = FoodCategory.PROTEINS
      const results = searchEngine.getFoodsByCategory(category)
      
      results.forEach(food => {
        expect(food.category).toBe(category)
      })
    })
  })

  describe('Performance Tests', () => {
    let searchEngine: FoodSearchEngine

    beforeEach(() => {
      searchEngine = new FoodSearchEngine(FOODS_DATABASE)
    })

    test('search performance is acceptable', () => {
      const startTime = performance.now()
      
      // Perform multiple searches
      for (let i = 0; i < 100; i++) {
        searchEngine.search('chicken')
      }
      
      const endTime = performance.now()
      const avgTime = (endTime - startTime) / 100
      
      // Each search should take less than 10ms
      expect(avgTime).toBeLessThan(10)
    })

    test('complex search performance', () => {
      const startTime = performance.now()
      
      searchEngine.search('high protein chicken breast', {
        category: FoodCategory.PROTEINS,
        dietaryRequirements: { vegetarian: false },
        excludeAllergens: [Allergen.MILK, Allergen.EGGS],
        maxResults: 20
      })
      
      const endTime = performance.now()
      const searchTime = endTime - startTime
      
      // Complex search should complete in under 50ms
      expect(searchTime).toBeLessThan(50)
    })
  })

  describe('Edge Cases', () => {
    let searchEngine: FoodSearchEngine

    beforeEach(() => {
      searchEngine = new FoodSearchEngine(FOODS_DATABASE)
    })

    test('handles special characters in search', () => {
      const searches = ['café', 'naïve', 'résumé', '100%', 'low-fat']
      
      searches.forEach(query => {
        expect(() => searchEngine.search(query)).not.toThrow()
      })
    })

    test('handles very long search queries', () => {
      const longQuery = 'a'.repeat(1000)
      
      expect(() => searchEngine.search(longQuery)).not.toThrow()
      
      const results = searchEngine.search(longQuery)
      expect(Array.isArray(results)).toBe(true)
    })

    test('handles empty database gracefully', () => {
      const emptySearchEngine = new FoodSearchEngine([])
      
      const results = emptySearchEngine.search('anything')
      expect(results).toEqual([])
    })

    test('handles multiple spaces in search', () => {
      const results = searchEngine.search('  chicken   breast  ')
      
      expect(Array.isArray(results)).toBe(true)
    })

    test('case insensitive search works', () => {
      const lowerResults = searchEngine.search('chicken')
      const upperResults = searchEngine.search('CHICKEN')
      const mixedResults = searchEngine.search('ChIcKeN')
      
      expect(lowerResults).toEqual(upperResults)
      expect(upperResults).toEqual(mixedResults)
    })
  })

  describe('Nutrition Calculation Helpers', () => {
    test('portion-based nutrition calculation', () => {
      const food = FOODS_DATABASE.find(f => f.id === 'chicken-breast-skinless')
      if (!food) throw new Error('Test food not found')
      
      const portion = food.portions.find(p => p.name === '1 breast (medium)')
      if (!portion) throw new Error('Test portion not found')
      
      const quantity = 1
      const multiplier = (portion.grams / 100) * quantity
      
      const expectedCalories = Math.round(food.nutrition.calories * multiplier)
      const expectedProtein = Math.round(food.nutrition.protein * multiplier * 10) / 10
      
      expect(expectedCalories).toBeGreaterThan(0)
      expect(expectedProtein).toBeGreaterThan(0)
      
      // Sanity checks for chicken breast
      expect(expectedCalories).toBeGreaterThan(200) // Should be substantial calories
      expect(expectedProtein).toBeGreaterThan(40) // Should be high protein
    })
  })
})

describe('Global Food Search Instance', () => {
  test('global search instance is properly initialized', () => {
    expect(foodSearch).toBeDefined()
    expect(typeof foodSearch.search).toBe('function')
  })

  test('global search works as expected', () => {
    const results = foodSearch.search('chicken')
    expect(Array.isArray(results)).toBe(true)
  })
})