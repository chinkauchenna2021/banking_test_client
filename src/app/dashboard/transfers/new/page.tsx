'use client';

import { useState, useEffect } from 'react';
import { useTransfers } from '@/hooks/useTransfers';
import { useDebounce } from '@/hooks/use-debounce';
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
import { Textarea } from '@/components/ui/textarea'; // ADD THIS IMPORT
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCheck, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp';

const initialData = {
  receiver_account_number: '',
  amount: 0,
  description: '',
  transaction_pin: '',

  // ADD THESE NEW FIELDS
  recipient_bank: '',
  recipient_address: '',
  recipient_routing_number: ''
};

// Step 1: Transfer Details
function TransferDetailsForm({
  updateFields,
  data,
  validatedAccount,
  isLoading
}: any) {
  return (
    <div className='space-y-6'>
      <div>
        <Label htmlFor='receiver_account_number'>
          Recipient's Account Number
        </Label>
        <Input
          id='receiver_account_number'
          value={data.receiver_account_number}
          onChange={(e) =>
            updateFields({ receiver_account_number: e.target.value })
          }
          placeholder='Enter account number'
        />
        {isLoading && (
          <p className='text-muted-foreground mt-1 text-sm'>
            Validating account...
          </p>
        )}
        {validatedAccount && (
          <Alert className='mt-2 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'>
            <UserCheck className='h-4 w-4' />
            <AlertTitle>Account Holder Found</AlertTitle>
            <AlertDescription>{validatedAccount.holder_name}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div>
          <Label htmlFor='recipient_bank'>Recipient Bank (Optional)</Label>
          <Input
            id='recipient_bank'
            value={data.recipient_bank}
            onChange={(e) => updateFields({ recipient_bank: e.target.value })}
            placeholder='Bank name'
          />
        </div>

        <div>
          <Label htmlFor='recipient_routing_number'>
            Routing Number (Optional)
          </Label>
          <Input
            id='recipient_routing_number'
            value={data.recipient_routing_number}
            onChange={(e) =>
              updateFields({ recipient_routing_number: e.target.value })
            }
            placeholder='Routing number'
          />
        </div>
      </div>

      <div>
        <Label htmlFor='recipient_address'>Recipient Address (Optional)</Label>
        <Textarea
          id='recipient_address'
          value={data.recipient_address}
          onChange={(e) => updateFields({ recipient_address: e.target.value })}
          placeholder='Full address'
          rows={2}
        />
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div>
          <Label htmlFor='amount'>Amount (USD)</Label>
          <Input
            id='amount'
            type='number'
            min='0.01'
            step='0.01'
            value={data.amount}
            onChange={(e) =>
              updateFields({ amount: parseFloat(e.target.value) || 0 })
            }
          />
        </div>

        <div>
          <Label htmlFor='description'>Description (Optional)</Label>
          <Input
            id='description'
            value={data.description}
            onChange={(e) => updateFields({ description: e.target.value })}
            placeholder='e.g., For dinner last night'
          />
        </div>
      </div>
    </div>
  );
}

// Step 2: Confirmation and PIN
function ConfirmationForm({
  updateFields,
  data,
  validatedAccount,
  transferLimits
}: any) {
  const fee = (data.amount * 0.005).toFixed(2);
  const total = data.amount + parseFloat(fee);

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Review Your Transfer</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex justify-between'>
            <span>To:</span>
            <span className='font-medium'>{validatedAccount?.holder_name}</span>
          </div>

          <div className='flex justify-between'>
            <span>Account:</span>
            <span className='font-mono'>
              {validatedAccount?.account_number}
            </span>
          </div>

          {data.recipient_bank && (
            <div className='flex justify-between'>
              <span>Bank:</span>
              <span>{data.recipient_bank}</span>
            </div>
          )}

          {data.recipient_routing_number && (
            <div className='flex justify-between'>
              <span>Routing #:</span>
              <span className='font-mono'>{data.recipient_routing_number}</span>
            </div>
          )}

          <div className='flex justify-between border-t pt-4'>
            <span>Amount:</span>
            <span>${data.amount.toFixed(2)}</span>
          </div>

          <div className='flex justify-between'>
            <span>Fee:</span>
            <span>${fee}</span>
          </div>

          <div className='flex justify-between border-t pt-4 text-lg font-bold'>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {data.description && (
            <div className='mt-4 border-t pt-4'>
              <p className='text-muted-foreground text-sm'>Description:</p>
              <p>{data.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className='space-y-2 text-center'>
        <Label htmlFor='pin'>Enter Your Transaction PIN</Label>
        <InputOTP
          maxLength={4}
          value={data.transaction_pin}
          onChange={(value) => updateFields({ transaction_pin: value })}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    </div>
  );
}

export default function NewTransferPage() {
  const {
    initiateTransfer,
    validateAccount,
    validatedAccount,
    transferLimits,
    isLoading,
    error,
    clearValidatedAccount,
    currentUserAccount
  } = useTransfers();

  const { toast } = useToast();
  const [data, setData] = useState(initialData);

  const debouncedAccountNumber = useDebounce(data.receiver_account_number, 500);

  useEffect(() => {
    if (debouncedAccountNumber && debouncedAccountNumber.length >= 10) {
      validateAccount(debouncedAccountNumber).catch(() => {
        // Error is handled in the store
      });
    } else {
      clearValidatedAccount();
    }
  }, [debouncedAccountNumber, validateAccount, clearValidatedAccount]);

  const updateFields = (fields: Partial<typeof data>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    useMultistepForm([
      <TransferDetailsForm
        data={data}
        updateFields={updateFields}
        validatedAccount={validatedAccount}
        isLoading={isLoading && !validatedAccount}
      />,
      <ConfirmationForm
        data={data}
        updateFields={updateFields}
        validatedAccount={validatedAccount}
        transferLimits={transferLimits}
      />
    ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLastStep) {
      if (!validatedAccount) {
        toast({
          title: 'Invalid Recipient',
          description: 'Please enter a valid account number.',
          variant: 'destructive'
        });
        return;
      }

      if (data.amount <= 0) {
        toast({
          title: 'Invalid Amount',
          description: 'Amount must be greater than zero.',
          variant: 'destructive'
        });
        return;
      }

      if (
        transferLimits &&
        data.amount > transferLimits.per_transaction_limit
      ) {
        toast({
          title: 'Limit Exceeded',
          description: `This transfer exceeds your limit of $${transferLimits.per_transaction_limit} per transaction.`,
          variant: 'destructive'
        });
        return;
      }

      return next();
    }

    // Final submission
    if (data.transaction_pin.length !== 4) {
      toast({
        title: 'Invalid PIN',
        description: 'Please enter your 4-digit transaction PIN.',
        variant: 'destructive'
      });
      return;
    }

    try {
      await initiateTransfer({
        ...data,
        sender_account_id: currentUserAccount!.id
        // The new fields will be included automatically
      });

      toast({
        title: 'Transfer Successful!',
        description: 'Your funds have been sent.',
        action: <ShieldCheck className='h-5 w-5 text-green-500' />
      });

      setData(initialData);
      // Reset to first step
      back();
    } catch (error: any) {
      toast({
        title: 'Transfer Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className='mx-auto max-w-2xl'>
      <CardHeader>
        <CardTitle>Send Money</CardTitle>
        <CardDescription>
          Transfer funds to another user securely. Step {currentStepIndex + 1}{' '}
          of {steps.length}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {error && !validatedAccount && (
            <Alert variant='destructive' className='mb-4'>
              <AlertTriangle className='h-4 w-4' />
              <AlertTitle>Validation Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step}

          <div className='mt-6 flex justify-between'>
            {!isFirstStep && (
              <Button type='button' variant='outline' onClick={back}>
                Back
              </Button>
            )}
            <Button type='submit' disabled={isLoading}>
              {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {isLastStep ? 'Confirm & Send' : 'Review Transfer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
