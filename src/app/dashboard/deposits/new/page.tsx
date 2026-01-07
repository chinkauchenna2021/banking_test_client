'use client';

import { useState } from 'react';
import { useManualDeposit } from '@/hooks/useManualDeposit';
import useMultistepForm from '@/hooks/use-multistep-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { ManualDeposit } from '@/stores/manual-deposit.store';
import { useUser } from '@/hooks/useUser';

// Step 1: Amount and Method Form
function AmountForm({
  updateFields,
  amount,
  method
}: {
  updateFields: any;
  amount: number;
  method: string;
}) {
  return (
    <div className='space-y-4'>
      <div>
        <Label htmlFor='amount'>Amount (USD)</Label>
        <Input
          id='amount'
          type='number'
          value={amount}
          onChange={(e) => updateFields({ amount: parseFloat(e.target.value) })}
          placeholder='e.g., 500'
        />
      </div>
      <div>
        <Label htmlFor='method'>Method</Label>
        <Select
          value={method}
          onValueChange={(value) => updateFields({ method: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select a deposit method' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='bank_transfer'>Bank Transfer</SelectItem>
            <SelectItem value='crypto' disabled>
              Cryptocurrency (Coming Soon)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Step 2: Payment Instructions
function InstructionsForm({
  companyAccount,
  isLoading
}: {
  companyAccount: any;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-10'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }
  if (!companyAccount) {
    return (
      <div className='text-red-500'>
        Could not load company account details. Please try again later.
      </div>
    );
  }
  return (
    <div className='space-y-4'>
      <h3 className='font-semibold'>
        Please make your payment to the following account:
      </h3>
      <Card className='bg-slate-50 dark:bg-slate-800'>
        <CardContent className='space-y-2 py-4'>
          <p>
            <strong>Account Name:</strong> {companyAccount.account_name}
          </p>
          <p>
            <strong>Account Number:</strong> {companyAccount.account_number}
          </p>
          <p>
            <strong>Bank Name:</strong> {companyAccount.bank_name}
          </p>
          {companyAccount.swift_code && (
            <p>
              <strong>SWIFT/BIC:</strong> {companyAccount.swift_code}
            </p>
          )}
          {companyAccount.bank_address && (
            <p>
              <strong>Bank Address:</strong> {companyAccount.bank_address}
            </p>
          )}
        </CardContent>
      </Card>
      <div className='text-muted-foreground space-y-2 text-sm'>
        <p className='text-destructive font-semibold'>Important:</p>
        <ul className='list-inside list-disc'>
          {companyAccount.instructions?.map((inst: string, i: number) => (
            <li key={i}>{inst}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Step 3: Upload Proof
function UploadForm({ setFile }: { setFile: (file: File | null) => void }) {
  return (
    <div className='space-y-2'>
      <Label htmlFor='proof'>Proof of Payment</Label>
      <Input
        id='proof'
        type='file'
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
      />
      <p className='text-muted-foreground text-sm'>
        Upload a screenshot or receipt of your transaction.
      </p>
    </div>
  );
}

export default function NewDepositPage() {
  const {
    getCompanyAccountDetails,
    createManualDeposit,
    uploadProof,
    isLoading: isSubmitting
  } = useManualDeposit();
  const { user } = useUser();
  const { toast } = useToast();
  const [data, setData] = useState({ amount: 0, method: 'bank_transfer' });
  const [companyAccount, setCompanyAccount] = useState(null);
  const [newDeposit, setNewDeposit] = useState<ManualDeposit | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const currentUserAccount = user?.accounts?.[0];

  const updateFields = (fields: Partial<typeof data>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const {
    steps,
    currentStepIndex,
    step,
    isFirstStep,
    isLastStep,
    back,
    next,
    goTo
  } = useMultistepForm([
    <AmountForm
      updateFields={updateFields}
      amount={data.amount}
      method={data.method}
    />,
    <InstructionsForm companyAccount={companyAccount} isLoading={isLoading} />,
    <UploadForm setFile={setFile} />
  ]);

  const handleNext = async () => {
    setIsLoading(true);
    // Before going to instructions, fetch account details
    if (currentStepIndex === 0) {
      if (data.amount <= 0) {
        toast({
          title: 'Invalid Amount',
          description: 'Please enter an amount greater than zero.',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }
      try {
        const details = await getCompanyAccountDetails(
          data.method as any,
          'USD'
        );
        setCompanyAccount(details);
        next();
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        });
      }
    }
    // Before going to upload proof, create the deposit record
    else if (currentStepIndex === 1) {
      if (!currentUserAccount) {
        toast({
          title: 'Error',
          description: 'Could not find your user account.',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }
      try {
        const result = await createManualDeposit({
          amount: data.amount,
          currency: 'USD',
          method: data.method as any,
          account_id: currentUserAccount.id
        });
        if (!result?.deposit) {
          throw new Error('Deposit could not be created.');
        }
        if (result?.company_account) {
          setCompanyAccount(result.company_account);
        }
        setNewDeposit(result.deposit);
        next();
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        });
      }
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLastStep) return handleNext();

    if (!file || !newDeposit) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload.',
        variant: 'destructive'
      });
      return;
    }

    try {
      await uploadProof(newDeposit.id, file);
      toast({
        title: 'Upload Successful',
        description: 'Your deposit proof has been submitted for review.'
      });
      // Here you might want to redirect the user or show a success message
      // For now, we'll just reset the form
      setData({ amount: 0, method: 'bank_transfer' });
      setFile(null);
      setNewDeposit(null);
      goTo(0);
    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className='mx-auto max-w-2xl'>
      <CardHeader>
        <CardTitle>Create a New Deposit</CardTitle>
        <CardDescription>
          Follow the steps to add funds to your account. Step{' '}
          {currentStepIndex + 1} of {steps.length}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {step}
          <div className='mt-6 flex justify-between'>
            {!isFirstStep && (
              <Button type='button' variant='outline' onClick={back}>
                Back
              </Button>
            )}
            <Button type='submit' disabled={isLoading || isSubmitting}>
              {(isLoading || isSubmitting) && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              {isLastStep ? 'Submit for Review' : 'Continue'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
