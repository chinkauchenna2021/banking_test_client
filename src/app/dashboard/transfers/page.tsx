'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
    formatCurrency,
    formatTransferDate 
  } = useTransfer();
  
  const { accounts, getAccounts } = useAccount();
  const { user } = useUser();
  
  const [transferData, setTransferData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
    transactionPin: ''
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
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await quickTransfer(
        transferData.fromAccount,
        transferData.toAccount,
        parseFloat(transferData.amount),
        transferData.description,
        transferData.transactionPin
      );
      
      // Reset form
      setTransferData({
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: '',
        transactionPin: ''
      });
      
      await getTransfers();
      
    } catch (error) {
      console.error('Transfer failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await quickScheduleTransfer(
        scheduleData.fromAccount,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransferStats = () => {
    const completed = transfers.filter((t: UserTransfer) => t.status === 'completed');
    const totalAmount = completed.reduce((sum: number, t: UserTransfer) => sum + parseFloat(t.amount as any), 0);
    
    return {
      total: transfers.length,
      completed: completed.length,
      pending: transfers.filter((t: UserTransfer) => t.status === 'pending').length,
      totalAmount,
      successRate: transfers.length > 0 ? (completed.length / transfers.length) * 100 : 0
    };
  };

  return (
    <PageContainer
      scrollable
      pageTitle="Transfers"
      pageDescription="Send money between accounts or schedule future transfers"
    >
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transfers</h1>
            <p className="text-muted-foreground">
              {getTransferStats().total} transfers • ${getTransferStats().totalAmount.toLocaleString()} total
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Transfer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Schedule Transfer</DialogTitle>
                  <DialogDescription>
                    Set up a future transfer between accounts
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleScheduleTransfer} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-from">From Account</Label>
                    <Select
                      value={scheduleData.fromAccount}
                      onValueChange={(value) => setScheduleData({
                        ...scheduleData,
                        fromAccount: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.account_name} ({formatCurrency(Number(account.balance), account.currency)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schedule-to">To Account</Label>
                    <Input
                      id="schedule-to"
                      placeholder="Recipient account number"
                      value={scheduleData.toAccount}
                      onChange={(e) => setScheduleData({
                        ...scheduleData,
                        toAccount: e.target.value
                      })}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="schedule-amount">Amount</Label>
                      <Input
                        id="schedule-amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={scheduleData.amount}
                        onChange={(e) => setScheduleData({
                          ...scheduleData,
                          amount: e.target.value
                        })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="schedule-date">Date</Label>
                      <Input
                        id="schedule-date"
                        type="date"
                        value={format(scheduleData.scheduledFor, 'yyyy-MM-dd')}
                        onChange={(e) => setScheduleData({
                          ...scheduleData,
                          scheduledFor: new Date(e.target.value)
                        })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schedule-frequency">Frequency</Label>
                    <Select
                      value={scheduleData.frequency}
                      onValueChange={(value) => setScheduleData({
                        ...scheduleData,
                        frequency: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Once</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schedule-description">Description</Label>
                    <Input
                      id="schedule-description"
                      placeholder="Optional description"
                      value={scheduleData.description}
                      onChange={(e) => setScheduleData({
                        ...scheduleData,
                        description: e.target.value
                      })}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Scheduling...' : 'Schedule Transfer'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            
            <Button>
              <Send className="h-4 w-4 mr-2" />
              New Transfer
            </Button>
          </div>
        </div>

        {/* Transfer Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Transfers</p>
                  <div className="text-2xl font-bold">{getTransferStats().total}</div>
                </div>
                <Send className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <div className="text-2xl font-bold">{getTransferStats().completed}</div>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <div className="text-2xl font-bold">
                    {formatCurrency(getTransferStats().totalAmount, 'USD')}
                  </div>
                </div>
                <ArrowUpRight className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <div className="text-2xl font-bold">
                    {getTransferStats().successRate.toFixed(1)}%
                  </div>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="send" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="send">Send Money</TabsTrigger>
            <TabsTrigger value="history">Transfer History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="send">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Transfer Form */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Make a Transfer</CardTitle>
                  <CardDescription>
                    Transfer money between your accounts or to other recipients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTransfer} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="fromAccount">From Account</Label>
                        <Select
                          value={transferData.fromAccount}
                          onValueChange={(value) => setTransferData({
                            ...transferData,
                            fromAccount: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select source account" />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                <div className="flex items-center justify-between">
                                  <span>{account.account_name}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {formatCurrency(Number(account.balance), account.currency)}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="toAccount">To Account</Label>
                        <Input
                          id="toAccount"
                          placeholder="Recipient account number"
                          value={transferData.toAccount}
                          onChange={(e) => setTransferData({
                            ...transferData,
                            toAccount: e.target.value
                          })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="amount">Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8"
                          value={transferData.amount}
                          onChange={(e) => setTransferData({
                            ...transferData,
                            amount: e.target.value
                          })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Add a note for this transfer"
                        rows={3}
                        value={transferData.description}
                        onChange={(e) => setTransferData({
                          ...transferData,
                          description: e.target.value
                        })}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="transactionPin">Transaction PIN</Label>
                      <Input
                        id="transactionPin"
                        type="password"
                        placeholder="Enter your 4-digit PIN"
                        maxLength={4}
                        value={transferData.transactionPin}
                        onChange={(e) => setTransferData({
                          ...transferData,
                          transactionPin: e.target.value.replace(/\D/g, '').slice(0, 4)
                        })}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter the 4-digit PIN you use for transactions
                      </p>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
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
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Scheduled Transfers
                  </CardTitle>
                  <CardDescription>Upcoming transfers</CardDescription>
                </CardHeader>
                <CardContent>
                  {scheduledTransfers.length > 0 ? (
                    <div className="space-y-4">
                      {scheduledTransfers.slice(0, 3).map((transfer: UserTransfer) => (
                        <div key={transfer.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">
                              {formatCurrency(transfer.amount, transfer.currency)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(transfer.scheduled_for!), 'MMM d, yyyy')}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Cancel
                          </Button>
                        </div>
                      ))}
                      
                      {scheduledTransfers.length > 3 && (
                        <Button variant="outline" className="w-full">
                          View All ({scheduledTransfers.length})
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No scheduled transfers</p>
                      <Button 
                        variant="outline" 
                        className="mt-3"
                        onClick={() => setShowScheduleDialog(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Transfer
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>Transfer History</CardTitle>
                    <CardDescription>All your transfer transactions</CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search transfers..."
                        className="pl-9 w-full md:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
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
                      <TableHead className="text-right">Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transfers.slice(0, 10).map((transfer: UserTransfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell className="font-medium">
                          {formatTransferDate(transfer.created_at)}
                        </TableCell>
                        <TableCell>
                          {transfer.description || 'Transfer'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {transfer.sender_account_id ? (
                              <ArrowUpRight className="h-4 w-4 text-red-500" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-green-500" />
                            )}
                            <span className="truncate max-w-[120px]">
                              {transfer.sender_account_id ? 'Outgoing' : 'Incoming'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(transfer.amount, transfer.currency)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(transfer.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(transfer.status)}
                              {transfer.status}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="font-mono text-sm">
                              {transfer.transfer_reference?.slice(0, 8)}...
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => navigator.clipboard.writeText(transfer.transfer_reference || '')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <History className="h-4 w-4 mr-2" />
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