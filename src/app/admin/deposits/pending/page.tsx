"use client";

import { useEffect, useState } from 'react';
import { useAdminDeposits } from '@/hooks/useDeposits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ExternalLink } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ManualDeposit } from '@/stores/deposit.store';

export default function AdminPendingDepositsPage() {
  const {
    pendingDeposits,
    isLoading,
    fetchPendingDeposits,
    confirmDeposit,
    rejectDeposit,
  } = useAdminDeposits();
  const { toast } = useToast();

  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedDeposit, setSelectedDeposit] = useState<ManualDeposit | null>(null);

  useEffect(() => {
    fetchPendingDeposits();
  }, [fetchPendingDeposits]);

  const handleConfirm = async (depositId: string) => {
    try {
      await confirmDeposit(depositId, 'Approved by admin');
      toast({
        title: 'Success',
        description: 'Deposit has been confirmed and the user has been credited.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to confirm deposit: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleReject = async () => {
    if (!selectedDeposit || !rejectionReason) {
        toast({
            title: 'Error',
            description: 'A reason is required to reject a deposit.',
            variant: 'destructive',
        });
        return;
    }
    try {
      await rejectDeposit(selectedDeposit.id, rejectionReason);
      toast({
        title: 'Success',
        description: 'Deposit has been rejected.',
      });
      setSelectedDeposit(null);
      setRejectionReason('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to reject deposit: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Manual Deposits</CardTitle>
        <CardDescription>
          Review and approve or reject manual deposit requests from users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && pendingDeposits.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : pendingDeposits.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">No pending deposits found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Proof</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingDeposits.map((deposit: ManualDeposit) => (
                <TableRow key={deposit.id}>
                  <TableCell>
                    <div className="font-medium">{(deposit as any).user?.first_name} {(deposit as any).user?.last_name}</div>
                    <div className="text-sm text-muted-foreground">{(deposit as any).user?.email}</div>
                  </TableCell>
                  <TableCell>{formatCurrency(Number(deposit.amount), deposit.currency || 'USD')}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{deposit.method}</Badge>
                  </TableCell>
                  <TableCell>{new Date(deposit.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <a href={`${process.env.NEXT_PUBLIC_API_URL}${deposit.receipt_url}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline">
                      View Proof <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" onClick={() => handleConfirm(deposit.id)} disabled={isLoading}>
                      Approve
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" onClick={() => setSelectedDeposit(deposit)}>
                                Reject
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Reject Deposit?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Please provide a reason for rejecting this deposit. This will be shown to the user.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="py-4">
                                <Label htmlFor="rejection-reason">Rejection Reason</Label>
                                <Textarea 
                                    id="rejection-reason"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="e.g., Unclear receipt, amount mismatch..."
                                />
                            </div>
                            <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setSelectedDeposit(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleReject}>Confirm Rejection</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
