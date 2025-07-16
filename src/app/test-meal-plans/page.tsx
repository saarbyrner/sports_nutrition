'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useResilientMealPlanService } from '@/hooks/useResilientMealPlanService'
import { Database, TestTube, RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export default function TestMealPlansPage() {
  const [testResults, setTestResults] = useState<Array<{
    name: string
    status: 'pending' | 'success' | 'error' | 'warning'
    message: string
    details?: any
  }>>([])

  const {
    loading,
    error,
    usingMockData,
    getMealPlans,
    getMealPlanStats,
    getTemplates,
    createMealPlan,
    deleteMealPlan,
    resetToDatabase,
    forceMockMode
  } = useResilientMealPlanService()

  const runTests = async () => {
    const results: typeof testResults = []
    
    // Test 1: Check database connectivity
    results.push({
      name: 'Database Connectivity',
      status: 'pending',
      message: 'Testing database connection...'
    })

    resetToDatabase()
    
    try {
      await getMealPlans({ pagination: { limit: 1 } })
      if (usingMockData) {
        results[0] = {
          name: 'Database Connectivity',
          status: 'warning',
          message: 'Database connection failed, using mock data',
          details: { usingMockData: true }
        }
      } else {
        results[0] = {
          name: 'Database Connectivity',
          status: 'success',
          message: 'Database connection successful'
        }
      }
    } catch (err) {
      results[0] = {
        name: 'Database Connectivity',
        status: 'error',
        message: 'Database connection failed',
        details: { error: err }
      }
    }

    setTestResults([...results])

    // Test 2: Get meal plans
    results.push({
      name: 'Get Meal Plans',
      status: 'pending',
      message: 'Fetching meal plans...'
    })
    setTestResults([...results])

    try {
      const plansResult = await getMealPlans()
      if (plansResult?.data) {
        results[1] = {
          name: 'Get Meal Plans',
          status: 'success',
          message: `Found ${plansResult.data.length} meal plans`,
          details: { count: plansResult.data.length, usingMockData }
        }
      } else {
        results[1] = {
          name: 'Get Meal Plans',
          status: 'error',
          message: 'Failed to get meal plans'
        }
      }
    } catch (err) {
      results[1] = {
        name: 'Get Meal Plans',
        status: 'error',
        message: 'Error getting meal plans',
        details: { error: err }
      }
    }

    setTestResults([...results])

    // Test 3: Get statistics
    results.push({
      name: 'Get Statistics',
      status: 'pending',
      message: 'Fetching statistics...'
    })
    setTestResults([...results])

    try {
      const stats = await getMealPlanStats()
      if (stats) {
        results[2] = {
          name: 'Get Statistics',
          status: 'success',
          message: `Statistics loaded: ${stats.total} total plans`,
          details: { stats, usingMockData }
        }
      } else {
        results[2] = {
          name: 'Get Statistics',
          status: 'error',
          message: 'Failed to get statistics'
        }
      }
    } catch (err) {
      results[2] = {
        name: 'Get Statistics',
        status: 'error',
        message: 'Error getting statistics',
        details: { error: err }
      }
    }

    setTestResults([...results])

    // Test 4: Get templates
    results.push({
      name: 'Get Templates',
      status: 'pending',
      message: 'Fetching templates...'
    })
    setTestResults([...results])

    try {
      const templatesResult = await getTemplates()
      if (templatesResult?.data) {
        results[3] = {
          name: 'Get Templates',
          status: 'success',
          message: `Found ${templatesResult.data.length} templates`,
          details: { count: templatesResult.data.length, usingMockData }
        }
      } else {
        results[3] = {
          name: 'Get Templates',
          status: 'error',
          message: 'Failed to get templates'
        }
      }
    } catch (err) {
      results[3] = {
        name: 'Get Templates',
        status: 'error',
        message: 'Error getting templates',
        details: { error: err }
      }
    }

    setTestResults([...results])

    // Test 5: Test mock mode
    results.push({
      name: 'Mock Mode Test',
      status: 'pending',
      message: 'Testing mock mode...'
    })
    setTestResults([...results])

    try {
      forceMockMode()
      const mockPlansResult = await getMealPlans()
      if (mockPlansResult?.data && usingMockData) {
        results[4] = {
          name: 'Mock Mode Test',
          status: 'success',
          message: `Mock mode working: ${mockPlansResult.data.length} mock plans`,
          details: { count: mockPlansResult.data.length, usingMockData: true }
        }
      } else {
        results[4] = {
          name: 'Mock Mode Test',
          status: 'error',
          message: 'Mock mode failed'
        }
      }
    } catch (err) {
      results[4] = {
        name: 'Mock Mode Test',
        status: 'error',
        message: 'Error in mock mode',
        details: { error: err }
      }
    }

    setTestResults([...results])

    // Test 6: Create meal plan test
    results.push({
      name: 'Create Meal Plan',
      status: 'pending',
      message: 'Testing meal plan creation...'
    })
    setTestResults([...results])

    try {
      const newPlan = await createMealPlan({
        player_id: 'test-player-id',
        title: 'Test Meal Plan',
        description: 'Created during testing',
        plan_type: 'training',
        calories: 2500,
        protein: 150,
        carbs: 300,
        fat: 80,
        meal_data: {
          breakfast: {
            time: '8:00 AM',
            foods: ['Test food'],
            calories: 500,
            protein: 30,
            carbs: 60,
            fat: 15
          }
        }
      })

      if (newPlan) {
        results[5] = {
          name: 'Create Meal Plan',
          status: 'success',
          message: `Created test meal plan: ${newPlan.id}`,
          details: { planId: newPlan.id, usingMockData }
        }
      } else {
        results[5] = {
          name: 'Create Meal Plan',
          status: 'error',
          message: 'Failed to create meal plan'
        }
      }
    } catch (err) {
      results[5] = {
        name: 'Create Meal Plan',
        status: 'error',
        message: 'Error creating meal plan',
        details: { error: err }
      }
    }

    setTestResults([...results])
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'pending': return <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
      default: return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return 'default'
      case 'error': return 'destructive'
      case 'warning': return 'secondary'
      case 'pending': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meal Plan Service Testing</h1>
          <p className="text-muted-foreground">
            Comprehensive testing for database connectivity and fallback systems
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={usingMockData ? "destructive" : "default"} className="flex items-center gap-1">
            {usingMockData ? <TestTube className="h-3 w-3" /> : <Database className="h-3 w-3" />}
            {usingMockData ? 'Mock Mode' : 'Database Mode'}
          </Badge>
          <Button onClick={runTests} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Run Tests
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <XCircle className="h-4 w-4" />
              <span className="font-medium">Service Error:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {testResults.map((result, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  {result.name}
                </CardTitle>
                <Badge variant={getStatusBadge(result.status)}>
                  {result.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{result.message}</p>
              {result.details && (
                <details className="mt-2">
                  <summary className="text-xs text-muted-foreground cursor-pointer">
                    View Details
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {testResults.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <TestTube className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Click "Run Tests" to start testing the meal plan services</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}