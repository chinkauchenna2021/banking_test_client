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
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  Printer,
  Share2,
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
  Receipt,
  FileSearch,
  DollarSign
} from 'lucide-react';
import { useReceipt } from '@/hooks/useReceipt';
import { useUser } from '@/hooks/useUser';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function ReceiptsPage() {
  const { 
    receipts, 
    getReceipts, 
    generateReceipt,
    downloadReceiptAsPDF,
    verifyReceipt,
    getReceiptStatistics,
    formatReceiptAmount,
    formatReceiptDate,
    isReceiptExpired,
    isReceiptVerified
  } = useReceipt();
  
  const { user } = useUser();
  
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
    }
  };

  const getStatusIcon = (receipt: any) => {
    if (isReceiptVerified(receipt)) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    if (isReceiptExpired(receipt)) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return <Clock className="h-4 w-4 text-yellow-500" />;
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
      case 'payment': return 'bg-blue-100 text-blue-800';
      case 'deposit': return 'bg-green-100 text-green-800';
      case 'withdrawal': return 'bg-red-100 text-red-800';
      case 'transfer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReceiptStats = () => {
    const verified = receipts.filter(r => isReceiptVerified(r));
    const totalAmount = receipts.reduce((sum, r) => sum + parseFloat(r.amount), 0);
    
    return {
      total: receipts.length,
      verified: verified.length,
      expired: receipts.filter(r => isReceiptExpired(r)).length,
      totalAmount,
      averageAmount: receipts.length > 0 ? totalAmount / receipts.length : 0
    };
  };

  return (
    <PageContainer
      scrollable
      pageTitle="Receipts"
      pageDescription="View, download, and manage your transaction receipts"
    >
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Receipts</h1>
            <p className="text-muted-foreground">
              {getReceiptStats().total} receipts • ${getReceiptStats().totalAmount.toLocaleString()} total
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Verify Receipt
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Verify Receipt</DialogTitle>
                  <DialogDescription>
                    Verify the authenticity of a receipt using its verification code
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="receipt-number">Receipt Number</Label>
                    <Input
                      id="receipt-number"
                      placeholder="Enter receipt number"
                      value={verifyData.receipt_number}
                      onChange={(e) => setVerifyData({
                        ...verifyData,
                        receipt_number: e.target.value
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="verification-code">Verification Code</Label>
                    <Input
                      id="verification-code"
                      placeholder="Enter verification code"
                      value={verifyData.verification_code}
                      onChange={(e) => setVerifyData({
                        ...verifyData,
                        verification_code: e.target.value
                      })}
                    />
                  </div>
                  
                  <Button className="w-full">
                    Verify Receipt
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
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
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transaction-id">Transaction ID</Label>
                    <Input
                      id="transaction-id"
                      placeholder="Enter transaction ID"
                      value={generateData.transaction_id}
                      onChange={(e) => setGenerateData({
                        ...generateData,
                        transaction_id: e.target.value
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Receipt Type</Label>
                    <Select
                      value={generateData.type}
                      onValueChange={(value) => setGenerateData({
                        ...generateData,
                        type: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="deposit">Deposit</SelectItem>
                        <SelectItem value="withdrawal">Withdrawal</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowGenerateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button>
                    Generate Receipt
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Receipt Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Receipts</p>
                  <div className="text-2xl font-bold">{getReceiptStats().total}</div>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Verified</p>
                  <div className="text-2xl font-bold">{getReceiptStats().verified}</div>
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
                    ${getReceiptStats().totalAmount.toLocaleString()}
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expired</p>
                  <div className="text-2xl font-bold">{getReceiptStats().expired}</div>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Receipts List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Your Receipts</CardTitle>
                  <CardDescription>
                    {receipts.length} receipts found
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search receipts..."
                      className="pl-9 w-full md:w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All Receipts</TabsTrigger>
                  <TabsTrigger value="verified">Verified</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="expired">Expired</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4">
                  {receipts.length > 0 ? (
                    receipts.slice(0, 5).map((receipt) => (
                      <div key={receipt.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${getTypeColor(receipt.type)}`}>
                            <FileText className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-medium">{receipt.receipt_number}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatReceiptDate(receipt.issued_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-bold">
                              {formatReceiptAmount(parseFloat(receipt.amount), receipt.currency)}
                            </div>
                            <Badge className={getStatusColor(receipt)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(receipt)}
                                {getStatusText(receipt)}
                              </div>
                            </Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedReceipt(receipt)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Printer className="h-4 w-4 mr-2" />
                                Print Receipt
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No receipts found</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View All Receipts
              </Button>
            </CardFooter>
          </Card>
          
          {/* Receipt Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Receipt Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Export All Receipts
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="h-4 w-4 mr-2" />
                Bulk Verify
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileUp className="h-4 w-4 mr-2" />
                Upload Receipts
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Printer className="h-4 w-4 mr-2" />
                Print Batch
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Scan className="h-4 w-4 mr-2" />
                Scan QR Code
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Receipt Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Receipt Details</CardTitle>
            <CardDescription>Detailed view of all your receipts</CardDescription>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.slice(0, 10).map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-medium">{receipt.receipt_number}</TableCell>
                    <TableCell>{formatReceiptDate(receipt.issued_at)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getTypeColor(receipt.type)}>
                        {receipt.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatReceiptAmount(parseFloat(receipt.amount), receipt.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(receipt)}>
                        {getStatusText(receipt)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{receipt.verification_code}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => navigator.clipboard.writeText(receipt.verification_code || '')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
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
        <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Receipt Details</DialogTitle>
              <DialogDescription>
                Detailed view of receipt {selectedReceipt.receipt_number}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Receipt Header */}
              <div className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-2xl font-bold">{selectedReceipt.receipt_number}</div>
                    <div className="text-muted-foreground">{selectedReceipt.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      {formatReceiptAmount(parseFloat(selectedReceipt.amount), selectedReceipt.currency)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatReceiptDate(selectedReceipt.issued_at)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Receipt Details */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Transaction Details</Label>
                    <div className="space-y-1">
                      <div className="font-medium">{selectedReceipt.transaction_id}</div>
                      <Badge className={getTypeColor(selectedReceipt.type)}>
                        {selectedReceipt.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Verification</Label>
                    <div className="space-y-1">
                      <div className="font-mono">{selectedReceipt.verification_code}</div>
                      <Badge className={getStatusColor(selectedReceipt)}>
                        {getStatusText(selectedReceipt)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Fee Breakdown</Label>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-medium">
                          {formatReceiptAmount(parseFloat(selectedReceipt.amount), selectedReceipt.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fee</span>
                        <span className="font-medium">
                          {formatReceiptAmount(parseFloat(selectedReceipt.fee || 0), selectedReceipt.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold">
                          {formatReceiptAmount(parseFloat(selectedReceipt.total || selectedReceipt.amount), selectedReceipt.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* QR Code */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                      <QrCode className="h-20 w-20 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scan to verify this receipt
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(selectedReceipt.receipt_number)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy ID
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </PageContainer>
  );
}