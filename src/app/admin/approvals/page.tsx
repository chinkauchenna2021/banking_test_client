'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { Search, MoreHorizontal } from 'lucide-react';
import type { ApprovalQueueItem } from '@/stores/admin.store';

type ApprovalAction = 'approve' | 'reject' | 'hold' | 'cancel';

const actionCopy: Record<
  ApprovalAction,
  { title: string; description: string; confirm: string }
> = {
  approve: {
    title: 'Approve request?',
    description: 'This will finalize the approval and process the item.',
    confirm: 'Approve'
  },
  reject: {
    title: 'Decline request?',
    description: 'This will decline the request and mark it as rejected.',
    confirm: 'Decline'
  },
  hold: {
    title: 'Place request on hold?',
    description: 'This will move the request to on-hold status.',
    confirm: 'Place on hold'
  },
  cancel: {
    title: 'Cancel request?',
    description: 'This will cancel the request and remove it from the queue.',
    confirm: 'Cancel request'
  }
};

export default function AdminApprovalsPage() {
  const {
    approvalQueue,
    getApprovalQueue,
    processApproval,
    isLoading,
    formatDate
  } = useAdmin();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('transfer');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] =
    useState<ApprovalQueueItem | null>(null);
  const [actionType, setActionType] = useState<ApprovalAction>('approve');
  const [notes, setNotes] = useState('');

  const buildFilters = useCallback(() => {
    const params: Record<string, string> = {};
    if (typeFilter !== 'all') params.type = typeFilter;
    if (statusFilter !== 'all') params.status = statusFilter;
    if (priorityFilter !== 'all') params.priority = priorityFilter;
    return params;
  }, [typeFilter, statusFilter, priorityFilter]);

  useEffect(() => {
    getApprovalQueue(buildFilters());
  }, [getApprovalQueue, buildFilters]);

  const openDialog = (approval: ApprovalQueueItem, action: ApprovalAction) => {
    setSelectedApproval(approval);
    setActionType(action);
    setNotes('');
    setDialogOpen(true);
  };

  const handleProcess = async () => {
    if (!selectedApproval) return;

    try {
      await processApproval(
        selectedApproval.id,
        actionType,
        notes || undefined
      );
      await getApprovalQueue(buildFilters());
      toast({
        title: 'Approval updated',
        description: `Request has been ${actionType}.`
      });
    } catch (error: any) {
      toast({
        title: 'Failed to update approval',
        description: error?.message || 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setDialogOpen(false);
      setSelectedApproval(null);
      setNotes('');
    }
  };

  const filteredApprovals = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return approvalQueue;

    return approvalQueue.filter((item) => {
      const userInfo = item.user
        ? `${item.user.first_name} ${item.user.last_name} ${item.user.email} ${item.user.account_number}`.toLowerCase()
        : '';

      return (
        item.description.toLowerCase().includes(query) ||
        item.model_id.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        userInfo.includes(query)
      );
    });
  }, [approvalQueue, searchTerm]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      case 'on_hold':
        return 'outline';
      case 'cancelled':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <PageContainer
      scrollable
      pageTitle='Approval Queue'
      pageDescription='Review and action transfer and transaction approvals'
    >
      <div className='space-y-6'>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <div className='relative w-full md:w-96'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
            <Input
              placeholder='Search approvals...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-9'
            />
          </div>
          <div className='flex w-full flex-wrap gap-2 md:w-auto'>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className='w-[160px]'>
                <SelectValue placeholder='Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='transfer'>Transfers</SelectItem>
                <SelectItem value='deposit'>Deposits</SelectItem>
                <SelectItem value='withdrawal'>Withdrawals</SelectItem>
                <SelectItem value='user_registration'>User KYC</SelectItem>
                <SelectItem value='account_opening'>Account Opening</SelectItem>
                <SelectItem value='limit_increase'>Limit Increase</SelectItem>
                <SelectItem value='other'>Other</SelectItem>
                <SelectItem value='all'>All Types</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[160px]'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='approved'>Approved</SelectItem>
                <SelectItem value='rejected'>Rejected</SelectItem>
                <SelectItem value='on_hold'>On Hold</SelectItem>
                <SelectItem value='cancelled'>Cancelled</SelectItem>
                <SelectItem value='all'>All Statuses</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className='w-[160px]'>
                <SelectValue placeholder='Priority' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Priorities</SelectItem>
                <SelectItem value='urgent'>Urgent</SelectItem>
                <SelectItem value='high'>High</SelectItem>
                <SelectItem value='normal'>Normal</SelectItem>
                <SelectItem value='low'>Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='rounded-md border bg-white dark:bg-slate-900'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && filteredApprovals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-8 text-center'>
                    Loading approvals...
                  </TableCell>
                </TableRow>
              ) : filteredApprovals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-8 text-center'>
                    No approvals found
                  </TableCell>
                </TableRow>
              ) : (
                filteredApprovals.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className='text-muted-foreground'>
                      {formatDate(item.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline' className='capitalize'>
                        {item.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm font-medium'>
                        {item.user
                          ? `${item.user.first_name} ${item.user.last_name}`
                          : 'System'}
                      </div>
                      <div className='text-muted-foreground text-xs'>
                        {item.user?.email || item.model_id}
                      </div>
                    </TableCell>
                    <TableCell className='max-w-[320px] truncate text-sm'>
                      {item.description}
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityClass(item.priority)}>
                        {item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(item.status)}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            disabled={item.status !== 'pending'}
                          >
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() => openDialog(item, 'approve')}
                          >
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDialog(item, 'reject')}
                          >
                            Decline
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDialog(item, 'hold')}
                          >
                            Hold
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDialog(item, 'cancel')}
                          >
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionCopy[actionType].title}</AlertDialogTitle>
            <AlertDialogDescription>
              {actionCopy[actionType].description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='space-y-2'>
            <Label htmlFor='approval-notes'>Notes (optional)</Label>
            <Textarea
              id='approval-notes'
              placeholder='Add a note for the audit log...'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction onClick={handleProcess}>
              {actionCopy[actionType].confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}
