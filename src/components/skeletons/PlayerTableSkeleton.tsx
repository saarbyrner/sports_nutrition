import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface PlayerTableSkeletonProps {
  rows?: number;
}

export default function PlayerTableSkeleton({ rows = 5 }: PlayerTableSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" /> {/* "Players (X)" title */}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jersey #</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rows }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" /> {/* Name */}
                        <Skeleton className="h-3 w-40" /> {/* Email */}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" /> {/* Position */}
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" /> {/* Team */}
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" /> {/* Sport */}
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" /> {/* Status badge */}
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" /> {/* Jersey number */}
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" /> {/* Created date */}
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 rounded" /> {/* Actions button */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}