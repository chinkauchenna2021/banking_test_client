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
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  Download,
  Search,
  Printer,
  Eye,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
  QrCode,
  Copy,
  Mail,
  BarChart3,
  RefreshCw,
  FileUp,
  Scan,
  DollarSign
} from 'lucide-react';
import { useReceipt } from '@/hooks/useReceipt';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

export default function ReceiptsPage() {
  const {
    receipts,
    getReceipts,
    generateReceipt,
    downloadReceiptAsPDF,
    resendReceipt,
    verifyReceipt,
    formatReceiptAmount,
    formatReceiptDate,
    isReceiptExpired,
    isReceiptVerified,
    exportReceiptsToCSV
  } = useReceipt();

  const { toast } = useToast();

  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [verifyData, setVerifyData] = useState({
    receipt_number: '',
    verification_code: ''
  });

  const [generateData, setGenerateData] = useState({
    transaction_id: '',
    type: 'payment',
    notes: ''
  });

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      await getReceipts();
    } catch (error) {
      console.error('Failed to load receipts:', error);
      toast({
        title: 'Failed to load receipts',
        description: 'Please try again in a moment.',
        variant: 'destructive'
      });
    }
  };

  const handleVerifyReceipt = async () => {
    try {
      await verifyReceipt(
        verifyData.receipt_number,
        verifyData.verification_code
      );
      toast({
        title: 'Receipt verified',
        description: 'Receipt authenticity confirmed.'
      });
      setShowVerifyDialog(false);
      setVerifyData({ receipt_number: '', verification_code: '' });
      await getReceipts();
    } catch (error: any) {
      toast({
        title: 'Verification failed',
        description:
          error?.message || 'Please check the details and try again.',
        variant: 'destructive'
      });
    }
  };

  const handleGenerateReceipt = async () => {
    if (!generateData.transaction_id) {
      toast({
        title: 'Transaction ID required',
        description: 'Enter the transaction ID to generate a receipt.',
        variant: 'destructive'
      });
      return;
    }

    try {
      await generateReceipt({
        transaction_id: generateData.transaction_id,
        type: generateData.type,
        notes: generateData.notes
      });
      toast({
        title: 'Receipt generated',
        description: 'Your receipt is now available.'
      });
      setShowGenerateDialog(false);
      setGenerateData({ transaction_id: '', type: 'payment', notes: '' });
      await getReceipts();
    } catch (error: any) {
      toast({
        title: 'Generation failed',
        description: error?.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const receiptTableId = 'receipt-details-table';

  const handleDownloadReceipt = async (receipt: any) => {
    try {
      await downloadReceiptAsPDF(receipt.id);
      toast({
        title: 'Receipt downloaded',
        description: `Receipt ${receipt.receipt_number} saved as PDF.`
      });
    } catch (error: any) {
      toast({
        title: 'Download failed',
        description: error?.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handlePrintReceipt = async (receipt: any) => {
    try {
      await downloadReceiptAsPDF(receipt.id);
      toast({
        title: 'Receipt ready to print',
        description: 'Open the downloaded PDF to print your receipt.'
      });
    } catch (error: any) {
      toast({
        title: 'Print failed',
        description: error?.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleEmailReceipt = async (receipt: any) => {
    try {
      await resendReceipt(receipt.id);
      toast({
        title: 'Receipt emailed',
        description: `Receipt ${receipt.receipt_number} sent to your email.`
      });
    } catch (error: any) {
      toast({
        title: 'Email failed',
        description: error?.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleViewAllReceipts = () => {
    const element = document.getElementById(receiptTableId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleUploadReceipts = () => {
    toast({
      title: 'Upload unavailable',
      description: 'Receipt uploads are not enabled yet.'
    });
  };

  const handlePrintBatch = () => {
    if (!filteredReceipts.length) {
      toast({
        title: 'Nothing to print',
        description: 'No receipts available.'
      });
      return;
    }

    toast({
      title: 'Batch print ready',
      description: 'Export receipts to PDF to print them in bulk.'
    });
  };

  const handleScanQr = () => {
    toast({
      title: 'Scan unavailable',
      description: 'QR scanning is not enabled yet.'
    });
  };

  const exportReceipts = (receiptsToExport: any[], filename: string) => {
    const csv = exportReceiptsToCSV(receiptsToExport);
    if (!csv) {
      toast({
        title: 'Nothing to export',
        description: 'No receipts available.'
      });
      return;
    }

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

  const handleBulkVerify = async () => {
    const pendingReceipts = receipts.filter((receipt) => !receipt.is_verified);
    if (!pendingReceipts.length) {
      toast({
        title: 'No pending receipts',
        description: 'All receipts are already verified.'
      });
      return;
    }

    try {
      await Promise.all(
        pendingReceipts.map((receipt) =>
          verifyReceipt(receipt.receipt_number, receipt.verification_code)
        )
      );
      toast({
        title: 'Bulk verification complete',
        description: `${pendingReceipts.length} receipts verified.`
      });
      await getReceipts();
    } catch (error: any) {
      toast({
        title: 'Bulk verification failed',
        description: error?.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const getStatusIcon = (receipt: any) => {
    if (isReceiptVerified(receipt)) {
      return <CheckCircle2 className='h-4 w-4 text-green-500' />;
    }
    if (isReceiptExpired(receipt)) {
      return <XCircle className='h-4 w-4 text-red-500' />;
    }
    return <Clock className='h-4 w-4 text-yellow-500' />;
  };

  const getStatusColor = (receipt: any) => {
    if (isReceiptVerified(receipt)) {
      return 'bg-green-100 text-green-800';
    }
    if (isReceiptExpired(receipt)) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (receipt: any) => {
    if (isReceiptVerified(receipt)) {
      return 'Verified';
    }
    if (isReceiptExpired(receipt)) {
      return 'Expired';
    }
    return 'Pending';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'bg-blue-100 text-blue-800';
      case 'deposit':
        return 'bg-green-100 text-green-800';
      case 'withdrawal':
        return 'bg-red-100 text-red-800';
      case 'transfer':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReceiptStats = () => {
    const verified = receipts.filter((r) => isReceiptVerified(r));
    const totalAmount = receipts.reduce(
      (sum, r) => sum + parseFloat(r.amount),
      0
    );

    return {
      total: receipts.length,
      verified: verified.length,
      expired: receipts.filter((r) => isReceiptExpired(r)).length,
      totalAmount,
      averageAmount: receipts.length > 0 ? totalAmount / receipts.length : 0
    };
  };

  const filteredReceipts = receipts.filter((receipt) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      receipt.receipt_number?.toLowerCase().includes(query) ||
      receipt.transaction_id?.toLowerCase().includes(query) ||
      receipt.type?.toLowerCase().includes(query)
    );
  });

  const verifiedReceipts = filteredReceipts.filter((receipt) =>
    isReceiptVerified(receipt)
  );
  const expiredReceipts = filteredReceipts.filter((receipt) =>
    isReceiptExpired(receipt)
  );
  const pendingReceipts = filteredReceipts.filter(
    (receipt) => !isReceiptVerified(receipt) && !isReceiptExpired(receipt)
  );

  const renderReceiptList = (list: any[]) => {
    if (!list.length) {
      return (
        <div className='py-12 text-center'>
          <FileText className='text-muted-foreground mx-auto mb-3 h-12 w-12' />
          <p className='text-muted-foreground'>No receipts found</p>
        </div>
      );
    }

    return list.slice(0, 5).map((receipt) => (
      <div
        key={receipt.id}
        className='flex items-center justify-between rounded-lg border p-4'
      >
        <div className='flex items-center gap-4'>
          <div className={`rounded-lg p-2 ${getTypeColor(receipt.type)}`}>
            <FileText className='h-6 w-6' />
          </div>
          <div>
            <h4 className='font-medium'>{receipt.receipt_number}</h4>
            <p className='text-muted-foreground text-sm'>
              {formatReceiptDate(receipt.issued_at)}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <div className='text-right'>
            <div className='font-bold'>
              {formatReceiptAmount(
                parseFloat(receipt.amount),
                receipt.currency
              )}
            </div>
            <Badge className={getStatusColor(receipt)}>
              <div className='flex items-center gap-1'>
                {getStatusIcon(receipt)}
                {getStatusText(receipt)}
              </div>
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => setSelectedReceipt(receipt)}>
                <Eye className='mr-2 h-4 w-4' />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadReceipt(receipt)}>
                <Download className='mr-2 h-4 w-4' />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrintReceipt(receipt)}>
                <Printer className='mr-2 h-4 w-4' />
                Print Receipt
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    ));
  };

  return (
    <PageContainer
      scrollable
      pageTitle='Receipts'
      pageDescription='View, download, and manage your transaction receipts'
    >
      <div className='space-y-6'>
        {/* Header with Stats */}
        <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Receipts</h1>
            <p className='text-muted-foreground'>
              {getReceiptStats().total} receipts - $
              {getReceiptStats().totalAmount.toLocaleString()} total
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
              <DialogTrigger asChild>
                <Button variant='outline'>
                  <CheckCircle2 className='mr-2 h-4 w-4' />
                  Verify Receipt
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Verify Receipt</DialogTitle>
                  <DialogDescription>
                    Verify the authenticity of a receipt using its verification
                    code
                  </DialogDescription>
                </DialogHeader>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='receipt-number'>Receipt Number</Label>
                    <Input
                      id='receipt-number'
                      placeholder='Enter receipt number'
                      value={verifyData.receipt_number}
                      onChange={(e) =>
                        setVerifyData({
                          ...verifyData,
                          receipt_number: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='verification-code'>Verification Code</Label>
                    <Input
                      id='verification-code'
                      placeholder='Enter verification code'
                      value={verifyData.verification_code}
                      onChange={(e) =>
                        setVerifyData({
                          ...verifyData,
                          verification_code: e.target.value
                        })
                      }
                    />
                  </div>

                  <Button className='w-full' onClick={handleVerifyReceipt}>
                    Verify Receipt
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={showGenerateDialog}
              onOpenChange={setShowGenerateDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <FileText className='mr-2 h-4 w-4' />
                  Generate Receipt
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate Receipt</DialogTitle>
                  <DialogDescription>
                    Create a receipt for a transaction
                  </DialogDescription>
                </DialogHeader>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='transaction-id'>Transaction ID</Label>
                    <Input
                      id='transaction-id'
                      placeholder='Enter transaction ID'
                      value={generateData.transaction_id}
                      onChange={(e) =>
                        setGenerateData({
                          ...generateData,
                          transaction_id: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label>Receipt Type</Label>
                    <Select
                      value={generateData.type}
                      onValueChange={(value) =>
                        setGenerateData({
                          ...generateData,
                          type: value
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='payment'>Payment</SelectItem>
                        <SelectItem value='deposit'>Deposit</SelectItem>
                        <SelectItem value='withdrawal'>Withdrawal</SelectItem>
                        <SelectItem value='transfer'>Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='flex justify-end gap-3'>
                  <Button
                    variant='outline'
                    onClick={() => setShowGenerateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleGenerateReceipt}>
                    Generate Receipt
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Receipt Stats */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Total Receipts
                  </p>
                  <div className='text-2xl font-bold'>
                    {getReceiptStats().total}
                  </div>
                </div>
                <FileText className='h-8 w-8 text-blue-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Verified</p>
                  <div className='text-2xl font-bold'>
                    {getReceiptStats().verified}
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
                    ${getReceiptStats().totalAmount.toLocaleString()}
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
                  <p className='text-muted-foreground text-sm'>Expired</p>
                  <div className='text-2xl font-bold'>
                    {getReceiptStats().expired}
                  </div>
                </div>
                <XCircle className='h-8 w-8 text-red-500' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Receipts List */}
          <Card className='lg:col-span-2'>
            <CardHeader>
              <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
                <div>
                  <CardTitle>Your Receipts</CardTitle>
                  <CardDescription>
                    {filteredReceipts.length} receipts found
                  </CardDescription>
                </div>

                <div className='flex w-full items-center gap-2 md:w-auto'>
                  <div className='relative flex-1 md:flex-none'>
                    <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                    <Input
                      placeholder='Search receipts...'
                      className='w-full pl-9 md:w-64'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue='all'>
                <TabsList className='mb-6'>
                  <TabsTrigger value='all'>All Receipts</TabsTrigger>
                  <TabsTrigger value='verified'>Verified</TabsTrigger>
                  <TabsTrigger value='pending'>Pending</TabsTrigger>
                  <TabsTrigger value='expired'>Expired</TabsTrigger>
                </TabsList>

                <TabsContent value='all' className='space-y-4'>
                  {renderReceiptList(filteredReceipts)}
                </TabsContent>
                <TabsContent value='verified' className='space-y-4'>
                  {renderReceiptList(verifiedReceipts)}
                </TabsContent>
                <TabsContent value='pending' className='space-y-4'>
                  {renderReceiptList(pendingReceipts)}
                </TabsContent>
                <TabsContent value='expired' className='space-y-4'>
                  {renderReceiptList(expiredReceipts)}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button
                variant='outline'
                className='w-full'
                onClick={handleViewAllReceipts}
              >
                <Eye className='mr-2 h-4 w-4' />
                View All Receipts
              </Button>
            </CardFooter>
          </Card>

          {/* Receipt Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Receipt Tools</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() => exportReceipts(filteredReceipts, 'receipts.csv')}
              >
                <BarChart3 className='mr-2 h-4 w-4' />
                Export All Receipts
              </Button>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={handleBulkVerify}
              >
                <RefreshCw className='mr-2 h-4 w-4' />
                Bulk Verify
              </Button>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={handleUploadReceipts}
              >
                <FileUp className='mr-2 h-4 w-4' />
                Upload Receipts
              </Button>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={handlePrintBatch}
              >
                <Printer className='mr-2 h-4 w-4' />
                Print Batch
              </Button>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={handleScanQr}
              >
                <Scan className='mr-2 h-4 w-4' />
                Scan QR Code
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Receipt Details Table */}
        <Card id={receiptTableId}>
          <CardHeader>
            <CardTitle>Receipt Details</CardTitle>
            <CardDescription>
              Detailed view of all your receipts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verification Code</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.slice(0, 10).map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className='font-medium'>
                      {receipt.receipt_number}
                    </TableCell>
                    <TableCell>
                      {formatReceiptDate(receipt.issued_at)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={getTypeColor(receipt.type)}
                      >
                        {receipt.type}
                      </Badge>
                    </TableCell>
                    <TableCell className='font-semibold'>
                      {formatReceiptAmount(
                        parseFloat(receipt.amount),
                        receipt.currency
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(receipt)}>
                        {getStatusText(receipt)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <span className='font-mono'>
                          {receipt.verification_code}
                        </span>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-6 w-6'
                          onClick={() =>
                            navigator.clipboard.writeText(
                              receipt.verification_code || ''
                            )
                          }
                        >
                          <Copy className='h-3 w-3' />
                        </Button>
                      </div>
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
                            onClick={() => setSelectedReceipt(receipt)}
                          >
                            <Eye className='mr-2 h-4 w-4' />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownloadReceipt(receipt)}
                          >
                            <Download className='mr-2 h-4 w-4' />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePrintReceipt(receipt)}
                          >
                            <Printer className='mr-2 h-4 w-4' />
                            Print
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEmailReceipt(receipt)}
                          >
                            <Mail className='mr-2 h-4 w-4' />
                            Email
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
      </div>

      {/* Receipt Details Dialog */}
      {selectedReceipt && (
        <Dialog
          open={!!selectedReceipt}
          onOpenChange={() => setSelectedReceipt(null)}
        >
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Receipt Details</DialogTitle>
              <DialogDescription>
                Detailed view of receipt {selectedReceipt.receipt_number}
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-6'>
              {/* Receipt Header */}
              <div className='border-b pb-4'>
                <div className='flex items-start justify-between'>
                  <div>
                    <div className='text-2xl font-bold'>
                      {selectedReceipt.receipt_number}
                    </div>
                    <div className='text-muted-foreground'>
                      {selectedReceipt.description}
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-3xl font-bold'>
                      {formatReceiptAmount(
                        parseFloat(selectedReceipt.amount),
                        selectedReceipt.currency
                      )}
                    </div>
                    <div className='text-muted-foreground text-sm'>
                      {formatReceiptDate(selectedReceipt.issued_at)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Receipt Details */}
              <div className='grid grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <div>
                    <Label className='text-muted-foreground text-sm'>
                      Transaction Details
                    </Label>
                    <div className='space-y-1'>
                      <div className='font-medium'>
                        {selectedReceipt.transaction_id}
                      </div>
                      <Badge className={getTypeColor(selectedReceipt.type)}>
                        {selectedReceipt.type}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label className='text-muted-foreground text-sm'>
                      Verification
                    </Label>
                    <div className='space-y-1'>
                      <div className='font-mono'>
                        {selectedReceipt.verification_code}
                      </div>
                      <Badge className={getStatusColor(selectedReceipt)}>
                        {getStatusText(selectedReceipt)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div>
                    <Label className='text-muted-foreground text-sm'>
                      Fee Breakdown
                    </Label>
                    <div className='space-y-2'>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Amount</span>
                        <span className='font-medium'>
                          {formatReceiptAmount(
                            parseFloat(selectedReceipt.amount),
                            selectedReceipt.currency
                          )}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Fee</span>
                        <span className='font-medium'>
                          {formatReceiptAmount(
                            parseFloat(selectedReceipt.fee || 0),
                            selectedReceipt.currency
                          )}
                        </span>
                      </div>
                      <div className='flex justify-between border-t pt-2'>
                        <span className='font-semibold'>Total</span>
                        <span className='font-bold'>
                          {formatReceiptAmount(
                            parseFloat(
                              selectedReceipt.total || selectedReceipt.amount
                            ),
                            selectedReceipt.currency
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className='border-t pt-4'>
                <div className='flex items-center justify-center'>
                  <div className='text-center'>
                    <div className='bg-muted mx-auto mb-3 flex h-32 w-32 items-center justify-center rounded-lg'>
                      <QrCode className='text-muted-foreground h-20 w-20' />
                    </div>
                    <p className='text-muted-foreground text-sm'>
                      Scan to verify this receipt
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() =>
                  navigator.clipboard.writeText(selectedReceipt.receipt_number)
                }
              >
                <Copy className='mr-2 h-4 w-4' />
                Copy ID
              </Button>
              <Button onClick={() => handleDownloadReceipt(selectedReceipt)}>
                <Download className='mr-2 h-4 w-4' />
                Download PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </PageContainer>
  );
}
