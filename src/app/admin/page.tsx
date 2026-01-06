'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminDashboard from '@/components/admin/EnhancedDashboard';
import EnhancedDashboard from '@/components/admin/EnhancedDashboard';
import EnhancedUsersTable from '@/components/admin/EnhancedUsersTable';
import EnhancedDepositsTable from '@/components/admin/EnhancedDepositsTable';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Shield, BarChart3, Users, CreditCard } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('enhanced');

  return (
    <div className='space-y-6'>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Admin Dashboard</h2>
          <p className='text-muted-foreground'>
            Complete platform management and monitoring
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='space-y-6'
      >
        <TabsList>
          <TabsTrigger value='enhanced' className='flex items-center gap-2'>
            <Shield className='h-4 w-4' />
            Enhanced View
          </TabsTrigger>
          <TabsTrigger value='classic' className='flex items-center gap-2'>
            <BarChart3 className='h-4 w-4' />
            Classic View
          </TabsTrigger>
          <TabsTrigger value='quick-access' className='flex items-center gap-2'>
            <Users className='h-4 w-4' />
            Quick Access
          </TabsTrigger>
        </TabsList>

        <TabsContent value='enhanced' className='space-y-6'>
          <EnhancedDashboard />
        </TabsContent>

        <TabsContent value='classic' className='space-y-6'>
          <AdminDashboard />
        </TabsContent>

        <TabsContent value='quick-access' className='space-y-6'>
          <div className='grid gap-6 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Users className='h-5 w-5' />
                  Recent Users
                </CardTitle>
                <CardDescription>
                  Latest user registrations with enhanced filtering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedUsersTable limit={5} showFilters={false} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <CreditCard className='h-5 w-5' />
                  Pending Deposits
                </CardTitle>
                <CardDescription>
                  Deposits requiring verification and review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedDepositsTable
                  limit={5}
                  showFilters={false}
                  showActions={true}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
