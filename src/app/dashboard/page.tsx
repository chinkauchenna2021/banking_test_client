// app/dashboard/page.tsx
'use client';

import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  History,
  Send,
  Download,
  Shield,
  Bell,
  BarChart3,
  Users,
  Building
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useAccount } from '@/hooks/useAccount';
import { useTransaction } from '@/hooks/useTransaction';
import { useEffect, useState } from 'react';
import { AreaGraph } from '../../features/overview/components/area-graph';
import { BarGraph } from '../../features/overview/components/bar-graph';
import { PieGraph } from '../../features/overview/components/pie-graph';
import { RecentTransactions } from '../../components/dashboard/components/recent-transactions';
import QuickTransferModal from '@/components/modals/QuickTransferModal';
import DepositModal from '@/components/modals/DepositModal';
 
export default function DashboardPage() {
  const { user, dashboard, getDashboard, formatCurrency } = useUser();
  const { accounts, totalBalance, getAccounts } = useAccount();
  const { getRecentTransactions } = useTransaction();
  
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    daily: { count: 0, amount: 0 },
    monthly: { count: 0, amount: 0 },
    yearly: { count: 0, amount: 0 }
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        getDashboard(),
        getAccounts(),
        getRecentTransactions()
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const accountStats = {
    total: accounts.length,
    active: accounts.filter(a => a.status === 'active').length,
    checking: accounts.filter(a => a.account_type === 'checking').length,
    savings: accounts.filter(a => a.account_type === 'savings').length
  };

  const spendingData = [
    { category: 'Shopping', amount: 1250, percentage: 40 },
    { category: 'Bills', amount: 850, percentage: 27 },
    { category: 'Entertainment', amount: 450, percentage: 14 },
    { category: 'Food', amount: 320, percentage: 10 },
    { category: 'Other', amount: 280, percentage: 9 }
  ];

  return (
    <PageContainer
      scrollable
      isloading={isLoading}
      pageTitle="Dashboard"
      pageDescription="Welcome to your banking dashboard"
    >
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.first_name}!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your accounts today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowTransferModal(true)}>
              <Send className="h-4 w-4 mr-2" />
              Send Money
            </Button>
            <Button onClick={() => setShowDepositModal(true)}>
              <ArrowDownRight className="h-4 w-4 mr-2" />
              Deposit
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2.5%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Accounts
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accountStats.active}</div>
              <p className="text-xs text-muted-foreground">
                {accountStats.checking} checking, {accountStats.savings} savings
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Transactions
              </CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthly.count}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(stats.monthly.amount)} total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Security Status
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                All systems secure
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
              <CardDescription>
                Transaction volume over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AreaGraph />
            </CardContent>
          </Card>
          
          <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle>Spending Breakdown</CardTitle>
              <CardDescription>Monthly spending by category</CardDescription>
            </CardHeader>
            <CardContent>
              <PieGraph />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest account activity</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
          </Card>
          
          <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used banking features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Card Management
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Statements
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Set Alerts
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Spending Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Spending Analysis</CardTitle>
            <CardDescription>Breakdown of your monthly expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {spendingData.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-sm font-semibold">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{item.percentage}% of total</span>
                    <span>{formatCurrency(item.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <QuickTransferModal 
        open={showTransferModal}
        onOpenChange={setShowTransferModal}
        accounts={accounts}
      />
      
      <DepositModal 
        open={showDepositModal}
        onOpenChange={setShowDepositModal}
        accounts={accounts}
      />
    </PageContainer>
  );
}