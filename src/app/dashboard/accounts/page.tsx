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
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';

export default function AccountsPage() {
  const {
    accounts,
    isLoading,
    getAccounts,
    createAccount,
    updateAccount,
    closeAccount,
    getAccountStatement,
    formatCurrency
  } = useAccount();
  const { user } = useUser();
  const { toast } = useToast();

  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAccountData, setNewAccountData] = useState({
    account_name: '',
    account_type: 'current',
    currency: user?.currency || 'USD'
  });
  const [editAccountName, setEditAccountName] = useState('');
  const [closeReason, setCloseReason] = useState('');
  const [transferAccountId, setTransferAccountId] = useState('');

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      await getAccounts();
    } catch (error) {
      console.error('Failed to load accounts:', error);
      toast({
        title: 'Failed to load accounts',
        description: 'Please try again in a moment.',
        variant: 'destructive'
      });
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
        account_type: 'current',
        currency: user?.currency || 'USD'
      });
      await loadAccounts();
      toast({
        title: 'Account created',
        description: 'Your new account is ready.'
      });
    } catch (error) {
      console.error('Failed to create account:', error);
      toast({
        title: 'Account creation failed',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateAccount = async () => {
    if (!selectedAccount) return;
    try {
      await updateAccount(selectedAccount.id, {
        account_name: editAccountName
      });
      setShowEditDialog(false);
      await loadAccounts();
      toast({
        title: 'Account updated',
        description: 'Account details saved.'
      });
    } catch (error) {
      console.error('Failed to update account:', error);
      toast({
        title: 'Update failed',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleCloseAccount = async () => {
    if (!selectedAccount || !closeReason) {
      toast({
        title: 'Reason required',
        description: 'Please provide a reason to close the account.',
        variant: 'destructive'
      });
      return;
    }

    try {
      await closeAccount(
        selectedAccount.id,
        closeReason,
        transferAccountId || undefined
      );
      setShowCloseDialog(false);
      setCloseReason('');
      setTransferAccountId('');
      await loadAccounts();
      toast({
        title: 'Account closed',
        description: 'The account has been closed successfully.'
      });
    } catch (error) {
      console.error('Failed to close account:', error);
      toast({
        title: 'Close failed',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const exportToCsv = (rows: Record<string, any>[], filename: string) => {
    if (!rows.length) {
      toast({
        title: 'Nothing to export',
        description: 'No statement data available.'
      });
      return;
    }

    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const value = row[header] ?? '';
            const escaped = String(value).replace(/\"/g, '\"\"');
            return `\"${escaped}\"`;
          })
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadStatement = async (account: any) => {
    try {
      const statement = await getAccountStatement(account.id);
      const rows = (
        statement?.transactions ||
        statement?.data ||
        statement ||
        []
      ).map((tx: any) => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        description: tx.description,
        created_at: tx.created_at
      }));
      exportToCsv(rows, `account-${account.account_number}-statement.csv`);
    } catch (error) {
      console.error('Failed to download statement:', error);
      toast({
        title: 'Statement download failed',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'current':
      case 'primary':
      case 'checking':
        return <Wallet className='h-5 w-5' />;
      case 'savings':
        return <Building className='h-5 w-5' />;
      case 'corporate':
      case 'joint':
      case 'fixed_deposit':
      case 'credit':
        return <CreditCard className='h-5 w-5' />;
      default:
        return <Wallet className='h-5 w-5' />;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'current':
      case 'primary':
      case 'checking':
        return 'bg-blue-100 text-blue-800';
      case 'savings':
        return 'bg-green-100 text-green-800';
      case 'corporate':
      case 'joint':
      case 'fixed_deposit':
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
                        <SelectItem value='primary'>Primary Account</SelectItem>
                        <SelectItem value='current'>Current Account</SelectItem>
                        <SelectItem value='savings'>Savings Account</SelectItem>
                        <SelectItem value='fixed_deposit'>
                          Fixed Deposit Account
                        </SelectItem>
                        <SelectItem value='joint'>Joint Account</SelectItem>
                        <SelectItem value='corporate'>
                          Corporate Account
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
            <TabsTrigger value='current'>Current</TabsTrigger>
            <TabsTrigger value='savings'>Savings</TabsTrigger>
            <TabsTrigger value='corporate'>Corporate</TabsTrigger>
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
                                  setEditAccountName(account.account_name);
                                  setShowEditDialog(true);
                                }}
                              >
                                <Edit className='mr-2 h-4 w-4' />
                                Edit Account
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDownloadStatement(account)}
                              >
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
                              {account.account_type
                                .replace(/_/g, ' ')
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
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
                        <Button
                          variant='outline'
                          className='w-full'
                          onClick={() =>
                            document
                              .getElementById('accounts-table')
                              ?.scrollIntoView({ behavior: 'smooth' })
                          }
                        >
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
        <Card id='accounts-table'>
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
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAccount(account);
                              setEditAccountName(account.account_name);
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit className='mr-2 h-4 w-4' />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownloadStatement(account)}
                          >
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
                  value={editAccountName}
                  onChange={(e) => setEditAccountName(e.target.value)}
                />
              </div>

              <div className='flex justify-end gap-3'>
                <Button
                  variant='outline'
                  onClick={() => setShowEditDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateAccount} disabled={isLoading}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Close Account Dialog */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Account</DialogTitle>
            <DialogDescription>
              Closing an account is permanent. Please confirm and provide a
              reason.
            </DialogDescription>
          </DialogHeader>

          {selectedAccount && (
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='close-reason'>Reason</Label>
                <Textarea
                  id='close-reason'
                  placeholder='Provide a reason for closing this account'
                  value={closeReason}
                  onChange={(e) => setCloseReason(e.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='transfer-account'>
                  Transfer Remaining Balance (optional)
                </Label>
                <Select
                  value={transferAccountId}
                  onValueChange={setTransferAccountId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select an account' />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts
                      .filter((acc) => acc.id !== selectedAccount.id)
                      .map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.account_name} ••••
                          {account.account_number.slice(-4)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex justify-end gap-3'>
                <Button
                  variant='outline'
                  onClick={() => setShowCloseDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant='destructive'
                  onClick={handleCloseAccount}
                  disabled={isLoading}
                >
                  Close Account
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
