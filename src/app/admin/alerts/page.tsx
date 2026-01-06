'use client';

import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useEnhancedAdmin } from '../../../hooks/useEnhancedAdmin';
import {
  Search,
  AlertTriangle,
  AlertCircle,
  Bell,
  CheckCircle,
  Filter,
  RefreshCw,
  Eye,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

export default function EnhancedAlertsPage() {
  const {
    systemAlerts,
    systemAlertStats,
    criticalAlerts,
    refreshEnhancedData,
    isLoading
  } = useEnhancedAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  const filteredAlerts = systemAlerts.filter((alert) => {
    const matchesSearch =
      searchQuery === '' ||
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    const matchesLevel = levelFilter === 'all' || alert.level === levelFilter;

    return matchesSearch && matchesType && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertCircle className='h-4 w-4' />;
      case 'high':
        return <AlertTriangle className='h-4 w-4' />;
      default:
        return <Bell className='h-4 w-4' />;
    }
  };

  return (
    <PageContainer
      scrollable
      pageTitle='System Alerts & Monitoring'
      pageDescription='Real-time system monitoring and alert management'
    >
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>System Alerts</h2>
            <p className='text-muted-foreground'>
              Monitor and manage system alerts and notifications
            </p>
          </div>
          <Button onClick={refreshEnhancedData} variant='outline'>
            <RefreshCw className='mr-2 h-4 w-4' />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className='grid gap-4 md:grid-cols-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{systemAlertStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-red-600'>
                {systemAlertStats.critical}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Unresolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-yellow-600'>
                {systemAlertStats.unresolved}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>
                {systemAlertStats.total - systemAlertStats.unresolved}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts Banner */}
        {criticalAlerts.length > 0 && (
          <Card className='border-red-300 bg-red-50 dark:bg-red-950/20'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-red-700 dark:text-red-400'>
                <AlertCircle className='h-5 w-5' />
                Critical Alerts Requiring Immediate Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {criticalAlerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className='flex items-center justify-between rounded-lg bg-red-100 p-3 dark:bg-red-900/30'
                  >
                    <div>
                      <p className='font-medium'>{alert.title}</p>
                      <p className='text-sm text-red-700 dark:text-red-300'>
                        {alert.message}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4 text-red-500' />
                      <span className='text-sm'>
                        {format(new Date(alert.created_at), 'MMM d, HH:mm')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-col gap-4 sm:flex-row'>
              <div className='relative flex-1'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                <Input
                  placeholder='Search alerts...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-9'
                />
              </div>
              <div className='flex gap-2'>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className='w-[150px]'>
                    <SelectValue placeholder='Type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Types</SelectItem>
                    <SelectItem value='security'>Security</SelectItem>
                    <SelectItem value='performance'>Performance</SelectItem>
                    <SelectItem value='transaction'>Transaction</SelectItem>
                    <SelectItem value='system'>System</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className='w-[150px]'>
                    <SelectValue placeholder='Level' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Levels</SelectItem>
                    <SelectItem value='critical'>Critical</SelectItem>
                    <SelectItem value='high'>High</SelectItem>
                    <SelectItem value='medium'>Medium</SelectItem>
                    <SelectItem value='low'>Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Log</CardTitle>
            <CardDescription>
              All system alerts and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className='py-8 text-center'>
                      Loading alerts...
                    </TableCell>
                  </TableRow>
                ) : filteredAlerts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className='py-8 text-center'>
                      No alerts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAlerts.map((alert) => (
                    <TableRow
                      key={alert.id}
                      className={alert.resolved ? 'opacity-60' : ''}
                    >
                      <TableCell>
                        <Badge
                          className={`flex items-center gap-1 capitalize ${getLevelColor(alert.level)}`}
                        >
                          {getLevelIcon(alert.level)}
                          {alert.level}
                        </Badge>
                      </TableCell>
                      <TableCell className='font-medium'>
                        {alert.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline' className='capitalize'>
                          {alert.type}
                        </Badge>
                      </TableCell>
                      <TableCell className='max-w-xs'>
                        <p className='text-muted-foreground truncate text-sm'>
                          {alert.message}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className='text-sm'>
                          {format(new Date(alert.created_at), 'MMM d, HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {alert.resolved ? (
                          <Badge variant='outline' className='text-green-600'>
                            <CheckCircle className='mr-1 h-3 w-3' />
                            Resolved
                          </Badge>
                        ) : (
                          <Badge variant='outline' className='text-yellow-600'>
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant='ghost' size='sm'>
                          <Eye className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
