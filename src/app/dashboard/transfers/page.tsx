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
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
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
  Send,
  Clock,
  History,
  Repeat,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Filter,
  Search,
  Copy,
  ExternalLink,
  Plus,
  Download
} from 'lucide-react';
import { useTransfer } from '@/hooks/useTransfer';
import { UserTransfer } from '@/stores/transfer.store';
import { useAccount } from '@/hooks/useAccount';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function TransfersPage() {
  const {
    transfers,
    scheduledTransfers,
    getTransfers,
    getScheduledTransfers,
    quickTransfer,
    quickScheduleTransfer,
    cancelScheduledTransfer,
    formatCurrency,
    formatTransferDate
  } = useTransfer();

  const { accounts, getAccounts } = useAccount();
  const { user } = useUser();
  const { toast } = useToast();

  const [transferData, setTransferData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
    transactionPin: '',
    recipientBank: '',
    recipientAddress: '',
    recipientRoutingNumber: ''
  });

  const [scheduleData, setScheduleData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
    transactionPin: '',
    scheduledFor: new Date(),
    frequency: 'once'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        getTransfers(),
        getScheduledTransfers(),
        getAccounts()
      ]);
    } catch (error) {
      console.error('Failed to load transfer data:', error);
      toast({
        title: 'Failed to load transfers',
        description: 'Please try again in a moment.',
        variant: 'destructive'
      });
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await quickTransfer(
        BigInt(transferData.fromAccount),
        transferData.toAccount,
        parseFloat(transferData.amount),
        transferData.description,
        transferData.transactionPin,
        transferData.recipientBank,
        transferData.recipientAddress,
        transferData.recipientRoutingNumber
      );

      // Reset form
      setTransferData({
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: '',
        transactionPin: '',
        recipientBank: '',
        recipientAddress: '',
        recipientRoutingNumber: ''
      });

      await getTransfers();
    } catch (error) {
      console.error('Transfer failed:', error);
      toast({
        title: 'Transfer failed',
        description: 'Please check your details and try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await quickScheduleTransfer(
        BigInt(scheduleData.fromAccount),
        scheduleData.toAccount,
        parseFloat(scheduleData.amount),
        scheduleData.scheduledFor,
        scheduleData.description,
        scheduleData.transactionPin
      );

      setShowScheduleDialog(false);
      setScheduleData({
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: '',
        transactionPin: '',
        scheduledFor: new Date(),
        frequency: 'once'
      });

      await getScheduledTransfers();
    } catch (error) {
      console.error('Schedule failed:', error);
      toast({
        title: 'Scheduling failed',
        description: 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelScheduled = async (transferId: string) => {
    try {
      await cancelScheduledTransfer(transferId);
      toast({
        title: 'Transfer cancelled',
        description: 'Scheduled transfer has been cancelled.'
      });
      await getScheduledTransfers();
    } catch (error: any) {
      toast({
        title: 'Failed to cancel transfer',
        description: error?.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const exportToCsv = (rows: Record<string, any>[], filename: string) => {
    if (!rows.length) {
      toast({
        title: 'Nothing to export',
        description: 'No transfers available for export.'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className='h-4 w-4 text-green-500' />;
      case 'pending':
        return <Clock className='h-4 w-4 text-yellow-500' />;
      case 'failed':
        return <XCircle className='h-4 w-4 text-red-500' />;
      default:
        return <AlertCircle className='h-4 w-4 text-gray-500' />;
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

  const getTransferStats = () => {
    const completed = transfers.filter(
      (t: UserTransfer) => t.status === 'completed'
    );
    const totalAmount = completed.reduce(
      (sum: number, t: UserTransfer) => sum + parseFloat(t.amount as any),
      0
    );

    return {
      total: transfers.length,
      completed: completed.length,
      pending: transfers.filter((t: UserTransfer) => t.status === 'pending')
        .length,
      totalAmount,
      successRate:
        transfers.length > 0 ? (completed.length / transfers.length) * 100 : 0
    };
  };

  const filteredTransfers = transfers.filter((transfer: UserTransfer) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      transfer.transfer_reference?.toLowerCase().includes(query) ||
      transfer.description?.toLowerCase().includes(query) ||
      transfer.recipient_bank?.toLowerCase().includes(query) ||
      transfer.recipient_routing_number?.toLowerCase().includes(query)
    );
  });

  return (
    <PageContainer
      scrollable
      pageTitle='Transfers'
      pageDescription='Send money between accounts or schedule future transfers'
    >
      <div className='space-y-6'>
        {/* Header with Stats */}
        <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Transfers</h1>
            <p className='text-muted-foreground'>
              {getTransferStats().total} transfers • $
              {getTransferStats().totalAmount.toLocaleString()} total
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <Dialog
              open={showScheduleDialog}
              onOpenChange={setShowScheduleDialog}
            >
              <DialogTrigger asChild>
                <Button variant='outline'>
                  <Calendar className='mr-2 h-4 w-4' />
                  Schedule Transfer
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-md'>
                <DialogHeader>
                  <DialogTitle>Schedule Transfer</DialogTitle>
                  <DialogDescription>
                    Set up a future transfer between accounts
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleScheduleTransfer} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='schedule-from'>From Account</Label>
                    <Select
                      value={scheduleData.fromAccount}
                      onValueChange={(value) =>
                        setScheduleData({
                          ...scheduleData,
                          fromAccount: value
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select source account' />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.account_name} (
                            {formatCurrency(
                              Number(account.balance),
                              account.currency
                            )}
                            )
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='schedule-to'>To Account</Label>
                    <Input
                      id='schedule-to'
                      placeholder='Recipient account number'
                      value={scheduleData.toAccount}
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          toAccount: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='schedule-amount'>Amount</Label>
                      <Input
                        id='schedule-amount'
                        type='number'
                        step='0.01'
                        placeholder='0.00'
                        value={scheduleData.amount}
                        onChange={(e) =>
                          setScheduleData({
                            ...scheduleData,
                            amount: e.target.value
                          })
                        }
                        required
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='schedule-date'>Date</Label>
                      <Input
                        id='schedule-date'
                        type='date'
                        value={format(scheduleData.scheduledFor, 'yyyy-MM-dd')}
                        onChange={(e) =>
                          setScheduleData({
                            ...scheduleData,
                            scheduledFor: new Date(e.target.value)
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='schedule-frequency'>Frequency</Label>
                    <Select
                      value={scheduleData.frequency}
                      onValueChange={(value) =>
                        setScheduleData({
                          ...scheduleData,
                          frequency: value
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select frequency' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='once'>Once</SelectItem>
                        <SelectItem value='daily'>Daily</SelectItem>
                        <SelectItem value='weekly'>Weekly</SelectItem>
                        <SelectItem value='monthly'>Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='schedule-description'>Description</Label>
                    <Input
                      id='schedule-description'
                      placeholder='Optional description'
                      value={scheduleData.description}
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          description: e.target.value
                        })
                      }
                    />
                  </div>

                  <Button
                    type='submit'
                    className='w-full'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Scheduling...' : 'Schedule Transfer'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Button
              onClick={() =>
                document
                  .getElementById('transfer-form')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <Send className='mr-2 h-4 w-4' />
              New Transfer
            </Button>
          </div>
        </div>

        {/* Transfer Stats */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Total Transfers
                  </p>
                  <div className='text-2xl font-bold'>
                    {getTransferStats().total}
                  </div>
                </div>
                <Send className='h-8 w-8 text-blue-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Completed</p>
                  <div className='text-2xl font-bold'>
                    {getTransferStats().completed}
                  </div>
                </div>
                <CheckCircle2 className='h-8 w-8 text-green-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Total Amount</p>
                  <div className='text-2xl font-bold'>
                    {formatCurrency(getTransferStats().totalAmount, 'USD')}
                  </div>
                </div>
                <ArrowUpRight className='h-8 w-8 text-purple-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Success Rate</p>
                  <div className='text-2xl font-bold'>
                    {getTransferStats().successRate.toFixed(1)}%
                  </div>
                </div>
                <CheckCircle2 className='h-8 w-8 text-green-500' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue='send' className='w-full'>
          <TabsList className='mb-6 grid grid-cols-2'>
            <TabsTrigger value='send'>Send Money</TabsTrigger>
            <TabsTrigger value='history'>Transfer History</TabsTrigger>
          </TabsList>

          <TabsContent value='send'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
              {/* Transfer Form */}
              <Card className='lg:col-span-2' id='transfer-form'>
                <CardHeader>
                  <CardTitle>Make a Transfer</CardTitle>
                  <CardDescription>
                    Transfer money between your accounts or to other recipients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTransfer} className='space-y-6'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <div className='space-y-3'>
                        <Label htmlFor='fromAccount'>From Account</Label>
                        <Select
                          value={transferData.fromAccount}
                          onValueChange={(value) =>
                            setTransferData({
                              ...transferData,
                              fromAccount: value
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select source account' />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                <div className='flex items-center justify-between'>
                                  <span>{account.account_name}</span>
                                  <span className='text-muted-foreground text-sm'>
                                    {formatCurrency(
                                      Number(account.balance),
                                      account.currency
                                    )}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className='space-y-3'>
                        <Label htmlFor='toAccount'>To Account</Label>
                        <Input
                          id='toAccount'
                          placeholder='Recipient account number'
                          value={transferData.toAccount}
                          onChange={(e) =>
                            setTransferData({
                              ...transferData,
                              toAccount: e.target.value
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    {/* ADD THE THREE NEW INPUTS HERE */}
                    <div className='space-y-4 rounded-lg border p-4'>
                      <h3 className='font-medium'>
                        Recipient Bank Details (Optional)
                      </h3>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div className='space-y-2'>
                          <Label htmlFor='recipientBank'>Bank Name</Label>
                          <Input
                            id='recipientBank'
                            placeholder='e.g., Chase Bank, Bank of America'
                            value={transferData.recipientBank}
                            onChange={(e) =>
                              setTransferData({
                                ...transferData,
                                recipientBank: e.target.value
                              })
                            }
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='recipientRoutingNumber'>
                            Routing Number
                          </Label>
                          <Input
                            id='recipientRoutingNumber'
                            placeholder='e.g., 021000021'
                            value={transferData.recipientRoutingNumber}
                            onChange={(e) =>
                              setTransferData({
                                ...transferData,
                                recipientRoutingNumber: e.target.value
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='recipientAddress'>Bank Address</Label>
                        <Textarea
                          id='recipientAddress'
                          placeholder='Full bank address (street, city, state, zip)'
                          rows={2}
                          value={transferData.recipientAddress}
                          onChange={(e) =>
                            setTransferData({
                              ...transferData,
                              recipientAddress: e.target.value
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <Label htmlFor='amount'>Amount</Label>
                      <div className='relative'>
                        <span className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform'>
                          $
                        </span>
                        <Input
                          id='amount'
                          type='number'
                          step='0.01'
                          placeholder='0.00'
                          className='pl-8'
                          value={transferData.amount}
                          onChange={(e) =>
                            setTransferData({
                              ...transferData,
                              amount: e.target.value
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <Label htmlFor='description'>
                        Description (Optional)
                      </Label>
                      <Textarea
                        id='description'
                        placeholder='Add a note for this transfer'
                        rows={3}
                        value={transferData.description}
                        onChange={(e) =>
                          setTransferData({
                            ...transferData,
                            description: e.target.value
                          })
                        }
                      />
                    </div>

                    <div className='space-y-3'>
                      <Label htmlFor='transactionPin'>Transaction PIN</Label>
                      <Input
                        id='transactionPin'
                        type='password'
                        placeholder='Enter your 4-digit PIN'
                        maxLength={4}
                        value={transferData.transactionPin}
                        onChange={(e) =>
                          setTransferData({
                            ...transferData,
                            transactionPin: e.target.value
                              .replace(/\D/g, '')
                              .slice(0, 4)
                          })
                        }
                        required
                      />
                      <p className='text-muted-foreground text-xs'>
                        Enter the 4-digit PIN you use for transactions
                      </p>
                    </div>

                    <Button
                      type='submit'
                      className='w-full'
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className='mr-2 h-4 w-4' />
                          Send Now
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Scheduled Transfers */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Calendar className='h-5 w-5' />
                    Scheduled Transfers
                  </CardTitle>
                  <CardDescription>Upcoming transfers</CardDescription>
                </CardHeader>
                <CardContent>
                  {scheduledTransfers.length > 0 ? (
                    <div className='space-y-4'>
                      {scheduledTransfers
                        .slice(0, 3)
                        .map((transfer: UserTransfer) => (
                          <div
                            key={transfer.id}
                            className='flex items-center justify-between rounded-lg border p-3'
                          >
                            <div>
                              <div className='font-medium'>
                                {formatCurrency(
                                  transfer.amount,
                                  transfer.currency
                                )}
                              </div>
                              <div className='text-muted-foreground text-sm'>
                                {format(
                                  new Date(transfer.scheduled_for!),
                                  'MMM d, yyyy'
                                )}
                              </div>
                            </div>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleCancelScheduled(transfer.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ))}

                      {scheduledTransfers.length > 3 && (
                        <Button variant='outline' className='w-full'>
                          View All ({scheduledTransfers.length})
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className='py-6 text-center'>
                      <Clock className='text-muted-foreground mx-auto mb-3 h-12 w-12' />
                      <p className='text-muted-foreground'>
                        No scheduled transfers
                      </p>
                      <Button
                        variant='outline'
                        className='mt-3'
                        onClick={() => setShowScheduleDialog(true)}
                      >
                        <Plus className='mr-2 h-4 w-4' />
                        Schedule Transfer
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='history'>
            <Card>
              <CardHeader>
                <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
                  <div>
                    <CardTitle>Transfer History</CardTitle>
                    <CardDescription>
                      All your transfer transactions
                    </CardDescription>
                  </div>

                  <div className='flex w-full items-center gap-2 md:w-auto'>
                    <div className='relative flex-1 md:flex-none'>
                      <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                      <Input
                        placeholder='Search transfers...'
                        className='w-full pl-9 md:w-64'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button
                      variant='outline'
                      onClick={() =>
                        exportToCsv(
                          filteredTransfers.map((transfer: UserTransfer) => ({
                            id: transfer.id,
                            reference: transfer.transfer_reference,
                            amount: transfer.amount,
                            currency: transfer.currency,
                            status: transfer.status,
                            description: transfer.description,
                            created_at: transfer.created_at
                          })),
                          'transfers.csv'
                        )
                      }
                    >
                      <Download className='mr-2 h-4 w-4' />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>From/To</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Bank Details</TableHead>{' '}
                      {/* ADDED THIS COLUMN */}
                      <TableHead className='text-right'>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransfers
                      .slice(0, 10)
                      .map((transfer: UserTransfer) => (
                        <TableRow key={transfer.id}>
                          <TableCell className='font-medium'>
                            {formatTransferDate(transfer.created_at)}
                          </TableCell>
                          <TableCell>
                            {transfer.description || 'Transfer'}
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center gap-2'>
                              {transfer.sender_account_id ? (
                                <ArrowUpRight className='h-4 w-4 text-red-500' />
                              ) : (
                                <ArrowDownRight className='h-4 w-4 text-green-500' />
                              )}
                              <span className='max-w-[120px] truncate'>
                                {transfer.sender_account_id
                                  ? 'Outgoing'
                                  : 'Incoming'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className='font-semibold'>
                            {formatCurrency(transfer.amount, transfer.currency)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant='outline'
                              className={getStatusColor(transfer.status)}
                            >
                              <div className='flex items-center gap-1'>
                                {getStatusIcon(transfer.status)}
                                {transfer.status}
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {transfer.recipient_bank && (
                              <div className='text-muted-foreground text-sm'>
                                <div className='font-medium'>
                                  {transfer.recipient_bank}
                                </div>
                                {transfer.recipient_routing_number && (
                                  <div className='text-xs'>
                                    Routing: {transfer.recipient_routing_number}
                                  </div>
                                )}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className='text-right'>
                            <div className='flex items-center justify-end gap-2'>
                              <span className='font-mono text-sm'>
                                {transfer.transfer_reference?.slice(0, 8)}...
                              </span>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-6 w-6'
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    transfer.transfer_reference || ''
                                  )
                                }
                              >
                                <Copy className='h-3 w-3' />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full'>
                  <History className='mr-2 h-4 w-4' />
                  View Full History
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
