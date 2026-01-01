'use client'

import { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface TransferScheduleDrawerProps {
  accounts: Array<{
    id: string
    account_name: string
    balance: string
    currency: string
  }>
  onSchedule: (data: {
    fromAccount: string
    toAccount: string
    amount: number
    scheduledFor: Date
    description?: string
    transactionPin?: string
  }) => Promise<void>
}

export default function TransferScheduleDrawer({ accounts, onSchedule }: TransferScheduleDrawerProps) {
  const [scheduleData, setScheduleData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
    transactionPin: '',
  })
  const [date, setDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSchedule = async () => {
    if (!date) return
    
    setIsSubmitting(true)
    try {
      await onSchedule({
        fromAccount: scheduleData.fromAccount,
        toAccount: scheduleData.toAccount,
        amount: parseFloat(scheduleData.amount),
        scheduledFor: date,
        description: scheduleData.description,
        transactionPin: scheduleData.transactionPin,
      })
      
      // Reset form
      setScheduleData({
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: '',
        transactionPin: '',
      })
      setDate(undefined)
      
    } catch (error) {
      console.error('Schedule failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="schedule-from">From Account</Label>
              <Select
                value={scheduleData.fromAccount}
                onValueChange={(value) => setScheduleData({
                  ...scheduleData,
                  fromAccount: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center justify-between">
                        <span>{account.account_name}</span>
                        <span className="text-sm text-gray-500">
                          ${parseFloat(account.balance).toFixed(2)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="schedule-to">To Account</Label>
              <Input
                id="schedule-to"
                placeholder="Recipient account number"
                value={scheduleData.toAccount}
                onChange={(e) => setScheduleData({
                  ...scheduleData,
                  toAccount: e.target.value
                })}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="schedule-amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <Input
                id="schedule-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-8"
                value={scheduleData.amount}
                onChange={(e) => setScheduleData({
                  ...scheduleData,
                  amount: e.target.value
                })}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Schedule Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date <= new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="schedule-description">Description (Optional)</Label>
            <Textarea
              id="schedule-description"
              placeholder="Add a note for this transfer"
              rows={3}
              value={scheduleData.description}
              onChange={(e) => setScheduleData({
                ...scheduleData,
                description: e.target.value
              })}
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="schedule-pin">Transaction PIN</Label>
            <Input
              id="schedule-pin"
              type="password"
              placeholder="Enter your 4-digit PIN"
              maxLength={4}
              value={scheduleData.transactionPin}
              onChange={(e) => setScheduleData({
                ...scheduleData,
                transactionPin: e.target.value.replace(/\D/g, '').slice(0, 4)
              })}
            />
            <p className="text-xs text-gray-500">
              Enter the 4-digit PIN you use for transactions
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            className="w-full"
            onClick={handleSchedule}
            disabled={isSubmitting || !date}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Scheduling...
              </>
            ) : (
              'Schedule Transfer'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}