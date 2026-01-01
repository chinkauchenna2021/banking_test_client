"use client";

import { useState } from 'react';
import { useCards } from '@/hooks/useCards';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { CardType, CardCardType } from '@/stores/card.store';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function NewCardPage() {
  const { requestCard, isLoading, currentUserAccount } = useCards();
  const { toast } = useToast();
  
  const [cardType, setCardType] = useState<CardType>(CardType.debit);
  const [cardBrand, setCardBrand] = useState<CardCardType>(CardCardType.visa);
  const [isVirtual, setIsVirtual] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserAccount) {
        toast({ title: "Error", description: "Cannot find your account.", variant: "destructive" });
        return;
    }

    try {
      await requestCard({
        account_id: currentUserAccount.id,
        type: cardType,
        card_type: cardBrand,
        is_virtual: isVirtual,
      });
      toast({
        title: 'Request Submitted',
        description: 'Your card request has been submitted for review.',
      });
    } catch (error: any) {
      toast({
        title: 'Request Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Request a New Card</CardTitle>
        <CardDescription>
          Choose your preferred card type and brand.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Physical or Virtual?</Label>
            <RadioGroup defaultValue="physical" onValueChange={(val) => setIsVirtual(val === 'virtual')}>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="physical" id="physical" />
                    <Label htmlFor="physical">Physical Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="virtual" id="virtual" />
                    <Label htmlFor="virtual">Virtual Card</Label>
                </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="card-type">Card Type</Label>
                <Select value={cardType} onValueChange={(value: CardType) => setCardType(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="debit">Debit</SelectItem>
                        <SelectItem value="credit" disabled>Credit (Coming Soon)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="card-brand">Card Brand</Label>
                <Select value={cardBrand} onValueChange={(value: CardCardType) => setCardBrand(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select card brand" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="mastercard">Mastercard</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
