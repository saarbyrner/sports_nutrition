import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export default function PlayerProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-32" /> {/* Back button */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24" /> {/* ID badge */}
          <Skeleton className="h-8 w-20" /> {/* Refresh button */}
        </div>
      </div>

      {/* Player Info Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col md:flex-row gap-6 flex-1">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" /> {/* Avatar */}
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" /> {/* Name */}
                  <Skeleton className="h-4 w-32" /> {/* Position • Team */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" /> {/* Status badge */}
                  </div>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="text-center space-y-1">
                  <Skeleton className="h-3 w-8 mx-auto" /> {/* Label */}
                  <Skeleton className="h-5 w-10 mx-auto" /> {/* Value */}
                </div>
                <div className="text-center space-y-1">
                  <Skeleton className="h-3 w-12 mx-auto" /> {/* Label */}
                  <Skeleton className="h-5 w-12 mx-auto" /> {/* Value */}
                </div>
                <div className="text-center space-y-1">
                  <Skeleton className="h-3 w-16 mx-auto" /> {/* Label */}
                  <Skeleton className="h-5 w-14 mx-auto" /> {/* Value */}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-10 w-28" /> {/* Edit Profile button */}
              <Skeleton className="h-10 w-24" /> {/* Message button */}
              <Skeleton className="h-10 w-20" /> {/* AI Plan button */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Overview Tab Skeleton */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Current Plan Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-28" /> {/* Title */}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" /> {/* Plan name */}
                  <Skeleton className="h-3 w-32" /> {/* Date range */}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Targets Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-2 w-24" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Progress Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-36" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-6 w-6" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-20 mt-1" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="text-center space-y-1">
                      <Skeleton className="h-3 w-16 mx-auto" />
                      <Skeleton className="h-5 w-12 mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Other tabs can be added as needed */}
      </Tabs>
    </div>
  );
}