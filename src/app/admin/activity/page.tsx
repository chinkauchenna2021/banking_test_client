'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import EnhancedAdminContainer from '@/components/admin/EnhancedAdminContainer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useEnhancedAdmin } from '@/hooks/useEnhancedAdmin';
import { RefreshCw, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminActivityPage() {
  const {
    userActivities,
    adminActionLogs,
    getUserActivities,
    getAdminActionLogs,
    isLoading
  } = useEnhancedAdmin();
  const [searchQuery, setSearchQuery] = useState('');

  const refresh = useCallback(async () => {
    await Promise.all([
      getUserActivities({ limit: 100 }),
      getAdminActionLogs({ limit: 100 })
    ]);
  }, [getUserActivities, getAdminActionLogs]);

  useEffect(() => {
    refresh().catch((error) => {
      console.error('Failed to load activity logs:', error);
    });
  }, [refresh]);

  const filteredUserActivities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return userActivities.filter((activity) => {
      if (!query) return true;
      return (
        activity.activity_type?.toLowerCase().includes(query) ||
        activity.description?.toLowerCase().includes(query) ||
        activity.user?.email?.toLowerCase().includes(query) ||
        activity.user?.account_number?.toLowerCase().includes(query)
      );
    });
  }, [userActivities, searchQuery]);

  const filteredAdminActions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return adminActionLogs.filter((log) => {
      if (!query) return true;
      return (
        log.action?.toLowerCase().includes(query) ||
        log.description?.toLowerCase().includes(query) ||
        log.admin?.email?.toLowerCase().includes(query)
      );
    });
  }, [adminActionLogs, searchQuery]);

  return (
    <PageContainer
      scrollable
      pageTitle='Activity Log'
      pageDescription='Track user and admin activity across the platform'
    >
      <EnhancedAdminContainer>
        <div className='space-y-6'>
          <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
            <div>
              <h2 className='text-3xl font-bold tracking-tight'>
                Activity Log
              </h2>
              <p className='text-muted-foreground'>
                Recent user events and administrative actions
              </p>
            </div>
            <Button onClick={refresh} variant='outline'>
              <RefreshCw className='mr-2 h-4 w-4' />
              Refresh
            </Button>
          </div>

          <Card>
            <CardContent className='pt-6'>
              <div className='relative flex-1'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                <Input
                  placeholder='Search activities...'
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className='pl-9'
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Activities</CardTitle>
              <CardDescription>
                Transactions, deposits, and transfers performed by users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className='py-8 text-center'>
                        Loading user activities...
                      </TableCell>
                    </TableRow>
                  ) : filteredUserActivities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className='py-8 text-center'>
                        No user activity found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUserActivities.map((activity, index) => (
                      <TableRow
                        key={`${activity.user_id}-${activity.created_at}-${index}`}
                      >
                        <TableCell>
                          <div className='font-medium'>
                            {activity.user?.first_name || 'Unknown'}{' '}
                            {activity.user?.last_name || ''}
                          </div>
                          <div className='text-muted-foreground text-sm'>
                            {activity.user?.email || 'No email'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline' className='capitalize'>
                            {activity.activity_type}
                          </Badge>
                        </TableCell>
                        <TableCell className='max-w-md'>
                          <p className='text-muted-foreground text-sm'>
                            {activity.description}
                          </p>
                        </TableCell>
                        <TableCell className='text-sm'>
                          {activity.ip_address || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {format(new Date(activity.created_at), 'PPp')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Action Logs</CardTitle>
              <CardDescription>
                Administrative actions performed across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className='py-8 text-center'>
                        Loading admin actions...
                      </TableCell>
                    </TableRow>
                  ) : filteredAdminActions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className='py-8 text-center'>
                        No admin actions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAdminActions.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className='font-medium'>
                            {log.admin?.first_name || 'Admin'}{' '}
                            {log.admin?.last_name || ''}
                          </div>
                          <div className='text-muted-foreground text-sm'>
                            {log.admin?.email || 'No email'}
                          </div>
                        </TableCell>
                        <TableCell className='capitalize'>
                          <Badge variant='outline'>
                            {(log.action || '').replace(/_/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.model_type}</TableCell>
                        <TableCell className='max-w-md'>
                          <p className='text-muted-foreground text-sm'>
                            {log.description}
                          </p>
                        </TableCell>
                        <TableCell className='text-sm'>
                          {log.ip_address || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {format(new Date(log.created_at), 'PPp')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </EnhancedAdminContainer>
    </PageContainer>
  );
}
