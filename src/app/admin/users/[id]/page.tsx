'use client';

import { useParams, useRouter } from 'next/navigation';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { useEnhancedAdminUser } from '../../../../hooks/useEnhancedAdmin';
import {
  ArrowLeft,
  Shield,
  Tag,
  CreditCard,
  History,
  Coins,
  TrendingUp,
  TrendingDown,
  User,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  Trash2,
  Ban,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import React from 'react';

export default function EnhancedUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const {
    user,
    userActivities,
    cryptoAccounts,
    loadUserDetails,
    suspendUser,
    activateUser,
    verifyUser,
    addUserTag,
    removeUserTag,
    updateRiskLevel,
    addBalance,
    deductBalance,
    setBalance,
    isLoading,
    error
  } = useEnhancedAdminUser(userId);

  const [showBalanceDialog, setShowBalanceDialog] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [showRiskDialog, setShowRiskDialog] = useState(false);
  const [balanceData, setBalanceData] = useState({
    type: 'add',
    amount: '',
    reason: ''
  });
  const [tagData, setTagData] = useState('');
  const [riskData, setRiskData] = useState('');

  React.useEffect(() => {
    if (userId) {
      loadUserDetails(userId);
    }
  }, [userId, loadUserDetails]);

  const handleBalanceAction = async () => {
    if (!balanceData.amount || !balanceData.reason) {
      toast.error('Please fill all fields');
      return;
    }

    const amount = parseFloat(balanceData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      switch (balanceData.type) {
        case 'add':
          await addBalance(amount, balanceData.reason);
          break;
        case 'deduct':
          await deductBalance(amount, balanceData.reason);
          break;
        case 'set':
          await setBalance(amount, balanceData.reason);
          break;
      }
      toast.success('Balance updated successfully');
      setShowBalanceDialog(false);
      setBalanceData({ type: 'add', amount: '', reason: '' });
    } catch (error: any) {
      toast.error(`Failed to update balance: ${error.message}`);
    }
  };

  const handleTagAction = async () => {
    if (!tagData.trim()) {
      toast.error('Please enter a tag');
      return;
    }

    try {
      await addUserTag(tagData);
      toast.success('Tag added successfully');
      setShowTagDialog(false);
      setTagData('');
    } catch (error: any) {
      toast.error(`Failed to add tag: ${error.message}`);
    }
  };

  const handleRiskUpdate = async () => {
    if (!riskData) {
      toast.error('Please select a risk level');
      return;
    }

    try {
      await updateRiskLevel(riskData);
      toast.success('Risk level updated');
      setShowRiskDialog(false);
      setRiskData('');
    } catch (error: any) {
      toast.error(`Failed to update risk level: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <PageContainer scrollable pageTitle='Loading User...' pageDescription=''>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />
            <p className='text-muted-foreground mt-4 text-sm'>
              Loading user details...
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !user) {
    return (
      <PageContainer scrollable pageTitle='User Not Found' pageDescription=''>
        <Card>
          <CardContent className='py-10 text-center'>
            <AlertCircle className='mx-auto mb-4 h-12 w-12 text-red-500' />
            <h3 className='mb-2 text-lg font-semibold'>User Not Found</h3>
            <p className='text-muted-foreground mb-4'>
              {(error as any)?.message ||
                'The requested user could not be found'}
            </p>
            <Button onClick={() => router.push('/admin/users')}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Users
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      scrollable
      pageTitle={`${user.first_name} ${user.last_name}`}
      pageDescription='Comprehensive user management and analytics'
    >
      <div className='space-y-6'>
        {/* Header Actions */}
        <div className='flex items-center justify-between'>
          <Button variant='ghost' onClick={() => router.push('/admin/users')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Users
          </Button>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => setShowRiskDialog(true)}>
              <Shield className='mr-2 h-4 w-4' />
              Risk Level
            </Button>
            <Button variant='outline' onClick={() => setShowTagDialog(true)}>
              <Tag className='mr-2 h-4 w-4' />
              Add Tag
            </Button>
            {user.account_status === 'active' ? (
              <Button
                variant='destructive'
                onClick={() => suspendUser('Manual suspension')}
              >
                <Ban className='mr-2 h-4 w-4' />
                Suspend
              </Button>
            ) : (
              <Button variant='default' onClick={activateUser}>
                <UserCheck className='mr-2 h-4 w-4' />
                Activate
              </Button>
            )}
          </div>
        </div>

        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
              <div>
                <CardTitle className='text-2xl'>User Profile</CardTitle>
                <CardDescription>
                  Complete user information and statistics
                </CardDescription>
              </div>
              <div className='flex gap-2'>
                <Badge
                  variant={
                    user.account_status === 'active' ? 'default' : 'destructive'
                  }
                >
                  {user.account_status}
                </Badge>
                <Badge
                  variant={
                    user.risk_level === 'high'
                      ? 'destructive'
                      : user.risk_level === 'medium'
                        ? 'default'
                        : 'secondary'
                  }
                >
                  {user.risk_level || 'unknown'} Risk
                </Badge>
                {user.email_verified_at && (
                  <Badge variant='outline' className='text-green-600'>
                    <CheckCircle className='mr-1 h-3 w-3' />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6 md:grid-cols-2'>
              {/* Basic Info */}
              <div className='space-y-4'>
                <div>
                  <Label className='text-muted-foreground'>
                    Personal Information
                  </Label>
                  <div className='mt-2 space-y-3'>
                    <div className='flex items-center gap-2'>
                      <User className='text-muted-foreground h-4 w-4' />
                      <span>
                        {user.first_name} {user.last_name}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Mail className='text-muted-foreground h-4 w-4' />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className='flex items-center gap-2'>
                        <Phone className='text-muted-foreground h-4 w-4' />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className='flex items-center gap-2'>
                      <Calendar className='text-muted-foreground h-4 w-4' />
                      <span>
                        Joined {format(new Date(user.created_at), 'PP')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div>
                  <Label className='text-muted-foreground'>
                    Account Information
                  </Label>
                  <div className='mt-2 space-y-2'>
                    <div>
                      <span className='text-muted-foreground text-sm'>
                        Account Number:
                      </span>
                      <p className='font-mono'>{user.account_number}</p>
                    </div>
                    <div>
                      <span className='text-muted-foreground text-sm'>
                        Account Type:
                      </span>
                      <p className='capitalize'>{user.account_type}</p>
                    </div>
                    <div>
                      <span className='text-muted-foreground text-sm'>
                        Identification:
                      </span>
                      <p>{user.identification_number || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label className='text-muted-foreground'>Tags</Label>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {/* //@ts-ignore */}
                    {user.tags?.map((tag: any) => (
                      <Badge
                        key={tag}
                        variant='secondary'
                        className='flex items-center gap-1'
                      >
                        {tag}
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-3 w-3 p-0 hover:bg-transparent'
                          onClick={() => removeUserTag(tag)}
                        >
                          <XCircle className='h-3 w-3' />
                        </Button>
                      </Badge>
                    ))}
                    {(!user.tags || user.tags.length === 0) && (
                      <span className='text-muted-foreground text-sm'>
                        No tags
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Financial Stats */}
              <div className='space-y-4'>
                <div>
                  <Label className='text-muted-foreground'>
                    Financial Overview
                  </Label>
                  <div className='mt-2 space-y-4'>
                    <div className='rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4'>
                      <div className='text-muted-foreground text-sm'>
                        Current Balance
                      </div>
                      <div className='text-3xl font-bold'>
                        $
                        {parseFloat(user.balance).toLocaleString(undefined, {
                          minimumFractionDigits: 2
                        })}
                      </div>
                      <Button
                        variant='outline'
                        size='sm'
                        className='mt-2'
                        onClick={() => setShowBalanceDialog(true)}
                      >
                        <Edit className='mr-2 h-3 w-3' />
                        Adjust Balance
                      </Button>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div className='rounded-lg bg-slate-50 p-3 text-center'>
                        <div className='text-muted-foreground text-sm'>
                          Total Deposits
                        </div>
                        <div className='text-xl font-semibold'>
                          {user._count?.deposits || 0}
                        </div>
                      </div>
                      <div className='rounded-lg bg-slate-50 p-3 text-center'>
                        <div className='text-muted-foreground text-sm'>
                          Total Transactions
                        </div>
                        <div className='text-xl font-semibold'>
                          {user._count?.transactions || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Detailed Views */}
        <Tabs defaultValue='activities' className='space-y-6'>
          <TabsList>
            <TabsTrigger value='activities' className='flex items-center gap-2'>
              <History className='h-4 w-4' />
              Activities
            </TabsTrigger>
            <TabsTrigger value='crypto' className='flex items-center gap-2'>
              <Coins className='h-4 w-4' />
              Crypto Accounts
            </TabsTrigger>
            <TabsTrigger value='deposits' className='flex items-center gap-2'>
              <CreditCard className='h-4 w-4' />
              Recent Deposits
            </TabsTrigger>
          </TabsList>

          <TabsContent value='activities'>
            <Card>
              <CardHeader>
                <CardTitle>User Activities</CardTitle>
                <CardDescription>
                  Recent actions and system interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userActivities.slice(0, 10).map((activity: any) => (
                      <TableRow key={activity.id}>
                        <TableCell className='font-medium'>
                          {activity.metadata?.action}
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline' className='capitalize'>
                            {activity.activity_type}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-muted-foreground text-sm'>
                          {activity.description}
                        </TableCell>
                        <TableCell>
                          {format(new Date(activity.created_at), 'PPp')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='crypto'>
            <Card>
              <CardHeader>
                <CardTitle>Crypto Accounts</CardTitle>
                <CardDescription>
                  Associated cryptocurrency wallets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Currency</TableHead>
                      <TableHead>Network</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cryptoAccounts.map((account: any) => (
                      <TableRow key={account.created_at}>
                        <TableCell>
                          <Badge variant='outline'>{'USD'}</Badge>
                        </TableCell>
                        <TableCell>{account.network}</TableCell>
                        <TableCell className='font-mono text-sm'>
                          {account.wallet_address.slice(0, 20)}...
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              account.status === 'active'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {account.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(account.created_at), 'PP')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Balance Adjustment Dialog */}
      <Dialog open={showBalanceDialog} onOpenChange={setShowBalanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust User Balance</DialogTitle>
            <DialogDescription>
              Current balance: $
              {parseFloat(user.balance).toLocaleString(undefined, {
                minimumFractionDigits: 2
              })}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>Action Type</Label>
              <Select
                value={balanceData.type}
                onValueChange={(value: any) =>
                  setBalanceData({ ...balanceData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='add'>
                    <div className='flex items-center gap-2'>
                      <TrendingUp className='h-4 w-4' />
                      Add Balance
                    </div>
                  </SelectItem>
                  <SelectItem value='deduct'>
                    <div className='flex items-center gap-2'>
                      <TrendingDown className='h-4 w-4' />
                      Deduct Balance
                    </div>
                  </SelectItem>
                  <SelectItem value='set'>
                    <div className='flex items-center gap-2'>
                      <Edit className='h-4 w-4' />
                      Set Balance
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount</Label>
              <Input
                type='number'
                placeholder='Enter amount'
                value={balanceData.amount}
                onChange={(e) =>
                  setBalanceData({ ...balanceData, amount: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Reason</Label>
              <Textarea
                placeholder='Enter reason for balance adjustment'
                value={balanceData.reason}
                onChange={(e) =>
                  setBalanceData({ ...balanceData, reason: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowBalanceDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleBalanceAction}>
              <Save className='mr-2 h-4 w-4' />
              Confirm Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tag Dialog */}
      <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User Tag</DialogTitle>
            <DialogDescription>
              Add a tag for better user categorization and filtering
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>Tag Name</Label>
              <Input
                placeholder='e.g., vip, high-volume, new-user'
                value={tagData}
                onChange={(e) => setTagData(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowTagDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleTagAction}>
              <Tag className='mr-2 h-4 w-4' />
              Add Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Risk Level Dialog */}
      <Dialog open={showRiskDialog} onOpenChange={setShowRiskDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Risk Level</DialogTitle>
            <DialogDescription>
              Current risk level:{' '}
              <strong className='capitalize'>
                {user.risk_level || 'unknown'}
              </strong>
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>Select Risk Level</Label>
              <Select value={riskData} onValueChange={setRiskData}>
                <SelectTrigger>
                  <SelectValue placeholder='Select risk level' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='low'>
                    <div className='flex items-center gap-2'>
                      <div className='h-3 w-3 rounded-full bg-green-500' />
                      Low Risk
                    </div>
                  </SelectItem>
                  <SelectItem value='medium'>
                    <div className='flex items-center gap-2'>
                      <div className='h-3 w-3 rounded-full bg-yellow-500' />
                      Medium Risk
                    </div>
                  </SelectItem>
                  <SelectItem value='high'>
                    <div className='flex items-center gap-2'>
                      <div className='h-3 w-3 rounded-full bg-red-500' />
                      High Risk
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowRiskDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRiskUpdate}>
              <Shield className='mr-2 h-4 w-4' />
              Update Risk Level
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
