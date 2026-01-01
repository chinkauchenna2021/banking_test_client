'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdmin } from '@/hooks/useAdmin';
import { 
  Activity, 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  History,
  Search
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function SystemHealthPage() {
  const { 
    auditLogs, 
    getAuditLogs, 
    getSystemHealth, 
    clearError 
  } = useAdmin();

  const [systemMetrics, setSystemMetrics] = useState({
    status: 'operational', // operational, degraded, down
    uptime: '99.9%',
    cpu: 24,
    memory: 45,
    disk: 62,
    latency: '24ms'
  });
  
  const [filterAction, setFilterAction] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    setIsLoading(true);
    try {
      // In a real app, getSystemHealth() returns the metrics object
      const healthData = await getSystemHealth();
      // For this UI demo, we use mock state, but in prod:
      // setSystemMetrics(healthData); 
      
      await getAuditLogs();
    } catch (error) {
      console.error("Failed to load system health", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'down': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle2 className="h-4 w-4" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4" />;
      case 'down': return <XCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const filteredLogs = auditLogs.filter(log => 
    filterAction === 'all' || log.action === filterAction
  );

  return (
    <PageContainer
      scrollable
      pageTitle="System Health"
      pageDescription="Monitor platform performance and audit trails"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Platform Status</h2>
            <p className="text-muted-foreground">Real-time monitoring of system resources</p>
          </div>
          <Button onClick={loadSystemData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Status Banner */}
        <Card className={`border-l-4 ${
          systemMetrics.status === 'operational' ? 'border-l-green-500' : 'border-l-red-500'
        }`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  systemMetrics.status === 'operational' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {getStatusIcon(systemMetrics.status)}
                </div>
                <div>
                  <h3 className="text-xl font-bold capitalize">{systemMetrics.status}</h3>
                  <p className="text-muted-foreground">
                    All systems are functioning normally. Uptime: {systemMetrics.uptime}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(systemMetrics.status)}>
                Last checked: Just now
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemMetrics.cpu}%</div>
              <Progress value={systemMetrics.cpu} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemMetrics.memory}%</div>
              <Progress value={systemMetrics.memory} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemMetrics.disk}%</div>
              <Progress value={systemMetrics.disk} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Database & API */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Database Status</CardTitle>
              <CardDescription>Primary PostgreSQL Cluster</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Latency</span>
                <span className="font-medium">12ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Connections</span>
                <span className="font-medium">45/100</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Replication Lag</span>
                <span className="font-medium text-green-600">0ms</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Gateway</CardTitle>
              <CardDescription>Request processing stats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Response Time</span>
                <span className="font-medium">{systemMetrics.latency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Requests/Sec</span>
                <span className="font-medium">1,240</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Error Rate</span>
                <span className="font-medium text-green-600">0.01%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Logs */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>Recent administrative actions</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="user_update">User Updates</SelectItem>
                    <SelectItem value="deposit_approve">Deposit Approvals</SelectItem>
                    <SelectItem value="system_config">System Config</SelectItem>
                    <SelectItem value="login">Logins</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">Loading audit logs...</TableCell>
                  </TableRow>
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">No logs found</TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.admin_name || 'System'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {log.action.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.target_id || '-'}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {log.ip_address}
                      </TableCell>
                      <TableCell>
                        <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                          {log.status}
                        </Badge>
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