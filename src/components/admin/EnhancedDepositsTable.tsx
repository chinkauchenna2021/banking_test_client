'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
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
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  useEnhancedAdmin,
  useEnhancedAdminDeposit
} from '../../hooks/useEnhancedAdmin';
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Filter,
  Download,
  ExternalLink,
  Image as ImageIcon,
  Building,
  Wallet,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedDepositsTableProps {
  showFilters?: boolean;
  limit?: number;
  showActions?: boolean;
}

export default function EnhancedDepositsTable({
  showFilters = true,
  limit,
  showActions = true
}: EnhancedDepositsTableProps) {
  const router = useRouter();
  const {
    enhancedDeposits,
    enhancedDepositStats,
    depositsRequiringVerification,
    isLoading
  } = useEnhancedAdmin();

  const {
    approveDeposit,
    rejectDeposit,
    setSelectedDeposit: setStoreSelectedDeposit
  } = useEnhancedAdminDeposit();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedDeposit, setSelectedDeposit] = useState<any>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredDeposits = enhancedDeposits.filter((deposit) => {
    const matchesSearch =
      searchQuery === '' ||
      deposit.bank_reference
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      deposit.user_id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || deposit.status === statusFilter;
    const matchesMethod =
      methodFilter === 'all' || deposit.method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const displayDeposits = limit
    ? filteredDeposits.slice(0, limit)
    : filteredDeposits;

  const handleApprove = async (deposit: any) => {
    try {
      setStoreSelectedDeposit(deposit);
      await approveDeposit('Approved by admin');
      toast.success('Deposit approved successfully');
      setShowReviewDialog(false);
    } catch (error: any) {
      toast.error(`Failed to approve deposit: ${error.message}`);
    }
  };

  const handleReject = async () => {
    if (!selectedDeposit || !rejectionReason) {
      toast.error('Please provide a rejection reason');
      return;
    }
    try {
      setStoreSelectedDeposit(selectedDeposit);
      await rejectDeposit(rejectionReason);
      toast.success('Deposit rejected');
      setShowReviewDialog(false);
      setRejectionReason('');
    } catch (error: any) {
      toast.error(`Failed to reject deposit: ${error.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'crypto':
        return <Wallet className='h-4 w-4 text-green-600' />;
      case 'bank_transfer':
        return <Building className='h-4 w-4 text-blue-600' />;
      case 'card':
        return <CreditCard className='h-4 w-4 text-purple-600' />;
      default:
        return <CreditCard className='text-muted-foreground h-4 w-4' />;
    }
  };

  return (
    <div>
      {showFilters && (
        <div className='mb-6 space-y-4'>
          {/* Filters */}
          <div className='flex flex-wrap gap-2'>
            <div className='relative min-w-[200px] flex-1'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
              <Input
                placeholder='Search by reference or user...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-9'
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[150px]'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='failed'>Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className='w-[150px]'>
                <SelectValue placeholder='Method' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Methods</SelectItem>
                <SelectItem value='crypto'>Crypto</SelectItem>
                <SelectItem value='bank_transfer'>Bank Transfer</SelectItem>
                <SelectItem value='card'>Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
            <Card className='p-3'>
              <div className='text-muted-foreground text-sm'>
                Total Deposits
              </div>
              <div className='text-2xl font-bold'>
                {enhancedDepositStats.total}
              </div>
            </Card>
            <Card className='p-3'>
              <div className='text-muted-foreground text-sm'>
                Pending Verification
              </div>
              <div className='text-2xl font-bold text-yellow-600'>
                {depositsRequiringVerification.length}
              </div>
            </Card>
            <Card className='p-3'>
              <div className='text-muted-foreground text-sm'>Total Amount</div>
              <div className='text-2xl font-bold'>
                $
                {enhancedDepositStats.totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2
                })}
              </div>
            </Card>
            <Card className='p-3'>
              <div className='text-muted-foreground text-sm'>
                Crypto Deposits
              </div>
              <div className='text-2xl font-bold text-green-600'>
                {enhancedDepositStats.cryptoDeposits}
              </div>
            </Card>
          </div>
        </div>
      )}

      <div className='rounded-md border bg-white dark:bg-slate-900'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Proof</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              {showActions && (
                <TableHead className='text-right'>Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={showActions ? 8 : 7}
                  className='py-8 text-center'
                >
                  Loading enhanced deposits...
                </TableCell>
              </TableRow>
            ) : displayDeposits.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={showActions ? 8 : 7}
                  className='py-8 text-center'
                >
                  No deposits found
                </TableCell>
              </TableRow>
            ) : (
              displayDeposits.map((deposit) => (
                <TableRow
                  key={deposit.id}
                  className='hover:bg-slate-50 dark:hover:bg-slate-800'
                >
                  <TableCell className='font-mono text-sm'>
                    {deposit.bank_reference || deposit.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <div className='text-sm'>
                      <div className='font-medium'>
                        {deposit.user?.first_name} {deposit.user?.last_name}
                      </div>
                      <div className='text-muted-foreground text-xs'>
                        {deposit.user?.account_number}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <span className='text-lg'>
                        {getMethodIcon(deposit.method)}
                      </span>
                      <span className='capitalize'>{deposit.method}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='font-semibold'>
                      $
                      {parseFloat(deposit.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                      })}
                    </div>
                    {deposit.fee && (
                      <div className='text-muted-foreground text-xs'>
                        Fee: ${deposit.fee}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {deposit.proof_of_payment ? (
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-8 w-8 p-0'
                        onClick={() =>
                          window.open(deposit.proof_of_payment, '_blank')
                        }
                      >
                        <ImageIcon className='h-4 w-4' />
                      </Button>
                    ) : (
                      <span className='text-muted-foreground text-xs'>
                        No proof
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`capitalize ${getStatusColor(deposit.status)}`}
                    >
                      {deposit.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className='text-sm'>
                      {new Date(deposit.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  {showActions && (
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => {
                            setSelectedDeposit(deposit);
                            setShowReviewDialog(true);
                          }}
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                        {deposit.status === 'pending' && (
                          <>
                            <Button
                              variant='default'
                              size='sm'
                              onClick={() => handleApprove(deposit)}
                            >
                              <CheckCircle className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='destructive'
                              size='sm'
                              onClick={() => {
                                setSelectedDeposit(deposit);
                                setShowReviewDialog(true);
                              }}
                            >
                              <XCircle className='h-4 w-4' />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Review Deposit</DialogTitle>
            <DialogDescription>
              Verify deposit details and proof of payment
            </DialogDescription>
          </DialogHeader>

          {selectedDeposit && (
            <div className='space-y-6'>
              {/* Deposit Details */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Reference ID</Label>
                  <p className='font-mono text-sm'>
                    {selectedDeposit.deposit_reference ||
                      selectedDeposit.bank_reference ||
                      selectedDeposit.id}
                  </p>
                </div>
                <div>
                  <Label>User</Label>
                  <p className='font-medium'>
                    {selectedDeposit.user?.first_name}{' '}
                    {selectedDeposit.user?.last_name}
                  </p>
                </div>
                <div>
                  <Label>Amount</Label>
                  <p className='text-2xl font-bold text-green-600'>
                    $
                    {parseFloat(selectedDeposit.amount).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2 }
                    )}
                  </p>
                </div>
                <div>
                  <Label>Method</Label>
                  <Badge variant='outline' className='capitalize'>
                    {selectedDeposit.method}
                  </Badge>
                </div>
              </div>

              {/* Proof of Payment */}
              {selectedDeposit.proof_of_payment && (
                <div>
                  <Label>Proof of Payment</Label>
                  <div className='mt-2 rounded-lg border p-4'>
                    <div className='mb-2 flex items-center justify-between'>
                      <span className='text-muted-foreground text-sm'>
                        Attachment
                      </span>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() =>
                          window.open(
                            selectedDeposit.proof_of_payment,
                            '_blank'
                          )
                        }
                      >
                        <ExternalLink className='mr-2 h-4 w-4' />
                        Open in new tab
                      </Button>
                    </div>
                    {selectedDeposit.proof_of_payment.match(
                      /\.(jpg|jpeg|png|gif|webp)$/i
                    ) ? (
                      <img
                        src={selectedDeposit.proof_of_payment}
                        alt='Proof of payment'
                        className='mx-auto max-h-64 max-w-full rounded object-contain'
                      />
                    ) : (
                      <div className='text-muted-foreground py-8 text-center'>
                        <Download className='mx-auto mb-2 h-8 w-8' />
                        <p>File attachment available for download</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              <div>
                <Label htmlFor='rejection-reason'>
                  Rejection Reason (if rejecting)
                </Label>
                <Textarea
                  id='rejection-reason'
                  placeholder='Enter reason for rejection...'
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className='mt-2'
                />
              </div>
            </div>
          )}

          <DialogFooter className='gap-2'>
            <Button
              variant='outline'
              onClick={() => {
                setShowReviewDialog(false);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleReject}
              disabled={!rejectionReason}
            >
              <XCircle className='mr-2 h-4 w-4' />
              Reject
            </Button>
            <Button
              onClick={() => selectedDeposit && handleApprove(selectedDeposit)}
            >
              <CheckCircle className='mr-2 h-4 w-4' />
              Approve Deposit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
