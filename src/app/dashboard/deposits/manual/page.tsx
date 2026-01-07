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
import { Progress } from '@/components/ui/progress';
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
  Banknote,
  Building,
  Wallet,
  Share2,
  History,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Copy,
  ExternalLink,
  Upload,
  FileText,
  Eye,
  MoreVertical,
  ArrowDownRight,
  Shield,
  QrCode,
  Download,
  Trash2,
  Edit,
  Info,
  FileCheck,
  Receipt
} from 'lucide-react';
import { useManualDeposit } from '@/hooks/useManualDeposit';
import { useAccount } from '@/hooks/useAccount';
import { useUser } from '@/hooks/useUser';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ManualDepositsPage() {
  const {
    deposits,
    companyAccount,
    selectedMethod,
    selectedCurrency,
    isLoading,
    error,
    createManualDeposit,
    uploadProof,
    getDeposits,
    getCompanyAccountDetails,
    getDepositById,
    getDepositsByStatus,
    getDepositsByMethod,
    formatCurrency,
    getStatusColor,
    getStatusText,
    getMethodText,
    validateFile,
    copyCompanyAccountDetails,
    quickBankTransfer,
    quickCryptoDeposit,
    setSelectedMethod,
    setSelectedCurrency,
    clearDeposits
  } = useManualDeposit();

  const { accounts, getAccounts } = useAccount();
  const { user } = useUser();

  const [depositData, setDepositData] = useState({
    amount: '',
    account_id: '',
    sender_name: user ? `${user.first_name} ${user.last_name}` : '',
    sender_bank: '',
    sender_account: '',
    additional_notes: '',
    crypto_address: '',
    crypto_transaction_hash: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [uploadNotes, setUploadNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedMethod && selectedCurrency) {
      loadCompanyAccountDetails();
    }
  }, [selectedMethod, selectedCurrency]);

  const loadData = async () => {
    try {
      await Promise.all([getDeposits(), getAccounts()]);
    } catch (error: any) {
      console.error('Failed to load data:', error);
      toast.error(error.message || 'Failed to load data');
    }
  };

  const loadCompanyAccountDetails = async () => {
    try {
      await getCompanyAccountDetails(selectedMethod, selectedCurrency);
    } catch (error: any) {
      console.error('Failed to load company account:', error);
      toast.error(error.message || 'Failed to load company account details');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFile(file);
      if (validation.valid) {
        setSelectedFile(file);
        toast.success('File selected successfully');
      } else {
        toast.error(validation.errors.join(', '));
        e.target.value = '';
      }
    }
  };

  const handleUploadProof = async () => {
    if (!selectedFile || !selectedDeposit) {
      toast.error('Please select a file');
      return;
    }

    try {
      setUploadProgress(30);

      await uploadProof(selectedDeposit.id, selectedFile, uploadNotes);

      setUploadProgress(100);

      toast.success(
        'Proof uploaded successfully. Your deposit is now awaiting confirmation.'
      );
      setShowProofDialog(false);
      setSelectedFile(null);
      setUploadNotes('');
      setUploadProgress(0);

      await getDeposits();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload proof');
      console.error(error);
    }
  };

  const handleCreateDeposit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!depositData.amount || !depositData.account_id) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const amount = parseFloat(depositData.amount);

      let deposit;
      if (selectedMethod === 'bank_transfer') {
        deposit = await quickBankTransfer(amount, depositData.account_id, {
          sender_name: depositData.sender_name,
          sender_bank: depositData.sender_bank,
          sender_account: depositData.sender_account,
          additional_notes: depositData.additional_notes
        });
      } else if (selectedMethod === 'crypto') {
        deposit = await quickCryptoDeposit(amount, depositData.account_id, {
          crypto_address: depositData.crypto_address,
          crypto_transaction_hash: depositData.crypto_transaction_hash,
          additional_notes: depositData.additional_notes as any
        });
      } else {
        toast.error('Unsupported deposit method');
        return;
      }

      toast.success('Deposit request created successfully');
      setShowDepositDialog(false);
      resetForm();
      await getDeposits();

      // Load company account details again for the new deposit
      await loadCompanyAccountDetails();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create deposit request');
      console.error(error);
    }
  };

  const resetForm = () => {
    setDepositData({
      amount: '',
      account_id: '',
      sender_name: user ? `${user.first_name} ${user.last_name}` : '',
      sender_bank: '',
      sender_account: '',
      additional_notes: '',
      crypto_address: '',
      crypto_transaction_hash: ''
    });
    setSelectedFile(null);
  };

  const getFilteredDeposits = () => {
    let filtered = deposits;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (deposit) =>
          deposit.sender_name?.toLowerCase().includes(query) ||
          deposit.deposit_reference?.toLowerCase().includes(query) ||
          deposit.account?.account_number?.toLowerCase().includes(query) ||
          deposit.amount.toString().includes(query)
      );
    }

    if (activeTab !== 'all') {
      filtered = filtered.filter((deposit) => deposit.status === activeTab);
    }

    return filtered;
  };

  const getDepositStats = () => {
    return {
      total: deposits.length,
      pending: deposits.filter((d) => d.status === 'pending').length,
      awaiting: deposits.filter(
        (d) =>
          d.status === 'awaiting_confirmation' || d.status === 'awaiting_proof'
      ).length,
      completed: deposits.filter(
        (d) => d.status === 'completed' || d.status === 'confirmed'
      ).length,
      totalAmount: deposits
        .filter((d) => d.status === 'completed' || d.status === 'confirmed')
        .reduce((sum, d) => sum + d.amount, 0)
    };
  };

  const copyAccountDetails = async () => {
    const success = await copyCompanyAccountDetails();
    if (success) {
      toast.success('Account details copied to clipboard');
    } else {
      toast.error('Failed to copy account details');
    }
  };

  const downloadReceipt = async (depositId: string) => {
    const deposit = getDepositById(depositId);
    if (deposit?.receipt_url) {
      window.open(deposit.receipt_url, '_blank');
    } else {
      toast.error('No receipt available for this deposit');
    }
  };

  const shareDeposit = async (depositId: string) => {
    const deposit = getDepositById(depositId);
    if (deposit) {
      const text = `Deposit Reference: ${deposit.deposit_reference}\nAmount: ${formatCurrency(deposit.amount)}\nStatus: ${getStatusText(deposit.status)}`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Deposit Details',
            text: text
          });
          toast.success('Deposit details shared');
        } catch (error) {
          console.error('Share failed:', error);
          // Fallback to clipboard
          await navigator.clipboard.writeText(text);
          toast.success('Deposit details copied to clipboard');
        }
      } else {
        await navigator.clipboard.writeText(text);
        toast.success('Deposit details copied to clipboard');
      }
    }
  };

  return (
    <PageContainer
      scrollable
      pageTitle='Manual Deposits'
      pageDescription='Deposit funds by transferring to our company account and uploading proof'
    >
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Manual Deposits
            </h1>
            <p className='text-muted-foreground'>
              {getDepositStats().total} requests -{' '}
              {formatCurrency(getDepositStats().totalAmount)} total deposited
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <Button variant='outline' onClick={() => clearDeposits()}>
              <Trash2 className='mr-2 h-4 w-4' />
              Clear All
            </Button>
            <Button onClick={() => setShowDepositDialog(true)}>
              <ArrowDownRight className='mr-2 h-4 w-4' />
              New Deposit
            </Button>
          </div>
        </div>

        {/* Deposit Methods */}
        <Tabs
          value={selectedMethod}
          onValueChange={setSelectedMethod}
          className='w-full'
        >
          <TabsList className='mb-6'>
            <TabsTrigger value='bank_transfer'>
              <Building className='mr-2 h-4 w-4' />
              Bank Transfer
            </TabsTrigger>
            <TabsTrigger value='crypto'>
              <Wallet className='mr-2 h-4 w-4' />
              Cryptocurrency
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedMethod} className='space-y-6'>
            {/* Company Account Details */}
            <Card>
              <CardHeader>
                <CardTitle>Company Account Details</CardTitle>
                <CardDescription>
                  Transfer funds to this account and upload proof of payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {companyAccount ? (
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <Label>Currency</Label>
                        <Select
                          value={selectedCurrency}
                          onValueChange={setSelectedCurrency}
                        >
                          <SelectTrigger className='w-40'>
                            <SelectValue placeholder='Select currency' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='USD'>USD</SelectItem>
                            <SelectItem value='EUR'>EUR</SelectItem>
                            <SelectItem value='GBP'>GBP</SelectItem>
                            <SelectItem value='BTC'>BTC</SelectItem>
                            <SelectItem value='ETH'>ETH</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={copyAccountDetails} variant='outline'>
                        <Copy className='mr-2 h-4 w-4' />
                        Copy Details
                      </Button>
                    </div>

                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <div className='space-y-3'>
                        <h3 className='font-semibold'>Account Information</h3>
                        {companyAccount.account_name && (
                          <div>
                            <Label className='text-muted-foreground text-sm'>
                              Account Name
                            </Label>
                            <div className='font-medium'>
                              {companyAccount.account_name}
                            </div>
                          </div>
                        )}
                        {companyAccount.account_number && (
                          <div>
                            <Label className='text-muted-foreground text-sm'>
                              Account Number
                            </Label>
                            <div className='font-mono font-medium'>
                              {companyAccount.account_number}
                            </div>
                          </div>
                        )}
                        {companyAccount.bank_name && (
                          <div>
                            <Label className='text-muted-foreground text-sm'>
                              Bank Name
                            </Label>
                            <div className='font-medium'>
                              {companyAccount.bank_name}
                            </div>
                          </div>
                        )}
                        {companyAccount.swift_code && (
                          <div>
                            <Label className='text-muted-foreground text-sm'>
                              SWIFT Code
                            </Label>
                            <div className='font-mono font-medium'>
                              {companyAccount.swift_code}
                            </div>
                          </div>
                        )}
                        {companyAccount.wallet_address && (
                          <div>
                            <Label className='text-muted-foreground text-sm'>
                              Wallet Address
                            </Label>
                            <div className='font-mono text-sm break-all'>
                              {companyAccount.wallet_address}
                            </div>
                          </div>
                        )}
                        {companyAccount.network && (
                          <div>
                            <Label className='text-muted-foreground text-sm'>
                              Network
                            </Label>
                            <div className='font-medium'>
                              {companyAccount.network}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className='space-y-3'>
                        <h3 className='font-semibold'>Transfer Instructions</h3>
                        {companyAccount.instructions &&
                          companyAccount.instructions.length > 0 && (
                            <div className='space-y-2'>
                              {companyAccount.instructions.map(
                                (instruction, index) => (
                                  <div
                                    key={index}
                                    className='flex items-start gap-2'
                                  >
                                    <Info className='mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500' />
                                    <span className='text-sm'>
                                      {instruction}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        <div className='text-muted-foreground text-sm'>
                          After making the transfer, upload proof of payment
                          using the "Upload Proof" button.
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='py-8 text-center'>
                    <Shield className='text-muted-foreground mx-auto mb-3 h-12 w-12' />
                    <p className='text-muted-foreground'>
                      Loading account details...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deposit Stats */}
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              <Card>
                <CardContent className='pt-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-muted-foreground text-sm'>
                        Total Requests
                      </p>
                      <div className='text-2xl font-bold'>
                        {getDepositStats().total}
                      </div>
                    </div>
                    <Banknote className='h-8 w-8 text-blue-500' />
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

              <Card>
                <CardContent className='pt-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-muted-foreground text-sm'>
                        Awaiting Proof
                      </p>
                      <div className='text-2xl font-bold'>
                        {getDepositStats().awaiting}
                      </div>
                    </div>
                    <AlertCircle className='h-8 w-8 text-orange-500' />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='pt-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-muted-foreground text-sm'>Completed</p>
                      <div className='text-2xl font-bold'>
                        {getDepositStats().completed}
                      </div>
                    </div>
                    <CheckCircle2 className='h-8 w-8 text-green-500' />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Deposits Table */}
            <Card>
              <CardHeader>
                <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
                  <div>
                    <CardTitle>Deposit Requests</CardTitle>
                    <CardDescription>
                      Track your manual deposit requests
                    </CardDescription>
                  </div>

                  <div className='flex w-full items-center gap-2 md:w-auto'>
                    <div className='relative flex-1 md:flex-none'>
                      <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                      <Input
                        placeholder='Search deposits...'
                        className='w-full pl-9 md:w-64'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className='w-full md:w-auto'
                    >
                      <TabsList>
                        <TabsTrigger value='all'>All</TabsTrigger>
                        <TabsTrigger value='pending'>Pending</TabsTrigger>
                        <TabsTrigger value='awaiting_confirmation'>
                          Awaiting
                        </TabsTrigger>
                        <TabsTrigger value='completed'>Completed</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredDeposits().length > 0 ? (
                      getFilteredDeposits().map((deposit) => (
                        <TableRow key={deposit.id}>
                          <TableCell className='font-medium'>
                            {format(
                              new Date(deposit.created_at),
                              'MMM d, yyyy'
                            )}
                          </TableCell>
                          <TableCell>
                            <div className='font-mono text-sm'>
                              {deposit.deposit_reference}
                            </div>
                          </TableCell>
                          <TableCell className='font-semibold'>
                            {formatCurrency(deposit.amount, 'USD')}
                          </TableCell>
                          <TableCell>
                            <Badge variant='outline'>
                              {getMethodText(deposit.method)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className='text-muted-foreground text-sm'>
                              {deposit.account?.account_number || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(deposit.status)}>
                              {getStatusText(deposit.status)}
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
                                <DropdownMenuItem
                                  onClick={() => setSelectedDeposit(deposit)}
                                >
                                  <Eye className='mr-2 h-4 w-4' />
                                  View Details
                                </DropdownMenuItem>

                                {(deposit.status === 'pending' ||
                                  deposit.status ===
                                    'awaiting_confirmation') && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedDeposit(deposit);
                                      setShowProofDialog(true);
                                    }}
                                  >
                                    <Upload className='mr-2 h-4 w-4' />
                                    Upload Proof
                                  </DropdownMenuItem>
                                )}

                                {deposit.receipt_url && (
                                  <DropdownMenuItem
                                    onClick={() => downloadReceipt(deposit.id)}
                                  >
                                    <Receipt className='mr-2 h-4 w-4' />
                                    Download Receipt
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuItem
                                  onClick={() => shareDeposit(deposit.id)}
                                >
                                  <Share2 className='mr-2 h-4 w-4' />
                                  Share Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className='py-12 text-center'>
                          <Banknote className='text-muted-foreground mx-auto mb-3 h-12 w-12' />
                          <p className='text-muted-foreground'>
                            No deposit requests found
                          </p>
                          <Button
                            className='mt-3'
                            onClick={() => setShowDepositDialog(true)}
                          >
                            Create Deposit Request
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Deposit Dialog */}
      <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>New Deposit Request</DialogTitle>
            <DialogDescription>
              Fill out the form to create a new deposit request
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateDeposit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='amount'>Amount *</Label>
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
                    setDepositData({ ...depositData, amount: e.target.value })
                  }
                  required
                  min='1'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='account'>To Account *</Label>
              <Select
                value={depositData.account_id}
                onValueChange={(value) =>
                  setDepositData({ ...depositData, account_id: value })
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

            {selectedMethod === 'bank_transfer' && (
              <>
                <div className='space-y-2'>
                  <Label htmlFor='sender_bank'>Your Bank Name</Label>
                  <Input
                    id='sender_bank'
                    placeholder='e.g., Chase Bank'
                    value={depositData.sender_bank}
                    onChange={(e) =>
                      setDepositData({
                        ...depositData,
                        sender_bank: e.target.value
                      })
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='sender_account'>Your Account Number</Label>
                  <Input
                    id='sender_account'
                    placeholder='Last 4 digits'
                    value={depositData.sender_account}
                    onChange={(e) =>
                      setDepositData({
                        ...depositData,
                        sender_account: e.target.value
                      })
                    }
                  />
                </div>
              </>
            )}

            {selectedMethod === 'crypto' && (
              <>
                <div className='space-y-2'>
                  <Label htmlFor='crypto_address'>
                    From Crypto Address (Optional)
                  </Label>
                  <Input
                    id='crypto_address'
                    placeholder='0x...'
                    value={depositData.crypto_address}
                    onChange={(e) =>
                      setDepositData({
                        ...depositData,
                        crypto_address: e.target.value
                      })
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='crypto_transaction_hash'>
                    Transaction Hash (Optional)
                  </Label>
                  <Input
                    id='crypto_transaction_hash'
                    placeholder='Transaction ID'
                    value={depositData.crypto_transaction_hash}
                    onChange={(e) =>
                      setDepositData({
                        ...depositData,
                        crypto_transaction_hash: e.target.value
                      })
                    }
                  />
                </div>
              </>
            )}

            <div className='space-y-2'>
              <Label htmlFor='additional_notes'>
                Additional Notes (Optional)
              </Label>
              <Textarea
                id='additional_notes'
                placeholder='Add any additional information...'
                rows={3}
                value={depositData.additional_notes}
                onChange={(e) =>
                  setDepositData({
                    ...depositData,
                    additional_notes: e.target.value
                  })
                }
              />
            </div>

            <div className='rounded-lg border border-blue-200 bg-blue-50 p-3'>
              <div className='mb-1 flex items-center gap-2'>
                <Info className='h-4 w-4 text-blue-600' />
                <span className='text-sm font-medium text-blue-800'>
                  Important
                </span>
              </div>
              <p className='text-xs text-blue-700'>
                After submitting this request, transfer the funds to the company
                account shown above and upload proof of payment.
              </p>
            </div>

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Deposit Request'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Proof Dialog */}
      <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Payment Proof</DialogTitle>
            <DialogDescription>
              Upload proof of payment for deposit:{' '}
              {selectedDeposit?.deposit_reference}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            {selectedDeposit && (
              <div className='space-y-2 rounded-lg bg-gray-50 p-4'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground text-sm'>Amount:</span>
                  <span className='font-bold'>
                    {formatCurrency(selectedDeposit.amount)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground text-sm'>Method:</span>
                  <span>{getMethodText(selectedDeposit.method)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    Reference:
                  </span>
                  <span className='font-mono text-sm'>
                    {selectedDeposit.deposit_reference}
                  </span>
                </div>
              </div>
            )}

            <div className='rounded-lg border-2 border-dashed border-gray-300 p-6 text-center'>
              <Upload className='mx-auto mb-3 h-12 w-12 text-gray-400' />
              <p className='mb-3 text-sm text-gray-600'>
                Upload screenshot or receipt of your payment
              </p>
              <Input
                type='file'
                accept='image/*,.pdf'
                onChange={handleFileSelect}
                className='cursor-pointer'
              />
              <p className='mt-2 text-xs text-gray-500'>
                Supported: JPG, PNG, GIF, WEBP, PDF (Max 5MB)
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='upload-notes'>Additional Notes (Optional)</Label>
              <Textarea
                id='upload-notes'
                placeholder='Add any notes about this proof...'
                rows={2}
                value={uploadNotes}
                onChange={(e) => setUploadNotes(e.target.value)}
              />
            </div>

            {selectedFile && (
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>
                    {selectedFile.name}
                  </span>
                  <span className='text-sm text-gray-500'>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <Progress value={uploadProgress} className='h-2' />
                )}
              </div>
            )}

            <Button
              onClick={handleUploadProof}
              className='w-full'
              disabled={!selectedFile || uploadProgress > 0}
            >
              {uploadProgress > 0 ? (
                <>
                  <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className='mr-2 h-4 w-4' />
                  Upload Proof
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deposit Details Dialog */}
      {selectedDeposit && (
        <Dialog
          open={!!selectedDeposit}
          onOpenChange={() => setSelectedDeposit(null)}
        >
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Deposit Details</DialogTitle>
              <DialogDescription>
                Complete information for deposit{' '}
                {selectedDeposit.deposit_reference}
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-6'>
              {/* Basic Info */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-muted-foreground text-sm'>
                    Reference Number
                  </Label>
                  <div className='font-mono'>
                    {selectedDeposit.deposit_reference}
                  </div>
                </div>
                <div>
                  <Label className='text-muted-foreground text-sm'>
                    Date Created
                  </Label>
                  <div>
                    {format(new Date(selectedDeposit.created_at), 'PPP p')}
                  </div>
                </div>
                <div>
                  <Label className='text-muted-foreground text-sm'>
                    Amount
                  </Label>
                  <div className='text-lg font-bold'>
                    {formatCurrency(selectedDeposit.amount)}
                  </div>
                </div>
                <div>
                  <Label className='text-muted-foreground text-sm'>
                    Status
                  </Label>
                  <Badge className={getStatusColor(selectedDeposit.status)}>
                    {getStatusText(selectedDeposit.status)}
                  </Badge>
                </div>
              </div>

              {/* Account Info */}
              <div className='border-t pt-4'>
                <h4 className='mb-3 font-semibold'>Account Information</h4>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label className='text-muted-foreground text-sm'>
                      Deposit Method
                    </Label>
                    <div className='font-medium'>
                      {getMethodText(selectedDeposit.method)}
                    </div>
                  </div>
                  <div>
                    <Label className='text-muted-foreground text-sm'>
                      To Account
                    </Label>
                    <div>
                      <div className='font-medium'>
                        {selectedDeposit.account?.account_name}
                      </div>
                      <div className='text-muted-foreground text-sm'>
                        {selectedDeposit.account?.account_number}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transfer Details */}
              <div className='border-t pt-4'>
                <h4 className='mb-3 font-semibold'>Transfer Details</h4>
                {(selectedDeposit.sender_name ||
                  selectedDeposit.sender_bank ||
                  selectedDeposit.sender_account) && (
                  <div className='grid grid-cols-2 gap-4'>
                    {selectedDeposit.sender_name && (
                      <div>
                        <Label className='text-muted-foreground text-sm'>
                          Sender Name
                        </Label>
                        <div>{selectedDeposit.sender_name}</div>
                      </div>
                    )}
                    {selectedDeposit.sender_bank && (
                      <div>
                        <Label className='text-muted-foreground text-sm'>
                          Sender Bank
                        </Label>
                        <div>{selectedDeposit.sender_bank}</div>
                      </div>
                    )}
                    {selectedDeposit.sender_account && (
                      <div>
                        <Label className='text-muted-foreground text-sm'>
                          Sender Account
                        </Label>
                        <div>{selectedDeposit.sender_account}</div>
                      </div>
                    )}
                  </div>
                )}

                {selectedDeposit.confirmed_at && (
                  <div className='mt-3'>
                    <Label className='text-muted-foreground text-sm'>
                      Confirmed At
                    </Label>
                    <div>
                      {format(new Date(selectedDeposit.confirmed_at), 'PPP p')}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className='flex justify-end gap-3 border-t pt-4'>
                {selectedDeposit.receipt_url && (
                  <Button
                    variant='outline'
                    onClick={() => downloadReceipt(selectedDeposit.id)}
                  >
                    <Receipt className='mr-2 h-4 w-4' />
                    Download Receipt
                  </Button>
                )}
                {(selectedDeposit.status === 'pending' ||
                  selectedDeposit.status === 'awaiting_confirmation') && (
                  <Button
                    onClick={() => {
                      setSelectedDeposit(null);
                      setShowProofDialog(true);
                    }}
                  >
                    <Upload className='mr-2 h-4 w-4' />
                    Upload Proof
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </PageContainer>
  );
}
