'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { Search, Download, Pencil } from 'lucide-react';

export default function AdminTransactionsPage() {
  const {
    transactions,
    getTransactions,
    updateTransactionTimestamps,
    transactionStats,
    isLoading,
    formatDate
  } = useAdmin();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [timestampForm, setTimestampForm] = useState({
    created_at: '',
    completed_at: '',
    approved_at: '',
    updated_at: '',
    reason: ''
  });
  const [timestampBaseline, setTimestampBaseline] = useState({
    created_at: '',
    completed_at: '',
    approved_at: '',
    updated_at: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  const toLocalInput = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const openEditDialog = (tx: any) => {
    const baseline = {
      created_at: toLocalInput(tx.created_at),
      completed_at: toLocalInput(tx.completed_at),
      approved_at: toLocalInput(tx.approved_at),
      updated_at: toLocalInput(tx.updated_at)
    };
    setEditingTransaction(tx);
    setTimestampBaseline(baseline);
    setTimestampForm({
      ...baseline,
      reason: ''
    });
  };

  const closeEditDialog = () => {
    setEditingTransaction(null);
    setTimestampForm({
      created_at: '',
      completed_at: '',
      approved_at: '',
      updated_at: '',
      reason: ''
    });
    setTimestampBaseline({
      created_at: '',
      completed_at: '',
      approved_at: '',
      updated_at: ''
    });
  };

  const parseAndCompare = (value: string, baseline: string, label: string) => {
    if (!value || value === baseline) return undefined;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error(`Invalid ${label} value`);
    }
    return parsed.toISOString();
  };

  const handleSaveTimestamps = async () => {
    if (!editingTransaction) return;
    try {
      const payload: Record<string, any> = {};
      const createdAt = parseAndCompare(
        timestampForm.created_at,
        timestampBaseline.created_at,
        'created_at'
      );
      const completedAt = parseAndCompare(
        timestampForm.completed_at,
        timestampBaseline.completed_at,
        'completed_at'
      );
      const approvedAt = parseAndCompare(
        timestampForm.approved_at,
        timestampBaseline.approved_at,
        'approved_at'
      );
      const updatedAt = parseAndCompare(
        timestampForm.updated_at,
        timestampBaseline.updated_at,
        'updated_at'
      );

      if (createdAt) payload.created_at = createdAt;
      if (completedAt) payload.completed_at = completedAt;
      if (approvedAt) payload.approved_at = approvedAt;
      if (updatedAt) payload.updated_at = updatedAt;
      if (timestampForm.reason.trim()) {
        payload.reason = timestampForm.reason.trim();
      }

      if (Object.keys(payload).length === 0) {
        toast({
          title: 'No changes',
          description: 'Update at least one timestamp before saving.'
        });
        return;
      }

      setIsSaving(true);
      await updateTransactionTimestamps(editingTransaction.id, payload);
      toast({
        title: 'Transaction updated',
        description: 'Timestamps saved successfully.'
      });
      closeEditDialog();
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update timestamps.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Basic client-side filtering based on the provided hook data
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      searchTerm === '' ||
      tx.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.user_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const exportToCsv = (rows: Record<string, any>[], filename: string) => {
    if (!rows.length) {
      toast({
        title: 'Nothing to export',
        description: 'No transactions available for export.'
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

  return (
    <PageContainer
      scrollable
      pageTitle='Platform Transactions'
      pageDescription='Monitor all financial activities across the system'
    >
      <div className='space-y-6'>
        {/* Stats Row */}
        <div className='grid gap-4 md:grid-cols-4'>
          <div className='rounded-lg border bg-white p-4 dark:bg-slate-900'>
            <p className='text-muted-foreground text-sm font-medium'>
              Total Volume
            </p>
            <p className='text-2xl font-bold'>
              ${transactionStats.totalAmount.toLocaleString()}
            </p>
          </div>
          <div className='rounded-lg border bg-white p-4 dark:bg-slate-900'>
            <p className='text-muted-foreground text-sm font-medium'>
              Total Fees
            </p>
            <p className='text-2xl font-bold text-green-600'>
              +${transactionStats.totalFees.toLocaleString()}
            </p>
          </div>
          <div className='rounded-lg border bg-white p-4 dark:bg-slate-900'>
            <p className='text-muted-foreground text-sm font-medium'>
              Success Rate
            </p>
            <p className='text-2xl font-bold'>
              {transactionStats.successRate.toFixed(1)}%
            </p>
          </div>
          <div className='rounded-lg border bg-white p-4 dark:bg-slate-900'>
            <p className='text-muted-foreground text-sm font-medium'>Pending</p>
            <p className='text-2xl font-bold text-yellow-600'>
              {transactionStats.pending}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <div className='relative w-full md:w-96'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
            <Input
              placeholder='Search by reference or user ID...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-9'
            />
          </div>
          <div className='flex w-full gap-2 md:w-auto'>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[150px]'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='failed'>Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className='w-[150px]'>
                <SelectValue placeholder='Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Types</SelectItem>
                <SelectItem value='transfer'>Transfer</SelectItem>
                <SelectItem value='deposit'>Deposit</SelectItem>
                <SelectItem value='withdrawal'>Withdrawal</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant='outline'
              size='icon'
              onClick={() =>
                exportToCsv(
                  filteredTransactions.map((tx) => ({
                    id: tx.id,
                    reference: tx.reference,
                    user_id: tx.user_id,
                    type: tx.type,
                    status: tx.status,
                    amount: tx.amount,
                    fee: tx.charge,
                    currency: tx.currency,
                    created_at: tx.created_at
                  })),
                  'admin-transactions.csv'
                )
              }
            >
              <Download className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className='rounded-md border bg-white dark:bg-slate-900'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className='py-8 text-center'>
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className='py-8 text-center'>
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className='text-muted-foreground'>
                      {formatDate(tx.created_at)}
                    </TableCell>
                    <TableCell className='font-mono text-sm'>
                      {tx.reference}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs'>
                          {tx.user_id.slice(0, 2).toUpperCase()}
                        </div>
                        <span className='text-sm'>{tx.user_id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline' className='capitalize'>
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className='font-medium'>
                      ${parseFloat(tx.amount).toLocaleString()}
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      ${parseFloat(tx.charge).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(tx.status)}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => openEditDialog(tx)}
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog
        open={!!editingTransaction}
        onOpenChange={(open) => {
          if (!open) closeEditDialog();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Transaction Timestamps</DialogTitle>
            <DialogDescription>
              {editingTransaction
                ? `Reference: ${editingTransaction.reference}`
                : 'Edit timestamps'}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>Created At</Label>
              <Input
                type='datetime-local'
                value={timestampForm.created_at}
                onChange={(e) =>
                  setTimestampForm({
                    ...timestampForm,
                    created_at: e.target.value
                  })
                }
              />
            </div>
            <div>
              <Label>Completed At</Label>
              <Input
                type='datetime-local'
                value={timestampForm.completed_at}
                onChange={(e) =>
                  setTimestampForm({
                    ...timestampForm,
                    completed_at: e.target.value
                  })
                }
              />
            </div>
            <div>
              <Label>Approved At</Label>
              <Input
                type='datetime-local'
                value={timestampForm.approved_at}
                onChange={(e) =>
                  setTimestampForm({
                    ...timestampForm,
                    approved_at: e.target.value
                  })
                }
              />
            </div>
            <div>
              <Label>Updated At</Label>
              <Input
                type='datetime-local'
                value={timestampForm.updated_at}
                onChange={(e) =>
                  setTimestampForm({
                    ...timestampForm,
                    updated_at: e.target.value
                  })
                }
              />
            </div>
            <div>
              <Label>Reason (optional)</Label>
              <Input
                placeholder='Add a note for audit logs'
                value={timestampForm.reason}
                onChange={(e) =>
                  setTimestampForm({
                    ...timestampForm,
                    reason: e.target.value
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveTimestamps} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
