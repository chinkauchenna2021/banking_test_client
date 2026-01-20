'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { useEnhancedAdmin } from '@/hooks/useEnhancedAdmin';
import { CheckCircle, RefreshCw, Search, ShieldOff } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminCryptoAccountsPage() {
  const { cryptoAccounts, getCryptoAccounts, verifyCryptoAccount, isLoading } =
    useEnhancedAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    getCryptoAccounts().catch((error) => {
      console.error('Failed to load crypto accounts:', error);
    });
  }, [getCryptoAccounts]);

  const filteredAccounts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return cryptoAccounts.filter((account) => {
      const matchesQuery =
        !query ||
        account.address?.toLowerCase().includes(query) ||
        account.network?.toLowerCase().includes(query) ||
        account.label?.toLowerCase().includes(query) ||
        account.user?.email?.toLowerCase().includes(query) ||
        account.user?.account_number?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'all' || account.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [cryptoAccounts, searchQuery, statusFilter]);

  const handleVerify = async (paymentMethodId: string, verified: boolean) => {
    try {
      await verifyCryptoAccount(paymentMethodId, verified);
      toast.success(
        verified ? 'Crypto account verified' : 'Crypto account suspended'
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          'Crypto account update failed'
      );
    }
  };

  return (
    <PageContainer
      scrollable
      pageTitle='Crypto Accounts'
      pageDescription='Review and verify crypto payment methods'
    >
      <EnhancedAdminContainer>
        <div className='space-y-6'>
          <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
            <div>
              <h2 className='text-3xl font-bold tracking-tight'>
                Crypto Accounts
              </h2>
              <p className='text-muted-foreground'>
                Manage crypto wallet verification and status
              </p>
            </div>
            <Button onClick={() => getCryptoAccounts()} variant='outline'>
              <RefreshCw className='mr-2 h-4 w-4' />
              Refresh
            </Button>
          </div>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col gap-4 sm:flex-row'>
                <div className='relative flex-1'>
                  <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                  <Input
                    placeholder='Search by wallet, network, or user...'
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className='pl-9'
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Statuses</SelectItem>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='suspended'>Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wallet Registry</CardTitle>
              <CardDescription>
                Active crypto payment methods by user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className='py-8 text-center'>
                        Loading crypto accounts...
                      </TableCell>
                    </TableRow>
                  ) : filteredAccounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className='py-8 text-center'>
                        No crypto accounts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAccounts.map((account) => (
                      <TableRow key={account.payment_method_id}>
                        <TableCell>
                          <div className='font-medium'>
                            {account.user?.first_name || 'Unknown'}{' '}
                            {account.user?.last_name || ''}
                          </div>
                          <div className='text-muted-foreground text-sm'>
                            {account.user?.email || 'No email'}
                          </div>
                        </TableCell>
                        <TableCell className='capitalize'>
                          {account.network}
                        </TableCell>
                        <TableCell className='font-mono text-xs'>
                          {account.address
                            ? `${account.address.slice(0, 18)}...`
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              account.status === 'active'
                                ? 'default'
                                : 'secondary'
                            }
                            className='capitalize'
                          >
                            {account.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              account.verified_at ? 'default' : 'outline'
                            }
                          >
                            {account.verified_at ? 'Verified' : 'Unverified'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(account.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className='text-right'>
                          <div className='flex justify-end gap-2'>
                            {!account.verified_at && (
                              <Button
                                size='sm'
                                onClick={() =>
                                  handleVerify(account.payment_method_id, true)
                                }
                              >
                                <CheckCircle className='mr-1 h-4 w-4' />
                                Verify
                              </Button>
                            )}
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() =>
                                handleVerify(account.payment_method_id, false)
                              }
                            >
                              <ShieldOff className='mr-1 h-4 w-4' />
                              Suspend
                            </Button>
                          </div>
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
