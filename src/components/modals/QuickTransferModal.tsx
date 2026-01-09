// components/modals/QuickTransferModal.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Send, User, Building } from 'lucide-react';
import { Account } from '@/stores/account.store';
import { useTransfer } from '@/hooks/useTransfer';

interface QuickTransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: Account[];
}

export default function QuickTransferModal({
  open,
  onOpenChange,
  accounts
}: QuickTransferModalProps) {
  const { quickTransfer, validateAccount } = useTransfer();

  const [transferData, setTransferData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
    transactionPin: '',
    recipientBank: '',
    recipientRoutingNumber: '',
    recipientAddress: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState<{
    valid: boolean;
    account_name: string;
    holder_name: string;
  } | null>(null);

  const handleValidateAccount = async () => {
    if (!transferData.toAccount) return;

    setIsValidating(true);
    try {
      const info = await validateAccount(transferData.toAccount);
      setRecipientInfo({
        valid: info.valid,
        account_name: info.account_name,
        holder_name: info.holder_name
      });
    } catch (error) {
      setRecipientInfo({
        valid: false,
        account_name: '',
        holder_name: ''
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await quickTransfer(
        BigInt(transferData.fromAccount),
        transferData.toAccount,
        parseFloat(transferData.amount),
        transferData.description,
        transferData.transactionPin,
        transferData.recipientBank,
        transferData.recipientAddress,
        transferData.recipientRoutingNumber
      );

      // Reset and close
      setTransferData({
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: '',
        transactionPin: '',
        recipientBank: '',
        recipientRoutingNumber: '',
        recipientAddress: ''
      });
      setRecipientInfo(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Transfer failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Send className='h-5 w-5' />
            Quick Transfer
          </DialogTitle>
          <DialogDescription>
            Send money instantly to any account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* From Account */}
          <div className='space-y-2'>
            <Label htmlFor='fromAccount'>From Account</Label>
            <Select
              value={transferData.fromAccount}
              onValueChange={(value) =>
                setTransferData({
                  ...transferData,
                  fromAccount: value
                })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder='Select source account' />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className='flex items-center justify-between'>
                      <span>{account.account_name}</span>
                      <span className='text-sm text-gray-500'>
                        {account.account_number.slice(-4)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* To Account */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='toAccount'>To Account</Label>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={handleValidateAccount}
                disabled={!transferData.toAccount || isValidating}
              >
                {isValidating ? 'Validating...' : 'Validate'}
              </Button>
            </div>

            <div className='relative'>
              <Building className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
              <Input
                id='toAccount'
                placeholder='Recipient account number'
                className='pl-9'
                value={transferData.toAccount}
                onChange={(e) => {
                  setTransferData({
                    ...transferData,
                    toAccount: e.target.value
                  });
                  setRecipientInfo(null);
                }}
                required
              />
            </div>

            {recipientInfo && (
              <div
                className={`rounded-lg border p-3 ${
                  recipientInfo.valid
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className='flex items-center gap-2'>
                  <User
                    className={`h-4 w-4 ${
                      recipientInfo.valid ? 'text-green-600' : 'text-red-600'
                    }`}
                  />
                  <div>
                    {recipientInfo.valid ? (
                      <>
                        <div className='font-medium'>
                          {recipientInfo.holder_name}
                        </div>
                        <div className='text-sm text-gray-600'>
                          {recipientInfo.account_name}
                        </div>
                      </>
                    ) : (
                      <div className='text-red-600'>Invalid account number</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recipient Bank Details */}
          <div className='space-y-4 rounded-lg border p-4'>
            <h3 className='font-medium'>Recipient Bank Details (Optional)</h3>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='recipientBank'>Bank Name</Label>
                <Input
                  id='recipientBank'
                  placeholder='e.g., Chase Bank, Bank of America'
                  value={transferData.recipientBank}
                  onChange={(e) =>
                    setTransferData({
                      ...transferData,
                      recipientBank: e.target.value
                    })
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='recipientRoutingNumber'>Routing Number</Label>
                <Input
                  id='recipientRoutingNumber'
                  placeholder='e.g., 021000021'
                  value={transferData.recipientRoutingNumber}
                  onChange={(e) =>
                    setTransferData({
                      ...transferData,
                      recipientRoutingNumber: e.target.value
                    })
                  }
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='recipientAddress'>Bank Address</Label>
              <Textarea
                id='recipientAddress'
                placeholder='Full bank address (street, city, state, zip)'
                rows={2}
                value={transferData.recipientAddress}
                onChange={(e) =>
                  setTransferData({
                    ...transferData,
                    recipientAddress: e.target.value
                  })
                }
              />
            </div>
          </div>

          {/* Amount */}
          <div className='space-y-2'>
            <Label htmlFor='amount'>Amount</Label>
            <div className='relative'>
              <span className='absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500'>
                $
              </span>
              <Input
                id='amount'
                type='number'
                step='0.01'
                placeholder='0.00'
                className='pl-8'
                value={transferData.amount}
                onChange={(e) =>
                  setTransferData({
                    ...transferData,
                    amount: e.target.value
                  })
                }
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='description'>Description (Optional)</Label>
            <Textarea
              id='description'
              placeholder='Add a note for this transfer'
              rows={2}
              value={transferData.description}
              onChange={(e) =>
                setTransferData({
                  ...transferData,
                  description: e.target.value
                })
              }
            />
          </div>

          {/* Transaction PIN */}
          <div className='space-y-2'>
            <Label htmlFor='transactionPin'>Transaction PIN</Label>
            <Input
              id='transactionPin'
              type='password'
              placeholder='Enter your 4-digit PIN'
              maxLength={4}
              value={transferData.transactionPin}
              onChange={(e) =>
                setTransferData({
                  ...transferData,
                  transactionPin: e.target.value.replace(/\D/g, '').slice(0, 4)
                })
              }
              required
            />
            <p className='text-muted-foreground text-xs'>
              Enter the 4-digit PIN you use for transactions
            </p>
          </div>

          {/* Actions */}
          <div className='flex gap-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              className='flex-1'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='flex-1'
              disabled={
                isSubmitting ||
                ((recipientInfo && !recipientInfo?.valid) as any)
              }
            >
              {isSubmitting ? (
                <>
                  <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                  Processing...
                </>
              ) : (
                <>
                  <Send className='mr-2 h-4 w-4' />
                  Send Now
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
