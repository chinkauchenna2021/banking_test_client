'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CreditCard, Building, QrCode } from 'lucide-react'

interface DepositModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accounts: Array<{
    id: string
    account_name: string
    balance: string
    currency: string
    account_number: string
  }>
}

export default function DepositModal({ open, onOpenChange, accounts }: DepositModalProps) {
  const [depositData, setDepositData] = useState({
    account: '',
    amount: '',
    method: 'bank-transfer',
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDeposit = async () => {
    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)
      onOpenChange(false)
      alert('Deposit initiated successfully!')
    }, 1500)
  }

  const depositMethods = [
    { value: 'bank-transfer', label: 'Bank Transfer', icon: Building },
    { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
    { value: 'qr', label: 'QR Code', icon: QrCode },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Make a Deposit</DialogTitle>
          <DialogDescription>
            Add funds to your account using your preferred method
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deposit-account">To Account</Label>
            <Select
              value={depositData.account}
              onValueChange={(value) => setDepositData({
                ...depositData,
                account: value
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex flex-col">
                      <span>{account.account_name}</span>
                      <span className="text-xs text-gray-500">
                        {account.account_number} • ${parseFloat(account.balance).toFixed(2)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deposit-amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <Input
                id="deposit-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-8"
                value={depositData.amount}
                onChange={(e) => setDepositData({
                  ...depositData,
                  amount: e.target.value
                })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Deposit Method</Label>
            <div className="grid grid-cols-3 gap-2">
              {depositMethods.map((method) => {
                const Icon = method.icon
                return (
                  <Button
                    key={method.value}
                    type="button"
                    variant={depositData.method === method.value ? "default" : "outline"}
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setDepositData({
                      ...depositData,
                      method: method.value
                    })}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs">{method.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>
          
          {/* Additional fields based on method */}
          {depositData.method === 'bank-transfer' && (
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input id="bank-name" placeholder="Enter bank name" />
            </div>
          )}
          
          {depositData.method === 'card' && (
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input id="card-number" placeholder="1234 5678 9012 3456" />
            </div>
          )}
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleDeposit}
            disabled={isProcessing || !depositData.account || !depositData.amount}
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Deposit Now'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}