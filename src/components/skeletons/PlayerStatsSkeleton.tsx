import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export default function PlayerStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Players Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-20" /> {/* Title */}
          <Skeleton className="h-4 w-4" /> {/* Icon */}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-12" /> {/* Number */}
        </CardContent>
      </Card>

      {/* Active Players Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" /> {/* Title */}
          <Skeleton className="h-2 w-2 rounded-full" /> {/* Status dot */}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-12" /> {/* Number */}
        </CardContent>
      </Card>

      {/* Injured Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-16" /> {/* Title */}
          <Skeleton className="h-2 w-2 rounded-full" /> {/* Status dot */}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-12" /> {/* Number */}
        </CardContent>
      </Card>

      {/* Teams Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-16" /> {/* Title */}
          <Skeleton className="h-2 w-2 rounded-full" /> {/* Status dot */}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-12" /> {/* Number */}
        </CardContent>
      </Card>
    </div>
  );
}