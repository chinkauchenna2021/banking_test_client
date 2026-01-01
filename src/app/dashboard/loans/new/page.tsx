"use client";

import { useState } from 'react';
import { useLoans } from '@/hooks/useLoans';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { LoanType } from '@/stores/loan.store';

const loanTerms = [
    { label: '12 Months', value: 12 },
    { label: '24 Months', value: 24 },
    { label: '36 Months', value: 36 },
    { label: '48 Months', value: 48 },
    { label: '60 Months', value: 60 },
];

export default function NewLoanPage() {
  const { applyForLoan, isLoading, currentUserAccount } = useLoans();
  const { toast } = useToast();
  const [amount, setAmount] = useState(5000);
  const [term, setTerm] = useState(24);
  const [purpose, setPurpose] = useState('');
  const [loanType, setLoanType] = useState<LoanType>(LoanType.personal);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserAccount) {
        toast({ title: "Error", description: "Cannot find your account.", variant: "destructive" });
        return;
    }
    if (amount <= 0) {
        toast({ title: "Error", description: "Please enter a valid amount.", variant: "destructive" });
        return;
    }

    try {
      await applyForLoan({
        amount,
        term_months: term,
        purpose,
        loan_type: loanType,
        account_id: currentUserAccount.id,
      });
      toast({
        title: 'Application Submitted',
        description: 'Your loan application has been submitted for review.',
      });
      // Reset form
      setAmount(5000);
      setTerm(24);
      setPurpose('');
    } catch (error: any) {
      toast({
        title: 'Application Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Apply for a Loan</CardTitle>
        <CardDescription>
          Complete the form below to apply for a new loan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="loan-type">Loan Type</Label>
                <Select value={loanType} onValueChange={(value: LoanType) => setLoanType(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(LoanType).map(type => (
                            <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="amount">Loan Amount (USD)</Label>
                <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                />
            </div>
          </div>
          
          <div>
            <Label htmlFor="term">Loan Term</Label>
            <Select value={String(term)} onValueChange={(value) => setTerm(parseInt(value))}>
                <SelectTrigger>
                    <SelectValue placeholder="Select loan term" />
                </SelectTrigger>
                <SelectContent>
                    {loanTerms.map(t => (
                        <SelectItem key={t.value} value={String(t.value)}>{t.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="purpose">Purpose of Loan</Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g., Home renovation, new car, etc."
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Application
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
