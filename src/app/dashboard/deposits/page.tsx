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
  DollarSign,
  CreditCard,
  Building,
  Wallet,
  History,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowDownRight,
  Filter,
  Search,
  Copy,
  ExternalLink,
  QrCode,
  Receipt,
  Download
} from 'lucide-react';
import { useDeposit } from '@/hooks/useDeposit';
import { usePayment } from '@/hooks/usePayment';
import {
  ManualDeposit,
  DepositMethod,
  DepositMethodItem
} from '@/stores/deposit.store';
import { useAccount } from '@/hooks/useAccount';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function DepositsPage() {
  const {
    depositMethods,
    deposits,
    getDepositMethods,
    getDeposits,
    initiateDeposit,
    calculateDepositFees,
    formatDepositAmount,
    getDepositStatusColor
  } = useDeposit();
  const { paymentMethods, getPaymentMethods } = usePayment();

  const { accounts, getAccounts } = useAccount();
  const { user } = useUser();
  const { toast } = useToast();

  const [depositData, setDepositData] = useState({
    account_id: '' as any,
    payment_method_id: '',
    amount: '',
    method: DepositMethod.bank_transfer,
    description: ''
  });

  const [fees, setFees] = useState<{
    fee: number;
    total: number;
    netAmount: number;
  } | null>(null);

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPendingOnly, setShowPendingOnly] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (depositData.amount && depositData.method) {
      calculateFees();
    }
  }, [depositData.amount, depositData.method]);

  const loadData = async () => {
    try {
      await Promise.all([
        getDepositMethods(),
        getDeposits(),
        getAccounts(),
        getPaymentMethods()
      ]);
    } catch (error) {
      console.error('Failed to load deposit data:', error);
      toast({
        title: 'Failed to load deposits',
        description: 'Please try again in a moment.',
        variant: 'destructive'
      });
    }
  };

  const getPaymentMethodType = (method: DepositMethod) => {
    switch (method) {
      case DepositMethod.bank_transfer:
      case DepositMethod.wire_transfer:
        return 'bank';
      case DepositMethod.crypto:
        return 'crypto';
      case DepositMethod.card:
        return 'card';
      case DepositMethod.paypal:
        return 'paypal';
      case DepositMethod.mobile_money:
        return 'mobile';
      default:
        return 'card';
    }
  };

  const paymentMethodsForDeposit = paymentMethods.filter(
    (method) =>
      method.type === getPaymentMethodType(depositData.method) &&
      method.status === 'active'
  );

  useEffect(() => {
    if (!paymentMethods.length) return;

    const availableMethods = paymentMethods.filter(
      (method) =>
        method.type === getPaymentMethodType(depositData.method) &&
        method.status === 'active'
    );

    if (!availableMethods.length) {
      if (depositData.payment_method_id) {
        setDepositData((prev) => ({ ...prev, payment_method_id: '' }));
      }
      return;
    }

    const existing = availableMethods.find(
      (method) => method.id === depositData.payment_method_id
    );

    if (!existing) {
      const defaultMethod =
        availableMethods.find((method) => method.is_default) ||
        availableMethods[0];
      setDepositData((prev) => ({
        ...prev,
        payment_method_id: defaultMethod?.id || ''
      }));
    }
  }, [depositData.method, depositData.payment_method_id, paymentMethods]);

  const calculateFees = async () => {
    try {
      const calculatedFees = await calculateDepositFees(
        parseFloat(depositData.amount) || 0,
        depositData.method
      );
      setFees(calculatedFees);
    } catch (error) {
      console.error('Failed to calculate fees:', error);
      toast({
        title: 'Failed to calculate fees',
        description: 'Please try again in a moment.',
        variant: 'destructive'
      });
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!depositData.payment_method_id) {
        toast({
          title: 'Payment method required',
          description: 'Select a payment method before submitting the deposit.',
          variant: 'destructive'
        });
        setIsSubmitting(false);
        return;
      }
      await initiateDeposit({
        ...depositData,
        amount: parseFloat(depositData.amount),
        currency: 'USD'
      } as any);

      setDepositData({
        account_id: '',
        payment_method_id: '',
        amount: '',
        method: DepositMethod.bank_transfer,
        description: ''
      });
      setFees(null);

      await getDeposits();
    } catch (error) {
      console.error('Deposit failed:', error);
      toast({
        title: 'Deposit failed',
        description: 'Please check your details and try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportToCsv = (rows: Record<string, any>[], filename: string) => {
    if (!rows.length) {
      toast({
        title: 'Nothing to export',
        description: 'No deposits available for export.'
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

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return <Building className='h-5 w-5' />;
      case 'card':
        return <CreditCard className='h-5 w-5' />;
      case 'crypto':
        return <Wallet className='h-5 w-5' />;
      default:
        return <DollarSign className='h-5 w-5' />;
    }
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
        return <Clock className='h-4 w-4 text-gray-500' />;
    }
  };

  const getDepositStats = () => {
    const completed = deposits.filter(
      (d: ManualDeposit) => d.status === 'completed'
    );
    const totalAmount = completed.reduce(
      (sum: number, d: ManualDeposit) => sum + parseFloat(d.amount as any),
      0
    );

    return {
      total: deposits.length,
      completed: completed.length,
      pending: deposits.filter((d: ManualDeposit) => d.status === 'pending')
        .length,
      totalAmount,
      averageAmount: completed.length > 0 ? totalAmount / completed.length : 0
    };
  };

  const filteredDeposits = deposits
    .filter((deposit: ManualDeposit) =>
      showPendingOnly ? deposit.status === 'pending' : true
    )
    .filter((deposit: ManualDeposit) =>
      !searchQuery
        ? true
        : deposit.deposit_reference
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          deposit.method?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <PageContainer
      scrollable
      pageTitle='Deposits'
      pageDescription='Add funds to your accounts using various methods'
    >
      <div className='space-y-6'>
        {/* Header with Stats */}
        <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Deposits</h1>
            <p className='text-muted-foreground'>
              {getDepositStats().total} deposits • $
              {getDepositStats().totalAmount.toLocaleString()} total
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
              <Input
                placeholder='Search deposits...'
                className='w-full pl-9 md:w-64'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Deposit Stats */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Total Deposited
                  </p>
                  <div className='text-2xl font-bold'>
                    {formatDepositAmount(getDepositStats().totalAmount, 'USD')}
                  </div>
                </div>
                <DollarSign className='h-8 w-8 text-green-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Successful</p>
                  <div className='text-2xl font-bold'>
                    {getDepositStats().completed}
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
                  <p className='text-muted-foreground text-sm'>
                    Average Deposit
                  </p>
                  <div className='text-2xl font-bold'>
                    {formatDepositAmount(
                      getDepositStats().averageAmount,
                      'USD'
                    )}
                  </div>
                </div>
                <ArrowDownRight className='h-8 w-8 text-blue-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Pending</p>
                  <div className='text-2xl font-bold'>
                    {getDepositStats().pending}
                  </div>
                </div>
                <Clock className='h-8 w-8 text-yellow-500' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Deposit Form */}
          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle>Make a Deposit</CardTitle>
              <CardDescription>
                Add funds instantly using card or bank transfer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeposit} className='space-y-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-3'>
                    <Label htmlFor='account'>To Account</Label>
                    <Select
                      value={depositData.account_id}
                      onValueChange={(value) =>
                        setDepositData({
                          ...depositData,
                          account_id: value
                        })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select account' />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            <div className='flex items-center justify-between'>
                              <span>{account.account_name}</span>
                              <span className='text-muted-foreground text-sm'>
                                {account.account_number.slice(-4)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-3'>
                    <Label htmlFor='method'>Deposit Method</Label>
                    <Select
                      value={depositData.method}
                      onValueChange={(value) =>
                        setDepositData({
                          ...depositData,
                          method: value as DepositMethod
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select method' />
                      </SelectTrigger>
                      <SelectContent>
                        {depositMethods.map((method: DepositMethodItem) => (
                          <SelectItem key={method.method} value={method.method}>
                            <div className='flex items-center gap-2'>
                              {getMethodIcon(method.method)}
                              <span>{method.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-3'>
                    <Label htmlFor='payment-method'>Payment Method</Label>
                    <Select
                      value={depositData.payment_method_id}
                      onValueChange={(value) =>
                        setDepositData({
                          ...depositData,
                          payment_method_id: value
                        })
                      }
                      disabled={!paymentMethodsForDeposit.length}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select payment method' />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethodsForDeposit.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            <div className='flex items-center justify-between gap-2'>
                              <span>{method.name}</span>
                              {method.is_default && (
                                <span className='text-muted-foreground text-xs'>
                                  Default
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!paymentMethodsForDeposit.length && (
                      <p className='text-muted-foreground text-xs'>
                        No matching payment methods found. Add one in Settings.
                      </p>
                    )}
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
                      value={depositData.amount}
                      onChange={(e) =>
                        setDepositData({
                          ...depositData,
                          amount: e.target.value
                        })
                      }
                      required
                    />
                  </div>
                </div>

                {fees && (
                  <Card className='bg-muted'>
                    <CardContent className='p-4'>
                      <div className='space-y-2 text-sm'>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>
                            Deposit Amount:
                          </span>
                          <span className='font-medium'>
                            {formatDepositAmount(
                              parseFloat(depositData.amount) || 0,
                              'USD'
                            )}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>
                            Processing Fee:
                          </span>
                          <span className='font-medium'>
                            {formatDepositAmount(fees.fee, 'USD')}
                          </span>
                        </div>
                        <div className='flex justify-between border-t pt-2'>
                          <span className='font-medium'>Total to Pay:</span>
                          <span className='font-bold'>
                            {formatDepositAmount(fees.total, 'USD')}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>
                            Net Amount Received:
                          </span>
                          <span className='font-medium text-green-600'>
                            {formatDepositAmount(fees.netAmount, 'USD')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className='space-y-3'>
                  <Label htmlFor='description'>Description (Optional)</Label>
                  <Textarea
                    id='description'
                    placeholder='Add a note for this deposit'
                    rows={2}
                    value={depositData.description}
                    onChange={(e) =>
                      setDepositData({
                        ...depositData,
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
                  {isSubmitting ? (
                    <>
                      <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className='mr-2 h-4 w-4' />
                      Deposit Now
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Deposit Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Deposit Methods</CardTitle>
              <CardDescription>Available funding options</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {depositMethods.map((method: DepositMethodItem) => (
                <div
                  key={method.method}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                    depositData.method === method.method
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() =>
                    setDepositData((prev) => ({
                      ...prev,
                      method: method.method
                    }))
                  }
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={`rounded-lg p-2 ${
                        depositData.method === method.method
                          ? 'bg-primary/10'
                          : 'bg-muted'
                      }`}
                    >
                      {getMethodIcon(method.method)}
                    </div>
                    <div>
                      <div className='font-medium'>{method.name}</div>
                      <div className='text-muted-foreground text-sm'>
                        {method.processing_time}
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='font-medium'>
                      {method.fee_percentage}% +{' '}
                      {formatDepositAmount(method.fee_fixed, 'USD')}
                    </div>
                    <div className='text-muted-foreground text-xs'>Fee</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Deposits */}
        <Card>
          <CardHeader>
            <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
              <div>
                <CardTitle>Recent Deposits</CardTitle>
                <CardDescription>
                  Your last 10 deposit transactions
                </CardDescription>
              </div>

              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  onClick={() => setShowPendingOnly((prev) => !prev)}
                >
                  <Filter className='mr-2 h-4 w-4' />
                  {showPendingOnly ? 'Show All' : 'Show Pending'}
                </Button>
                <Button
                  variant='outline'
                  onClick={() =>
                    exportToCsv(
                      filteredDeposits.map((deposit: ManualDeposit) => ({
                        id: deposit.id,
                        reference: deposit.deposit_reference,
                        method: deposit.method,
                        amount: deposit.amount,
                        currency: deposit.currency,
                        status: deposit.status,
                        created_at: deposit.created_at
                      })),
                      'deposits.csv'
                    )
                  }
                >
                  <Download className='mr-2 h-4 w-4' />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent id='deposit-history'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeposits.slice(0, 10).map((deposit: ManualDeposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell className='font-medium'>
                      {format(new Date(deposit.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        {getMethodIcon(deposit.method)}
                        <span>
                          {deposit.method.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='font-semibold'>
                      {formatDepositAmount(deposit.amount, 'USD')}
                    </TableCell>
                    <TableCell>
                      <div className='text-muted-foreground text-sm'>
                        {deposit.account?.account_number?.slice(-4) || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDepositStatusColor(deposit.status)}>
                        <div className='flex items-center gap-1'>
                          {getStatusIcon(deposit.status)}
                          {deposit.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <span className='font-mono text-sm'>
                          {deposit.deposit_reference?.slice(0, 8)}...
                        </span>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-6 w-6'
                          onClick={() =>
                            navigator.clipboard.writeText(
                              deposit.deposit_reference || ''
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
            <Button
              variant='outline'
              className='w-full'
              onClick={() =>
                document
                  .getElementById('deposit-history')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <History className='mr-2 h-4 w-4' />
              View Full History
            </Button>
          </CardFooter>
        </Card>

        {/* Quick Deposit Info */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle className='text-sm'>Instant Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground text-sm'>
                Card deposits are processed instantly and available immediately
                in your account.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-sm'>Bank Transfer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground text-sm'>
                Bank transfers typically take 1-3 business days to process with
                lower fees.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-sm'>Security Guarantee</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground text-sm'>
                All deposits are secured with bank-level encryption and fraud
                protection.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
