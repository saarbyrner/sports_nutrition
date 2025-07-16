import { MealPlan, Template, Player } from '@/lib/services/types'

export const mockPlayers: Player[] = [
  {
    id: 'player-1',
    user_id: 'user-1',
    date_of_birth: '1995-06-15',
    gender: 'Male',
    height: 180,
    weight: 75.5,
    position: 'Forward',
    sport: 'Soccer',
    team: 'Varsity Men',
    squad: 'First Team',
    jersey_number: 10,
    status: 'active',
    compliance_rate: 92,
    tags: ['Speed', 'Striker'],
    allergies: 'None',
    dietary_restrictions: 'Vegetarian',
    medical_conditions: 'None',
    emergency_contact: {
      name: 'Jane Doe',
      relationship: 'Mother',
      phone: '555-0124',
      email: 'jane.doe@example.com'
    },
    notes: 'Promising young player',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    user: {
      id: 'user-1',
      email: 'marcus.johnson@example.com',
      first_name: 'Marcus',
      last_name: 'Johnson',
      role: 'player',
      organization: 'Test University',
      phone: '555-0123',
      avatar_url: '',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    }
  },
  {
    id: 'player-2',
    user_id: 'user-2',
    date_of_birth: '1997-03-22',
    gender: 'Female',
    height: 165,
    weight: 60.0,
    position: 'Guard',
    sport: 'Basketball',
    team: 'Varsity Women',
    squad: 'First Team',
    jersey_number: 23,
    status: 'active',
    compliance_rate: 88,
    tags: ['Defense', 'Leadership'],
    allergies: 'Peanuts',
    dietary_restrictions: 'Gluten-free',
    medical_conditions: 'Asthma',
    emergency_contact: {
      name: 'Robert Smith',
      relationship: 'Father',
      phone: '555-0126',
      email: 'robert.smith@example.com'
    },
    notes: 'Team captain',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
    user: {
      id: 'user-2',
      email: 'sarah.williams@example.com',
      first_name: 'Sarah',
      last_name: 'Williams',
      role: 'player',
      organization: 'Test University',
      phone: '555-0125',
      avatar_url: '',
      created_at: '2024-01-16T10:00:00Z',
      updated_at: '2024-01-16T10:00:00Z'
    }
  }
]

export const mockMealPlans: MealPlan[] = [
  {
    id: 'meal-plan-1',
    player_id: 'player-1',
    title: 'High Protein Training Plan',
    description: 'Designed for intensive training periods',
    plan_type: 'training',
    status: 'active',
    calories: 3200,
    protein: 180,
    carbs: 420,
    fat: 110,
    fiber: 35,
    duration_days: 14,
    start_date: '2024-01-15',
    end_date: '2024-01-29',
    ai_confidence: 94,
    meal_data: {
      breakfast: {
        time: "7:00 AM",
        foods: ["Oatmeal with berries", "Greek yogurt", "Banana", "Almonds"],
        calories: 580,
        protein: 28,
        carbs: 78,
        fat: 18,
      },
      lunch: {
        time: "1:00 PM",
        foods: ["Grilled chicken breast", "Quinoa", "Steamed vegetables", "Avocado"],
        calories: 750,
        protein: 52,
        carbs: 65,
        fat: 22,
      },
      dinner: {
        time: "7:00 PM",
        foods: ["Salmon fillet", "Sweet potato", "Green salad", "Olive oil dressing"],
        calories: 680,
        protein: 42,
        carbs: 58,
        fat: 25,
      }
    },
    created_by: 'user-admin',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    player: mockPlayers[0]
  },
  {
    id: 'meal-plan-2',
    player_id: 'player-2',
    title: 'Competition Prep Plan',
    description: 'Optimized for competition performance',
    plan_type: 'competition',
    status: 'active',
    calories: 2800,
    protein: 140,
    carbs: 350,
    fat: 95,
    fiber: 28,
    duration_days: 7,
    start_date: '2024-01-16',
    end_date: '2024-01-23',
    ai_confidence: 91,
    meal_data: {
      breakfast: {
        time: "6:30 AM",
        foods: ["Whole grain toast", "Scrambled eggs", "Spinach", "Orange juice"],
        calories: 450,
        protein: 20,
        carbs: 55,
        fat: 15,
      },
      lunch: {
        time: "12:30 PM",
        foods: ["Turkey sandwich", "Mixed vegetables", "Apple", "Water"],
        calories: 600,
        protein: 35,
        carbs: 70,
        fat: 18,
      },
      dinner: {
        time: "6:30 PM",
        foods: ["Lean beef", "Brown rice", "Broccoli", "Side salad"],
        calories: 650,
        protein: 45,
        carbs: 60,
        fat: 20,
      }
    },
    created_by: 'user-admin',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
    player: mockPlayers[1]
  }
]

