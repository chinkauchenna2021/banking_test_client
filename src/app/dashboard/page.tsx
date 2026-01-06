'use client';

import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
  Building,
  Users,
  RefreshCw
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useAccount } from '@/hooks/useAccount';
import { useTransaction } from '@/hooks/useTransaction';
import { useDeposit } from '@/hooks/useDeposit';
import { useTransfer } from '@/hooks/useTransfer';
import { useCard } from '@/hooks/useCard';
import { useLoan } from '@/hooks/useLoan';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect, useState } from 'react';
import QuickTransferModal from '@/components/modals/QuickTransferModal';
import DepositModal from '@/components/modals/DepositModal';

export default function DashboardPage() {
  const { user, dashboard, getDashboard, formatCurrency, refreshUserData } =
    useUser();
  const { accounts, totalBalance, defaultAccount, refreshAccountData } =
    useAccount();
  const { recentTransactions, refreshTransactionData } = useTransaction();
  const { totalDeposited, pendingDeposits } = useDeposit();
  const { pendingTransfers, totalTransferredAmount } = useTransfer();
  const { activeCards, totalSpent } = useCard();
  const { activeLoans, outstandingBalance } = useLoan();
  const { userAnalytics, getPredictiveInsights } = useAnalytics();

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        getDashboard(),
        refreshUserData(),
        refreshAccountData(),
        refreshTransactionData()
      ]);

      // Get insights after loading data
      const analyticsInsights = getPredictiveInsights();
      setInsights(analyticsInsights);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const accountStats = {
    total: accounts.length,
    active: accounts.filter((a) => a.status === 'active').length,
    checking: accounts.filter((a) => a.account_type === 'checking').length,
    savings: accounts.filter((a) => a.account_type === 'savings').length
  };

  const spendingData = userAnalytics?.spendingPatterns?.categorySpending
    ? Object.entries(userAnalytics.spendingPatterns.categorySpending).map(
        ([category, amount]) => ({
          category,
          amount: amount as number,
          percentage: ((amount as number) / totalSpent) * 100
        })
      )
    : [
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
      pageTitle={`Dashboard - ${defaultAccount?.account_number || 'Account'}`}
      pageDescription='Welcome to your banking dashboard'
    >
      <div className='space-y-6'>
        {/* Welcome Header */}
        <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Welcome back, {user?.first_name}!
            </h1>
            <p className='text-muted-foreground'>
              Account: {defaultAccount?.account_number || 'Loading...'}
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' onClick={loadDashboardData}>
              <RefreshCw className='mr-2 h-4 w-4' />
              Refresh
            </Button>
            <Button
              variant='outline'
              onClick={() => setShowTransferModal(true)}
            >
              <Send className='mr-2 h-4 w-4' />
              Send Money
            </Button>
            <Button onClick={() => setShowDepositModal(true)}>
              <ArrowDownRight className='mr-2 h-4 w-4' />
              Deposit
            </Button>
          </div>
        </div>

        {/* Insights Alerts */}
        {insights.length > 0 && (
          <div className='space-y-2'>
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`rounded-lg border p-4 ${
                  insight.priority === 'high'
                    ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
                    : insight.priority === 'medium'
                      ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950'
                      : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
                }`}
              >
                <div className='flex items-center gap-2'>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      insight.priority === 'high'
                        ? 'bg-red-500'
                        : insight.priority === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                    }`}
                  />
                  <span className='font-medium'>{insight.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Grid */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Balance
              </CardTitle>
              <Wallet className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatCurrency(totalBalance)}
              </div>
              <p className='text-muted-foreground text-xs'>
                Available:{' '}
                {formatCurrency(Number(defaultAccount?.available_balance) || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active Accounts
              </CardTitle>
              <Building className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{accountStats.active}</div>
              <p className='text-muted-foreground text-xs'>
                {accountStats.checking} checking, {accountStats.savings} savings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Recent Transactions
              </CardTitle>
              <History className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {recentTransactions.length}
              </div>
              <p className='text-muted-foreground text-xs'>Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Security Status
              </CardTitle>
              <Shield className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {user?.two_factor_enabled ? 'Protected' : 'Basic'}
              </div>
              <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                <div
                  className={`h-2 w-2 rounded-full ${user?.two_factor_enabled ? 'bg-green-500' : 'bg-yellow-500'}`}
                ></div>
                {user?.two_factor_enabled ? '2FA Enabled' : 'Enable 2FA'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Overview */}
        <Tabs defaultValue='overview' className='w-full'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='accounts'>Accounts</TabsTrigger>
            <TabsTrigger value='cards'>Cards</TabsTrigger>
            <TabsTrigger value='loans'>Loans</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm'>Active Cards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{activeCards.length}</div>
                  <p className='text-muted-foreground text-xs'>
                    Total spent: {formatCurrency(totalSpent)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm'>Active Loans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{activeLoans.length}</div>
                  <p className='text-muted-foreground text-xs'>
                    Outstanding: {formatCurrency(outstandingBalance)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm'>Pending Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {pendingDeposits.length + pendingTransfers.length}
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    {pendingDeposits.length} deposits, {pendingTransfers.length}{' '}
                    transfers
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='accounts'>
            <Card>
              <CardHeader>
                <CardTitle>Your Accounts</CardTitle>
                <CardDescription>
                  {accounts.length} accounts found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {accounts.slice(0, 3).map((account) => (
                    <div
                      key={account.id}
                      className='flex items-center justify-between rounded-lg border p-4'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='rounded-lg bg-blue-100 p-2 dark:bg-blue-900'>
                          <Building className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                        </div>
                        <div>
                          <h4 className='font-medium'>
                            {account.account_name}
                          </h4>
                          <p className='text-muted-foreground text-sm'>
                            {account.account_number}
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='font-bold'>
                          {formatCurrency(Number(account.balance))}
                        </div>
                        <Badge variant='outline'>{account.account_type}</Badge>
                      </div>
                    </div>
                  ))}

                  {accounts.length > 3 && (
                    <Button variant='outline' className='w-full'>
                      View All Accounts ({accounts.length})
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest account activity</CardDescription>
              </div>
              <Button variant='ghost' size='sm'>
                <History className='mr-2 h-4 w-4' />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {recentTransactions.length > 0 ? (
                recentTransactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className='flex items-center justify-between rounded-lg border p-3'
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`rounded-lg p-2 ${
                          transaction.type === 'deposit'
                            ? 'bg-green-100 dark:bg-green-900'
                            : transaction.type === 'withdrawal'
                              ? 'bg-red-100 dark:bg-red-900'
                              : 'bg-blue-100 dark:bg-blue-900'
                        }`}
                      >
                        {transaction.type === 'deposit' ? (
                          <ArrowDownRight className='h-4 w-4 text-green-600 dark:text-green-400' />
                        ) : transaction.type === 'withdrawal' ? (
                          <ArrowUpRight className='h-4 w-4 text-red-600 dark:text-red-400' />
                        ) : (
                          <Send className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                        )}
                      </div>
                      <div>
                        <h4 className='font-medium'>
                          {transaction.description || transaction.type}
                        </h4>
                        <p className='text-muted-foreground text-sm'>
                          {new Date(
                            transaction.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div
                        className={`font-bold ${
                          transaction.type === 'deposit'
                            ? 'text-green-600'
                            : transaction.type === 'withdrawal'
                              ? 'text-red-600'
                              : 'text-blue-600'
                        }`}
                      >
                        {transaction.type === 'deposit' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </div>
                      <Badge variant='outline'>{transaction.status}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className='py-8 text-center'>
                  <History className='text-muted-foreground mx-auto mb-3 h-12 w-12' />
                  <p className='text-muted-foreground'>
                    No recent transactions
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Spending Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Spending Analysis</CardTitle>
            <CardDescription>
              Breakdown of your monthly expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {spendingData.map((item) => (
                <div key={item.category} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>{item.category}</span>
                    <span className='text-sm font-semibold'>
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                  <Progress value={item.percentage} className='h-2' />
                  <div className='text-muted-foreground flex justify-between text-xs'>
                    <span>{item.percentage.toFixed(1)}% of total</span>
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
