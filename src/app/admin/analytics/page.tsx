'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
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
import { useAnalytics } from '@/hooks/useAnalytics';
import { RefreshCw, Search, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

const safeNumber = (value: unknown) => {
  const parsed = typeof value === 'string' ? parseFloat(value) : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function AdminAnalyticsPage() {
  const {
    adminDashboard,
    topUsers,
    systemHealth,
    realtimeMetrics,
    predictiveAnalytics,
    isLoading,
    error,
    getAdminDashboard,
    getTopUsersByBalance,
    getSystemHealth,
    getRealTimeMetrics,
    getPredictiveAnalytics,
    formatCurrency,
    formatNumber
  } = useAnalytics();

  const [searchQuery, setSearchQuery] = useState('');

  const refreshAnalytics = useCallback(async () => {
    await Promise.all([
      getAdminDashboard(),
      getTopUsersByBalance(10),
      getSystemHealth(),
      getRealTimeMetrics(),
      getPredictiveAnalytics()
    ]);
  }, [
    getAdminDashboard,
    getTopUsersByBalance,
    getSystemHealth,
    getRealTimeMetrics,
    getPredictiveAnalytics
  ]);

  useEffect(() => {
    refreshAnalytics().catch((err) => {
      console.error('Failed to load analytics:', err);
    });
  }, [refreshAnalytics]);

  const summary = adminDashboard?.summary;
  const periodLabel = adminDashboard?.period
    ? `${format(new Date(adminDashboard.period.startDate), 'MMM d, yyyy')} - ${format(
        new Date(adminDashboard.period.endDate),
        'MMM d, yyyy'
      )}`
    : 'Current month';

  const filteredTopUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return topUsers;
    return topUsers.filter((user: any) => {
      return (
        user.email?.toLowerCase().includes(query) ||
        user.account_number?.toLowerCase().includes(query) ||
        `${user.first_name || ''} ${user.last_name || ''}`
          .toLowerCase()
          .includes(query)
      );
    });
  }, [topUsers, searchQuery]);

  const topTransactions = adminDashboard?.transactions?.topTransactions || [];
  const riskAlerts = adminDashboard?.risk?.highRiskTransactions || [];

  const realtime = realtimeMetrics?.metrics;
  const health = systemHealth;

  return (
    <PageContainer
      scrollable
      pageTitle='Admin Analytics'
      pageDescription='Platform-wide analytics and operational insights'
    >
      <div className='space-y-6'>
        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>
              Admin Analytics
            </h2>
            <p className='text-muted-foreground'>
              Reporting period: {periodLabel}
            </p>
          </div>
          <Button onClick={refreshAnalytics} variant='outline'>
            <RefreshCw className='mr-2 h-4 w-4' />
            Refresh
          </Button>
        </div>

        {error && (
          <Card className='border-red-200 bg-red-50'>
            <CardContent className='pt-6 text-sm text-red-700'>
              {error}
            </CardContent>
          </Card>
        )}

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {summary?.totalUsers ?? 0}
              </div>
              <p className='text-muted-foreground text-xs'>
                Active: {summary?.activeUsers ?? 0}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatCurrency(safeNumber(summary?.totalBalance), 'USD')}
              </div>
              <p className='text-muted-foreground text-xs'>
                Revenue:{' '}
                {formatCurrency(safeNumber(summary?.totalRevenue), 'USD')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {summary?.totalTransactions ?? 0}
              </div>
              <p className='text-muted-foreground text-xs'>
                Transfers: {summary?.totalTransfers ?? 0}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {summary?.totalDeposits ?? 0}
              </div>
              <p className='text-muted-foreground text-xs'>
                Loans: {summary?.totalLoans ?? 0}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>System Health Snapshot</CardTitle>
              <CardDescription>Live operational metrics</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3 text-sm'>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Transactions (1h)</span>
                <span className='font-medium'>
                  {health?.transactionsLastHour ?? 0}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Deposits (1h)</span>
                <span className='font-medium'>
                  {health?.depositsLastHour ?? 0}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Active Sessions</span>
                <span className='font-medium'>
                  {health?.activeSessions ?? 0}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Avg Response</span>
                <span className='font-medium'>
                  {health?.avgResponseTime
                    ? `${health.avgResponseTime}ms`
                    : 'N/A'}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Uptime</span>
                <span className='font-medium'>
                  {health?.uptime ? `${health.uptime}%` : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Realtime Activity</CardTitle>
              <CardDescription>Last hour system activity</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3 text-sm'>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Transactions</span>
                <span className='font-medium'>
                  {realtime?.transactionsLastHour ?? 0}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Deposits</span>
                <span className='font-medium'>
                  {realtime?.depositsLastHour ?? 0}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>New Users</span>
                <span className='font-medium'>
                  {realtime?.newUsersLastHour ?? 0}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Active Users</span>
                <span className='font-medium'>
                  {realtime?.activeUsersNow ?? 0}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>System Load</span>
                <span className='font-medium'>
                  {realtime?.systemLoad
                    ? `${formatNumber(realtime.systemLoad)}%`
                    : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
              <div>
                <CardTitle>Top Users by Balance</CardTitle>
                <CardDescription>
                  Highest balances in the system
                </CardDescription>
              </div>
              <div className='relative w-full max-w-xs'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                <Input
                  placeholder='Search users...'
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className='pl-9'
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className='py-8 text-center'>
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredTopUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className='py-8 text-center'>
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTopUsers.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className='font-medium'>
                          {user.first_name} {user.last_name}
                        </div>
                        <div className='text-muted-foreground text-sm'>
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell className='text-sm'>
                        {user.account_number || '-'}
                      </TableCell>
                      <TableCell className='font-semibold'>
                        {formatCurrency(
                          safeNumber(user.balance),
                          user.currency || 'USD'
                        )}
                      </TableCell>
                      <TableCell className='text-muted-foreground text-sm'>
                        {user.created_at
                          ? format(new Date(user.created_at), 'MMM d, yyyy')
                          : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className='grid gap-4 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Top Transactions</CardTitle>
              <CardDescription>
                Highest value completed transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className='text-right'>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className='py-8 text-center'>
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    topTransactions.map((tx: any) => (
                      <TableRow key={tx.id}>
                        <TableCell className='capitalize'>{tx.type}</TableCell>
                        <TableCell className='text-muted-foreground text-sm'>
                          {tx.description || 'N/A'}
                        </TableCell>
                        <TableCell className='text-right font-semibold'>
                          {formatCurrency(safeNumber(tx.amount), 'USD')}
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
              <CardTitle>Risk Alerts</CardTitle>
              <CardDescription>
                High-risk transactions requiring review
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {riskAlerts.length === 0 ? (
                <div className='text-muted-foreground text-sm'>
                  No high-risk transactions detected.
                </div>
              ) : (
                riskAlerts.map((alert: any) => (
                  <div
                    key={alert.id}
                    className='flex items-center justify-between rounded-md border p-3'
                  >
                    <div>
                      <div className='flex items-center gap-2'>
                        <ShieldAlert className='h-4 w-4 text-red-500' />
                        <span className='font-medium capitalize'>
                          {alert.type}
                        </span>
                      </div>
                      <p className='text-muted-foreground text-sm'>
                        {alert.reason}
                      </p>
                    </div>
                    <Badge variant='destructive'>
                      {formatCurrency(safeNumber(alert.amount), 'USD')}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Predictive Insights</CardTitle>
            <CardDescription>
              Forecasted trends and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2 text-sm'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>
                    Next month transactions
                  </span>
                  <span className='font-medium'>
                    {predictiveAnalytics?.predictedTransactionsNextMonth ?? 0}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>
                    Predicted revenue
                  </span>
                  <span className='font-medium'>
                    {formatCurrency(
                      safeNumber(
                        predictiveAnalytics?.predictedRevenueNextMonth
                      ),
                      'USD'
                    )}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>New users</span>
                  <span className='font-medium'>
                    {predictiveAnalytics?.predictedNewUsersNextMonth ?? 0}
                  </span>
                </div>
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-medium'>Recommendations</p>
                {predictiveAnalytics?.recommendations?.length ? (
                  <ul className='text-muted-foreground space-y-2 text-sm'>
                    {predictiveAnalytics.recommendations.map(
                      (rec: string, index: number) => (
                        <li key={`${rec}-${index}`}>{rec}</li>
                      )
                    )}
                  </ul>
                ) : (
                  <div className='text-muted-foreground text-sm'>
                    No recommendations available.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
