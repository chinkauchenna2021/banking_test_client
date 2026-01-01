'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdmin } from '@/hooks/useAdmin';
import { CheckCircle2, XCircle, Eye, Image as ImageIcon, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminDepositsPage() {
  const {
    deposits,
    getDeposits,
    confirmDeposit,
    formatDate,
    isLoading
  } = useAdmin();

  const [filter, setFilter] = useState('pending');
  const [selectedDeposit, setSelectedDeposit] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    getDeposits();
  }, [getDeposits]);

  const filteredDeposits = deposits.filter(d => d.status === filter);

  const handleApprove = async () => {
    if (!selectedDeposit) return;
    try {
      await confirmDeposit(selectedDeposit.id);
      toast.success('Deposit confirmed successfully');
      setShowDetails(false);
      getDeposits(); // Refresh
    } catch (error) {
      toast.error('Failed to confirm deposit');
    }
  };

  const handleReject = async () => {
    // Logic to reject would go here, likely updating status to 'rejected'
    toast.info('Reject functionality placeholder');
    setShowDetails(false);
  };

  return (
    <PageContainer
      scrollable
      pageTitle="Deposits & Approvals"
      pageDescription="Review manual deposits and proof of payment"
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="flex gap-4 mb-4">
          <Card className={`flex-1 cursor-pointer transition-colors ${filter === 'pending' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`} onClick={() => setFilter('pending')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {deposits.filter(d => d.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          
          <Card className={`flex-1 cursor-pointer transition-colors ${filter === 'completed' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}`} onClick={() => setFilter('completed')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {deposits.filter(d => d.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deposits Table */}
        <div className="rounded-md border bg-white dark:bg-slate-900">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Proof</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">Loading deposits...</TableCell>
                </TableRow>
              ) : filteredDeposits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">No deposits found</TableCell>
                </TableRow>
              ) : (
                filteredDeposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell className="text-muted-foreground">
                      {formatDate(deposit.created_at)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {deposit.user_id}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {deposit.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${parseFloat(deposit.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {deposit.deposit_reference ? (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => window.open(deposit.deposit_reference, '_blank')}>
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-xs">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={deposit.status === 'completed' ? 'default' : 'secondary'}
                        className={deposit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      >
                        {deposit.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedDeposit(deposit);
                          setShowDetails(true);
                        }}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Deposit Request</DialogTitle>
            <DialogDescription>
              Verify the proof of payment before confirming funds to the user account.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDeposit && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Deposit ID</p>
                  <p className="font-mono">{selectedDeposit.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{formatDate(selectedDeposit.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p>{selectedDeposit.user_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                  <p className="font-mono">{selectedDeposit.account_number}</p>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Transaction Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${parseFloat(selectedDeposit.amount).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>Method: {selectedDeposit.method}</span>
                  <span>•</span>
                  <span>Reference: {selectedDeposit.reference}</span>
                </div>
              </div>

              {/* Proof Preview Area */}
              <div>
                <p className="text-sm font-medium mb-2">Proof of Payment</p>
                {selectedDeposit.proof_url ? (
                  <div className="w-full h-64 border rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-900 relative overflow-hidden group">
                    <img 
                      src={selectedDeposit.proof_url} 
                      alt="Proof of payment" 
                      className="max-w-full max-h-full object-contain"
                    />
                    <Button 
                      size="sm" 
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => window.open(selectedDeposit.proof_url, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Full View
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-32 border rounded-dashed flex items-center justify-center text-muted-foreground">
                    <FileText className="h-8 w-8 mr-2" />
                    No proof uploaded
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Close
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve & Credit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}