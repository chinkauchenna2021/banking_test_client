"use client";

import { useEffect, useState } from 'react';
import { useAdminCards } from '@/hooks/useCards';
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
import { UserCard } from '@/stores/card.store';

export default function AdminPendingCardsPage() {
  const {
    pendingCardRequests,
    isLoading,
    fetchPendingCardRequests,
    approveCardRequest,
    rejectCardRequest,
  } = useAdminCards();
  const { toast } = useToast();

  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedCard, setSelectedCard] = useState<UserCard | null>(null);

  useEffect(() => {
    fetchPendingCardRequests();
  }, [fetchPendingCardRequests]);

  const handleApprove = async (cardId: string) => {
    try {
      await approveCardRequest(cardId);
      toast({
        title: 'Success',
        description: 'Card request has been approved.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to approve card: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleReject = async () => {
    if (!selectedCard || !rejectionReason) {
        toast({ title: 'Error', description: 'A reason is required to reject a request.', variant: 'destructive' });
        return;
    }
    try {
      await rejectCardRequest(selectedCard.id, rejectionReason);
      toast({ title: 'Success', description: 'Card request has been rejected.' });
      setSelectedCard(null);
      setRejectionReason('');
    } catch (error: any) {
      toast({ title: 'Error', description: `Failed to reject request: ${error.message}`, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Card Requests</CardTitle>
        <CardDescription>
          Review and approve or reject new card requests from users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && pendingCardRequests.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : pendingCardRequests.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">No pending card requests found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Card Type</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingCardRequests.map((card) => (
                <TableRow key={card.id}>
                  <TableCell>
                    <div className="font-medium">{(card as any).user?.first_name} {(card as any).user?.last_name}</div>
                    <div className="text-sm text-muted-foreground">{(card as any).user?.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{card.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{card.card_type}</Badge>
                  </TableCell>
                  <TableCell>{card.is_virtual ? 'Virtual' : 'Physical'}</TableCell>
                  <TableCell>{new Date(card.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" onClick={() => handleApprove(card.id)} disabled={isLoading}>
                      Approve
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" onClick={() => setSelectedCard(card)}>
                                Reject
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Reject Card Request?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Please provide a reason for rejecting this request.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="py-4">
                                <Label htmlFor="rejection-reason">Rejection Reason</Label>
                                <Textarea 
                                    id="rejection-reason"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="e.g., User not eligible..."
                                />
                            </div>
                            <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setSelectedCard(null)}>Cancel</AlertDialogCancel>
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
