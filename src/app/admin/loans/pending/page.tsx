"use client";

import { useEffect, useState } from 'react';
import { useAdminLoans } from '@/hooks/useLoans';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
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
import { UserLoan } from '@/stores/loan.store';

export default function AdminPendingLoansPage() {
  const {
    pendingLoans,
    isLoading,
    fetchPendingLoans,
    approveLoan,
    rejectLoan,
  } = useAdminLoans();
  const { toast } = useToast();

  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<UserLoan | null>(null);

  useEffect(() => {
    fetchPendingLoans();
  }, [fetchPendingLoans]);

  const handleApprove = async (loanId: string) => {
    try {
      await approveLoan(loanId, 'Loan approved by admin');
      toast({
        title: 'Success',
        description: 'Loan has been approved and funds disbursed.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to approve loan: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleReject = async () => {
    if (!selectedLoan || !rejectionReason) {
        toast({ title: 'Error', description: 'A reason is required to reject a loan.', variant: 'destructive' });
        return;
    }
    try {
      await rejectLoan(selectedLoan.id, rejectionReason);
      toast({ title: 'Success', description: 'Loan has been rejected.' });
      setSelectedLoan(null);
      setRejectionReason('');
    } catch (error: any) {
      toast({ title: 'Error', description: `Failed to reject loan: ${error.message}`, variant: 'destructive' });
    }
  };
  
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Loan Applications</CardTitle>
        <CardDescription>
          Review and approve or reject new loan applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && pendingLoans.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : pendingLoans.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">No pending loan applications found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>
                    <div className="font-medium">{(loan as any).user?.first_name} {(loan as any).user?.last_name}</div>
                    <div className="text-sm text-muted-foreground">{(loan as any).user?.email}</div>
                  </TableCell>
                  <TableCell>{formatCurrency(Number(loan.amount))}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{loan.loan_type}</Badge>
                  </TableCell>
                  <TableCell>{loan.term_months} months</TableCell>
                  <TableCell>{new Date(loan.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" onClick={() => handleApprove(loan.id)} disabled={isLoading}>
                      Approve
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" onClick={() => setSelectedLoan(loan)}>
                                Reject
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Reject Loan Application?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Please provide a reason for rejecting this loan.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="py-4">
                                <Label htmlFor="rejection-reason">Rejection Reason</Label>
                                <Textarea 
                                    id="rejection-reason"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="e.g., Insufficient credit score..."
                                />
                            </div>
                            <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setSelectedLoan(null)}>Cancel</AlertDialogCancel>
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
