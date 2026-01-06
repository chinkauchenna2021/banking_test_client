'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress-with-variant'; // Updated import
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Users,
  DollarSign,
  Activity,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Shield,
  BarChart3,
  AlertCircle,
  History,
  Coins,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useEnhancedAdmin, EnhancedUser } from '@/hooks/useEnhancedAdmin';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EnhancedDashboard() {
  const {
    enhancedUserStats,
    enhancedDepositStats,
    cryptoAccountStats,
    systemAlertStats,
    adminActionStats,
    criticalAlerts,
    depositsRequiringVerification,
    topUsers,
    recentUserActivities,
    recentAdminActions,
    refreshEnhancedData,
    isLoading
  } = useEnhancedAdmin();

  const router = useRouter();
  const [timeRange, setTimeRange] = useState('today');

  useEffect(() => {
    refreshEnhancedData();
  }, [refreshEnhancedData]);

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />
          <p className='text-muted-foreground mt-4 text-sm'>
            Loading enhanced dashboard...
          </p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Users',
      value: enhancedUserStats?.total || 0,
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Balance',
      value: `$${(enhancedUserStats?.totalBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+8.2%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Pending Verification',
      value: depositsRequiringVerification?.length || 0,
      change: 'Requires action',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      action: () => router.push('/admin/deposits?filter=pending')
    },
    {
      title: 'Critical Alerts',
      value: criticalAlerts?.length || 0,
      change: 'Needs attention',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      action: () => router.push('/admin/alerts?filter=critical')
    }
  ];

  // Fix for topUsers typing
  const safeTopUsers = ((topUsers as EnhancedUser[]) || []).map((user) => ({
    ...user,
    balance: user.balance || '0',
    risk_level: user.risk_level || 'unknown',
    account_type: user.account_type || 'unknown',
    account_status: user.account_status || 'unknown',
    email: user.email || '',
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    id: user.id || ''
  }));

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>
            Enhanced Dashboard
          </h2>
          <p className='text-muted-foreground'>
            Comprehensive overview with advanced analytics and monitoring
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button onClick={refreshEnhancedData} variant='outline' size='sm'>
            <RefreshCw className='mr-2 h-4 w-4' />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all hover:shadow-md ${stat.action ? 'hover:border-primary' : ''}`}
            onClick={stat.action}
          >
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor} ${stat.color}`}>
                <stat.icon className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stat.value}</div>
              <div
                className={`text-xs ${stat.change.includes('+') ? 'text-green-600' : 'text-yellow-600'} mt-1 flex items-center`}
              >
                <TrendingUp className='mr-1 h-3 w-3' />
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics Grid */}
      <div className='grid gap-6 md:grid-cols-3'>
        {/* User Risk Distribution */}
        <Card className='col-span-1'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5' />
              Risk Distribution
            </CardTitle>
            <CardDescription>Users categorized by risk level</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {Object.entries(enhancedUserStats?.riskLevels || {}).map(
              ([level, count]) => (
                <div key={level} className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='capitalize'>{level}</span>
                    <span className='font-medium'>{count} users</span>
                  </div>
                  <Progress
                    value={(count / (enhancedUserStats?.total || 1)) * 100}
                    className='h-2'
                    variant={
                      level === 'high'
                        ? 'destructive'
                        : level === 'medium'
                          ? 'default'
                          : 'secondary'
                    }
                  />
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Deposit Statistics */}
        <Card className='col-span-1'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <BarChart3 className='h-5 w-5' />
              Deposit Analytics
            </CardTitle>
            <CardDescription>Enhanced deposit insights</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <p className='text-muted-foreground text-sm'>Total Amount</p>
                <p className='text-2xl font-bold'>
                  $
                  {(enhancedDepositStats?.totalAmount || 0).toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2 }
                  )}
                </p>
              </div>
              <div className='space-y-1'>
                <p className='text-muted-foreground text-sm'>Crypto Deposits</p>
                <p className='text-2xl font-bold text-green-600'>
                  {enhancedDepositStats?.cryptoDeposits || 0}
                </p>
              </div>
            </div>
            <div className='space-y-2 border-t pt-4'>
              {Object.entries(enhancedDepositStats?.byStatus || {}).map(
                ([status, count]) => (
                  <div key={status} className='flex justify-between text-sm'>
                    <span className='capitalize'>{status}</span>
                    <span className='font-medium'>{count}</span>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Crypto Accounts */}
        <Card className='col-span-1'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Coins className='h-5 w-5' />
              Crypto Accounts
            </CardTitle>
            <CardDescription>Cryptocurrency account statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='rounded-lg bg-blue-50 p-3 text-center'>
                  <p className='text-muted-foreground text-sm'>
                    Total Accounts
                  </p>
                  <p className='text-2xl font-bold'>
                    {cryptoAccountStats?.total || 0}
                  </p>
                </div>
                <div className='rounded-lg bg-green-50 p-3 text-center'>
                  <p className='text-muted-foreground text-sm'>Verified</p>
                  <p className='text-2xl font-bold'>
                    {cryptoAccountStats?.verified || 0}
                  </p>
                </div>
              </div>
              <div className='border-t pt-4'>
                <p className='mb-2 text-sm font-medium'>Network Distribution</p>
                <div className='space-y-2'>
                  {Object.entries(cryptoAccountStats?.byNetwork || {})
                    .slice(0, 3)
                    .map(([network, count]) => (
                      <div
                        key={network}
                        className='flex justify-between text-sm'
                      >
                        <span>{network}</span>
                        <span className='font-medium'>{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Users by Balance */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Top Users by Balance</CardTitle>
              <CardDescription>
                Highest account balances in the system
              </CardDescription>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.push('/admin/users?sort=balance')}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeTopUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className='font-medium'>
                      {user.first_name} {user.last_name}
                    </div>
                    <div className='text-muted-foreground text-sm'>
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline' className='capitalize'>
                      {user.account_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.risk_level === 'high'
                          ? 'destructive'
                          : user.risk_level === 'medium'
                            ? 'default'
                            : 'secondary'
                      }
                      className='capitalize'
                    >
                      {user.risk_level}
                    </Badge>
                  </TableCell>
                  <TableCell className='font-semibold'>
                    $
                    {parseFloat(user.balance).toLocaleString(undefined, {
                      minimumFractionDigits: 2
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.account_status === 'active'
                          ? 'default'
                          : user.account_status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {user.account_status}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                    >
                      <Eye className='h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Activities & Admin Actions */}
      <div className='grid gap-6 md:grid-cols-2'>
        {/* Recent User Activities */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <History className='h-5 w-5' />
              Recent User Activities
            </CardTitle>
            <CardDescription>Latest actions from users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {(recentUserActivities || []).slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className='flex items-center justify-between rounded-lg border p-3'
                >
                  <div>
                    <p className='font-medium'>
                      {activity.activity_type || activity.activity_type}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      User ID: {activity.user_id}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-muted-foreground text-xs'>
                      {format(new Date(activity.created_at), 'HH:mm')}
                    </p>
                    <Badge variant='outline' className='text-xs'>
                      {activity.activity_type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Activity className='h-5 w-5' />
              Admin Action Log
            </CardTitle>
            <CardDescription>Recent administrative activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {(recentAdminActions || []).slice(0, 5).map((action) => (
                <div
                  key={action.id}
                  className='flex items-center justify-between rounded-lg border p-3'
                >
                  <div>
                    <p className='font-medium capitalize'>
                      {(action.action || '').replace(/_/g, ' ')}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      By:{' '}
                      {action.admin?.first_name ||
                        action.admin?.last_name ||
                        'System'}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-muted-foreground text-xs'>
                      {format(new Date(action.created_at), 'HH:mm')}
                    </p>
                    <Badge variant='outline' className='text-xs'>
                      {action.ip_address
                        ? action.ip_address.split('.').slice(0, 2).join('.') +
                          '...'
                        : 'N/A'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle>System Health Summary</CardTitle>
          <CardDescription>
            Comprehensive system monitoring overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-4'>
            <div className='space-y-2 rounded-lg bg-slate-50 p-4 text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {(systemAlertStats?.total || 0) -
                  (systemAlertStats?.unresolved || 0)}
              </div>
              <p className='text-muted-foreground text-sm'>Resolved Alerts</p>
            </div>
            <div className='space-y-2 rounded-lg bg-slate-50 p-4 text-center'>
              <div className='text-2xl font-bold text-yellow-600'>
                {systemAlertStats?.unresolved || 0}
              </div>
              <p className='text-muted-foreground text-sm'>Unresolved Alerts</p>
            </div>
            <div className='space-y-2 rounded-lg bg-slate-50 p-4 text-center'>
              <div className='text-2xl font-bold text-red-600'>
                {systemAlertStats?.critical || 0}
              </div>
              <p className='text-muted-foreground text-sm'>Critical Alerts</p>
            </div>
            <div className='space-y-2 rounded-lg bg-slate-50 p-4 text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {adminActionStats?.today || 0}
              </div>
              <p className='text-muted-foreground text-sm'>Actions Today</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
