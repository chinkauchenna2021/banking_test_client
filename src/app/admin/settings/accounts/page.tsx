"use client";

import { useEffect, useState } from 'react';
import { useCompanyInformation } from '@/hooks/useCompanyInformation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AdminPaymentSettingsPage() {
  const {
    information,
    isLoading,
    updateBankAccounts,
    updateCryptoWallets,
  } = useCompanyInformation();
  const { toast } = useToast();

  const [bankAccountsJson, setBankAccountsJson] = useState('');
  const [cryptoWalletsJson, setCryptoWalletsJson] = useState('');

  useEffect(() => {
    if (information) {
      setBankAccountsJson(JSON.stringify(information.bank_accounts || {}, null, 2));
      setCryptoWalletsJson(JSON.stringify(information.crypto_wallets || {}, null, 2));
    }
  }, [information]);

  const handleSaveBankAccounts = async () => {
    try {
      const parsedData = JSON.parse(bankAccountsJson);
      await updateBankAccounts(parsedData);
      toast({
        title: 'Success',
        description: 'Bank accounts updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid JSON format or failed to update. Please check the console.',
        variant: 'destructive',
      });
      console.error('Failed to save bank accounts:', error);
    }
  };

  const handleSaveCryptoWallets = async () => {
    try {
      const parsedData = JSON.parse(cryptoWalletsJson);
      await updateCryptoWallets(parsedData);
      toast({
        title: 'Success',
        description: 'Crypto wallets updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid JSON format or failed to update. Please check the console.',
        variant: 'destructive',
      });
      console.error('Failed to save crypto wallets:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Deposit Settings</h1>
      <p className="text-muted-foreground">
        Configure the company bank accounts and cryptocurrency wallets that users will see when making deposits.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Enter the account details as a JSON object. The key should be the currency symbol (e.g., "USD", "BTC").
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bank">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bank">Bank Accounts</TabsTrigger>
              <TabsTrigger value="crypto">Crypto Wallets</TabsTrigger>
            </TabsList>
            <TabsContent value="bank">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="bank-accounts-json">Bank Accounts JSON</Label>
                  <Textarea
                    id="bank-accounts-json"
                    value={bankAccountsJson}
                    onChange={(e) => setBankAccountsJson(e.target.value)}
                    rows={15}
                    placeholder='{
  "USD": {
    "account_name": "Example Corp",
    "account_number": "123456789",
    "bank_name": "First National Bank",
    "swift_code": "FNBKUS33",
    "bank_address": "123 Finance Ave, New York, USA"
  }
}'
                  />
                </div>
                <Button onClick={handleSaveBankAccounts} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Bank Accounts
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="crypto">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="crypto-wallets-json">Crypto Wallets JSON</Label>
                  <Textarea
                    id="crypto-wallets-json"
                    value={cryptoWalletsJson}
                    onChange={(e) => setCryptoWalletsJson(e.target.value)}
                    rows={15}
                    placeholder='{
  "BTC": {
    "wallet_address": "bc1q...",
    "network": "Bitcoin"
  },
  "ETH": {
    "wallet_address": "0x...",
    "network": "Ethereum (ERC20)"
  }
}'
                  />
                </div>
                <Button onClick={handleSaveCryptoWallets} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Crypto Wallets
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