export const mockTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'High Protein Base',
    category: 'Strength Training',
    description: 'High protein template for strength athletes',
    calories: 3000,
    protein: 175,
    carbs: 375,
    fat: 100,
    fiber: 30,
    meal_plan: {
      breakfast: {
        time: "7:00 AM",
        foods: ["Protein pancakes", "Greek yogurt", "Berries"],
        calories: 550,
        protein: 30,
        carbs: 60,
        fat: 15,
      },
      lunch: {
        time: "1:00 PM",
        foods: ["Chicken breast", "Rice", "Vegetables"],
        calories: 700,
        protein: 50,
        carbs: 70,
        fat: 20,
      },
      dinner: {
        time: "7:00 PM",
        foods: ["Fish", "Quinoa", "Salad"],
        calories: 600,
        protein: 40,
        carbs: 55,
        fat: 22,
      }
    },
    tags: ['high-protein', 'strength', 'muscle-gain'],
    times_used: 25,
    created_by: 'user-admin',
    organization: 'Test University',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  },
  {
    id: 'template-2',
    name: 'Endurance Base',
    category: 'Endurance Training',
    description: 'Carb-focused template for endurance athletes',
    calories: 2800,
    protein: 130,
    carbs: 400,
    fat: 90,
    fiber: 35,
    meal_plan: {
      breakfast: {
        time: "6:30 AM",
        foods: ["Oatmeal", "Banana", "Honey", "Nuts"],
        calories: 500,
        protein: 15,
        carbs: 80,
        fat: 18,
      },
      lunch: {
        time: "12:30 PM",
        foods: ["Pasta", "Lean meat", "Tomato sauce"],
        calories: 650,
        protein: 35,
        carbs: 90,
        fat: 20,
      },
      dinner: {
        time: "6:30 PM",
        foods: ["Sweet potato", "Chicken", "Green vegetables"],
        calories: 580,
        protein: 40,
        carbs: 65,
        fat: 18,
      }
    },
    tags: ['endurance', 'high-carb', 'sustained-energy'],
    times_used: 18,
    created_by: 'user-admin',
    organization: 'Test University',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z'
  }
]

export const mockStats = {
  total: mockMealPlans.length,
  active: mockMealPlans.filter(p => p.status === 'active').length,
  draft: mockMealPlans.filter(p => p.status === 'draft').length,
  completed: mockMealPlans.filter(p => p.status === 'completed').length,
  archived: mockMealPlans.filter(p => p.status === 'archived').length,
  byPlanType: mockMealPlans.reduce((acc, plan) => {
    acc[plan.plan_type || 'general'] = (acc[plan.plan_type || 'general'] || 0) + 1
    return acc
  }, {} as Record<string, number>),
  avgCalories: Math.round(mockMealPlans.reduce((sum, p) => sum + (p.calories || 0), 0) / mockMealPlans.length),
  avgProtein: Math.round(mockMealPlans.reduce((sum, p) => sum + (p.protein || 0), 0) / mockMealPlans.length)
}