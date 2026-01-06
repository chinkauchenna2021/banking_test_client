'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  PlusCircle,
  Wallet,
  Building,
  CreditCard,
  MoreVertical,
  ArrowUpRight,
  Eye,
  Edit,
  Trash2,
  Download,
  Search,
  Copy,
  Shield
} from 'lucide-react';
import { useAccount } from '@/hooks/useAccount';
import { useUser } from '@/hooks/useUser';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AccountsPage() {
  const {
    accounts,
    isLoading,
    getAccounts,
    createAccount,
    updateAccount,
    closeAccount,
    formatCurrency
  } = useAccount();
  const { user } = useUser();

  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAccountData, setNewAccountData] = useState({
    account_name: '',
    account_type: 'checking',
    currency: user?.currency || 'USD'
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      await getAccounts();
    } catch (error) {
      console.error('Failed to load accounts:', error);
    }
  };

  const filteredAccounts = accounts.filter(
    (account) =>
      account.account_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.account_number.includes(searchQuery) ||
      account.account_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateAccount = async () => {
    try {
      await createAccount(newAccountData);
      setShowCreateDialog(false);
      setNewAccountData({
        account_name: '',
        account_type: 'checking',
        currency: user?.currency || 'USD'
      });
      await loadAccounts();
    } catch (error) {
      console.error('Failed to create account:', error);
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <Wallet className='h-5 w-5' />;
      case 'savings':
        return <Building className='h-5 w-5' />;
      case 'credit':
        return <CreditCard className='h-5 w-5' />;
      default:
        return <Wallet className='h-5 w-5' />;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'checking':
        return 'bg-blue-100 text-blue-800';
      case 'savings':
        return 'bg-green-100 text-green-800';
      case 'credit':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccountStats = () => {
    return {
      total: accounts.length,
      active: accounts.filter((a) => a.status === 'active').length,
      totalBalance: accounts.reduce(
        (sum, acc) => sum + parseFloat(acc.balance),
        0
      )
    };
  };

  return (
    <PageContainer
      scrollable
      pageTitle='Accounts'
      pageDescription='Manage your bank accounts and view balances'
    >
      <div className='space-y-6'>
        {/* Header with Stats */}
        <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Accounts</h1>
            <p className='text-muted-foreground'>
              {getAccountStats().total} accounts • $
              {getAccountStats().totalBalance.toLocaleString()} total balance
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
              <Input
                placeholder='Search accounts...'
                className='w-full pl-9 md:w-64'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className='mr-2 h-4 w-4' />
                  New Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Account</DialogTitle>
                  <DialogDescription>
                    Open a new bank account in minutes
                  </DialogDescription>
                </DialogHeader>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='account_name'>Account Name</Label>
                    <Input
                      id='account_name'
                      placeholder='e.g., Main Checking'
                      value={newAccountData.account_name}
                      onChange={(e) =>
                        setNewAccountData({
                          ...newAccountData,
                          account_name: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='account_type'>Account Type</Label>
                    <Select
                      value={newAccountData.account_type}
                      onValueChange={(value) =>
                        setNewAccountData({
                          ...newAccountData,
                          account_type: value
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select account type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='checking'>
                          Checking Account
                        </SelectItem>
                        <SelectItem value='savings'>Savings Account</SelectItem>
                        <SelectItem value='credit'>Credit Account</SelectItem>
                        <SelectItem value='investment'>
                          Investment Account
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='currency'>Currency</Label>
                    <Select
                      value={newAccountData.currency}
                      onValueChange={(value) =>
                        setNewAccountData({
                          ...newAccountData,
                          currency: value
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select currency' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='USD'>USD - US Dollar</SelectItem>
                        <SelectItem value='EUR'>EUR - Euro</SelectItem>
                        <SelectItem value='GBP'>GBP - British Pound</SelectItem>
                        <SelectItem value='JPY'>JPY - Japanese Yen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='flex justify-end gap-3'>
                  <Button
                    variant='outline'
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateAccount}
                    disabled={isLoading ? true : false}
                  >
                    {isLoading ? 'Loading...' : 'Create Account'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Accounts Grid */}
        <Tabs defaultValue='all' className='w-full'>
          <TabsList className='mb-6'>
            <TabsTrigger value='all'>All Accounts</TabsTrigger>
            <TabsTrigger value='checking'>Checking</TabsTrigger>
            <TabsTrigger value='savings'>Savings</TabsTrigger>
            <TabsTrigger value='credit'>Credit</TabsTrigger>
          </TabsList>

          <TabsContent value='all' className='space-y-4'>
            {filteredAccounts.length > 0 ? (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {filteredAccounts.map((account, index) => (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className='h-full transition-shadow hover:shadow-lg'>
                      <CardHeader className='pb-3'>
                        <div className='flex items-start justify-between'>
                          <div className='flex items-center gap-3'>
                            <div
                              className={`rounded-lg p-2 ${getAccountTypeColor(account.account_type)}`}
                            >
                              {getAccountTypeIcon(account.account_type)}
                            </div>
                            <div>
                              <CardTitle className='text-lg'>
                                {account.account_name}
                              </CardTitle>
                              <CardDescription className='text-sm'>
                                {account.account_number.slice(0, 4)} **** ****{' '}
                                {account.account_number.slice(-4)}
                              </CardDescription>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='icon'>
                                <MoreVertical className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuLabel>
                                Account Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className='mr-2 h-4 w-4' />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedAccount(account);
                                  setShowEditDialog(true);
                                }}
                              >
                                <Edit className='mr-2 h-4 w-4' />
                                Edit Account
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className='mr-2 h-4 w-4' />
                                Download Statement
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className='text-red-600'
                                onClick={() => {
                                  setSelectedAccount(account);
                                  setShowCloseDialog(true);
                                }}
                              >
                                <Trash2 className='mr-2 h-4 w-4' />
                                Close Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className='space-y-4'>
                          <div>
                            <div className='text-2xl font-bold'>
                              {formatCurrency(
                                account.balance,
                                account.currency
                              )}
                            </div>
                            <div className='text-muted-foreground text-sm'>
                              Current Balance
                            </div>
                          </div>

                          <div className='grid grid-cols-2 gap-4'>
                            <div>
                              <div className='text-sm font-medium'>
                                Available
                              </div>
                              <div className='text-lg font-semibold'>
                                {formatCurrency(
                                  account.available_balance,
                                  account.currency
                                )}
                              </div>
                            </div>
                            <div>
                              <div className='text-sm font-medium'>Ledger</div>
                              <div className='text-lg font-semibold'>
                                {formatCurrency(
                                  account.ledger_balance,
                                  account.currency
                                )}
                              </div>
                            </div>
                          </div>

                          <div className='flex items-center justify-between'>
                            <Badge
                              variant='outline'
                              className={getAccountTypeColor(
                                account.account_type
                              )}
                            >
                              {account.account_type.charAt(0).toUpperCase() +
                                account.account_type.slice(1)}
                            </Badge>

                            <Badge
                              variant={
                                account.status === 'active'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {account.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className='pt-0'>
                        <Button variant='outline' className='w-full'>
                          <ArrowUpRight className='mr-2 h-4 w-4' />
                          View Transactions
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className='py-12 text-center'>
                <CardContent className='space-y-4'>
                  <div className='bg-muted mx-auto flex h-24 w-24 items-center justify-center rounded-full'>
                    <Wallet className='text-muted-foreground h-12 w-12' />
                  </div>
                  <h3 className='text-xl font-semibold'>No accounts found</h3>
                  <p className='text-muted-foreground'>
                    {searchQuery
                      ? 'No accounts match your search'
                      : 'Get started by creating your first account'}
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <PlusCircle className='mr-2 h-4 w-4' />
                    Create Account
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Accounts Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Accounts</CardTitle>
            <CardDescription>
              Detailed view of all your accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className='font-medium'>
                      <div className='flex items-center gap-3'>
                        {getAccountTypeIcon(account.account_type)}
                        {account.account_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <span>{account.account_number}</span>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-6 w-6'
                          onClick={() =>
                            navigator.clipboard.writeText(
                              account.account_number
                            )
                          }
                        >
                          <Copy className='h-3 w-3' />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={getAccountTypeColor(account.account_type)}
                      >
                        {account.account_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{account.currency}</TableCell>
                    <TableCell className='font-semibold'>
                      {formatCurrency(account.balance, account.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          account.status === 'active' ? 'default' : 'secondary'
                        }
                      >
                        {account.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <MoreVertical className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem>
                            <Eye className='mr-2 h-4 w-4' />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className='mr-2 h-4 w-4' />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className='mr-2 h-4 w-4' />
                            Statement
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Total Balance</p>
                  <div className='text-2xl font-bold'>
                    {formatCurrency(getAccountStats().totalBalance, 'USD')}
                  </div>
                </div>
                <Shield className='h-8 w-8 text-blue-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Active Accounts
                  </p>
                  <div className='text-2xl font-bold'>
                    {getAccountStats().active}
                  </div>
                </div>
                <Wallet className='h-8 w-8 text-green-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Total Accounts
                  </p>
                  <div className='text-2xl font-bold'>
                    {getAccountStats().total}
                  </div>
                </div>
                <Building className='h-8 w-8 text-purple-500' />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Account Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Update account details for {selectedAccount?.account_name}
            </DialogDescription>
          </DialogHeader>

          {selectedAccount && (
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='edit-account-name'>Account Name</Label>
                <Input
                  id='edit-account-name'
                  defaultValue={selectedAccount.account_name}
                />
              </div>

              <div className='flex justify-end gap-3'>
                <Button
                  variant='outline'
                  onClick={() => setShowEditDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    // Handle update
                    setShowEditDialog(false);
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
