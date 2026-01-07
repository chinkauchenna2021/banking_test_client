'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useCompanyInformation } from '@/hooks/useCompanyInformation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AdminPaymentSettingsPage() {
  const { information, isLoading, updateBankAccounts, updateCryptoWallets } =
    useCompanyInformation();
  const { toast } = useToast();

  const [bankAccountsJson, setBankAccountsJson] = useState('');
  const [cryptoWalletsJson, setCryptoWalletsJson] = useState('');
  const bankFileRef = useRef<HTMLInputElement | null>(null);
  const cryptoFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (information) {
      setBankAccountsJson(
        JSON.stringify(information.bank_accounts || {}, null, 2)
      );
      setCryptoWalletsJson(
        JSON.stringify(information.crypto_wallets || {}, null, 2)
      );
    }
  }, [information]);

  const normalizeInstructions = (
    instructions: any,
    errors: string[],
    label: string
  ) => {
    if (
      instructions === undefined ||
      instructions === null ||
      instructions === ''
    ) {
      return [];
    }
    if (typeof instructions === 'string') {
      return instructions
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);
    }
    if (!Array.isArray(instructions)) {
      errors.push(`${label} instructions must be an array of strings.`);
      return [];
    }
    const normalized = instructions.map((item) =>
      typeof item === 'string' ? item.trim() : ''
    );
    if (normalized.some((item) => !item)) {
      errors.push(`${label} instructions must be strings.`);
    }
    return normalized.filter(Boolean);
  };

  const validateBankAccounts = (payload: any) => {
    const errors: string[] = [];
    const normalized: Record<string, any> = {};

    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return {
        errors: ['Bank accounts must be an object keyed by currency.'],
        normalized
      };
    }

    Object.entries(payload).forEach(([currency, entry]) => {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        errors.push(`Bank account for ${currency} must be an object.`);
        return;
      }

      const account_name =
        typeof entry.account_name === 'string' ? entry.account_name.trim() : '';
      const account_number =
        typeof entry.account_number === 'string'
          ? entry.account_number.trim()
          : '';
      const bank_name =
        typeof entry.bank_name === 'string' ? entry.bank_name.trim() : '';

      if (!account_name)
        errors.push(`Bank account for ${currency} requires account_name.`);
      if (!account_number)
        errors.push(`Bank account for ${currency} requires account_number.`);
      if (!bank_name)
        errors.push(`Bank account for ${currency} requires bank_name.`);

      normalized[currency] = {
        account_name,
        account_number,
        bank_name,
        swift_code:
          typeof entry.swift_code === 'string'
            ? entry.swift_code.trim()
            : undefined,
        iban: typeof entry.iban === 'string' ? entry.iban.trim() : undefined,
        routing_number:
          typeof entry.routing_number === 'string'
            ? entry.routing_number.trim()
            : undefined,
        bank_address:
          typeof entry.bank_address === 'string'
            ? entry.bank_address.trim()
            : undefined,
        instructions: normalizeInstructions(
          entry.instructions,
          errors,
          `Bank account ${currency}`
        )
      };
    });

    return { errors, normalized };
  };

  const validateCryptoWallets = (payload: any) => {
    const errors: string[] = [];
    const normalized: Record<string, any> = {};

    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return {
        errors: ['Crypto wallets must be an object keyed by currency.'],
        normalized
      };
    }

    Object.entries(payload).forEach(([currency, entry]) => {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        errors.push(`Crypto wallet for ${currency} must be an object.`);
        return;
      }

      const wallet_address =
        typeof entry.wallet_address === 'string'
          ? entry.wallet_address.trim()
          : '';
      const network =
        typeof entry.network === 'string' ? entry.network.trim() : '';

      if (!wallet_address)
        errors.push(`Crypto wallet for ${currency} requires wallet_address.`);
      if (!network)
        errors.push(`Crypto wallet for ${currency} requires network.`);

      normalized[currency] = {
        wallet_address,
        network,
        instructions: normalizeInstructions(
          entry.instructions,
          errors,
          `Crypto wallet ${currency}`
        )
      };
    });

    return { errors, normalized };
  };

  const parseJson = (payload: string) => {
    try {
      return { data: JSON.parse(payload), error: null as string | null };
    } catch (error: any) {
      return { data: null, error: error?.message || 'Invalid JSON' };
    }
  };

  const handleImportJson = (
    event: ChangeEvent<HTMLInputElement>,
    type: 'bank' | 'crypto'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      if (!text.trim()) {
        toast({
          title: 'Import failed',
          description: 'The selected file is empty.',
          variant: 'destructive'
        });
        return;
      }

      if (type === 'bank') {
        setBankAccountsJson(text);
      } else {
        setCryptoWalletsJson(text);
      }
    };
    reader.onerror = () => {
      toast({
        title: 'Import failed',
        description: 'Unable to read the selected file.',
        variant: 'destructive'
      });
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleExportJson = (payload: string, filename: string) => {
    const blob = new Blob([payload], {
      type: 'application/json;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetBankAccounts = () => {
    if (information) {
      setBankAccountsJson(
        JSON.stringify(information.bank_accounts || {}, null, 2)
      );
    }
  };

  const resetCryptoWallets = () => {
    if (information) {
      setCryptoWalletsJson(
        JSON.stringify(information.crypto_wallets || {}, null, 2)
      );
    }
  };

  const handleSaveBankAccounts = async () => {
    try {
      const parsed = parseJson(bankAccountsJson);
      if (parsed.error) {
        toast({
          title: 'Invalid JSON',
          description: parsed.error,
          variant: 'destructive'
        });
        return;
      }

      const validation = validateBankAccounts(parsed.data);
      if (validation.errors.length) {
        toast({
          title: 'Bank accounts need attention',
          description: validation.errors[0],
          variant: 'destructive'
        });
        return;
      }

      await updateBankAccounts(validation.normalized);
      toast({
        title: 'Success',
        description: 'Bank accounts updated successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'Invalid JSON format or failed to update. Please check the console.',
        variant: 'destructive'
      });
      console.error('Failed to save bank accounts:', error);
    }
  };

  const handleSaveCryptoWallets = async () => {
    try {
      const parsed = parseJson(cryptoWalletsJson);
      if (parsed.error) {
        toast({
          title: 'Invalid JSON',
          description: parsed.error,
          variant: 'destructive'
        });
        return;
      }

      const validation = validateCryptoWallets(parsed.data);
      if (validation.errors.length) {
        toast({
          title: 'Crypto wallets need attention',
          description: validation.errors[0],
          variant: 'destructive'
        });
        return;
      }

      await updateCryptoWallets(validation.normalized);
      toast({
        title: 'Success',
        description: 'Crypto wallets updated successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'Invalid JSON format or failed to update. Please check the console.',
        variant: 'destructive'
      });
      console.error('Failed to save crypto wallets:', error);
    }
  };

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Deposit Settings</h1>
      <p className='text-muted-foreground'>
        Configure the company bank accounts and cryptocurrency wallets that
        users will see when making deposits.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Enter the account details as a JSON object. The key should be the
            currency symbol (e.g., "USD", "BTC").
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='bank'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='bank'>Bank Accounts</TabsTrigger>
              <TabsTrigger value='crypto'>Crypto Wallets</TabsTrigger>
            </TabsList>
            <TabsContent value='bank'>
              <div className='space-y-4 py-4'>
                <div className='space-y-2'>
                  <Label htmlFor='bank-accounts-json'>Bank Accounts JSON</Label>
                  <Textarea
                    id='bank-accounts-json'
                    value={bankAccountsJson}
                    onChange={(e) => setBankAccountsJson(e.target.value)}
                    rows={15}
                    placeholder='{
  "USD": {
    "account_name": "Example Corp",
    "account_number": "123456789",
    "bank_name": "First National Bank",
    "swift_code": "FNBKUS33",
    "bank_address": "123 Finance Ave, New York, USA",
    "instructions": [
      "Transfer exact amount to the company account above",
      "Include your User ID in payment reference",
      "Save payment confirmation/receipt",
      "Upload proof below"
    ]
  }
}'
                  />
                </div>
                <div className='flex flex-wrap gap-2'>
                  <Button onClick={handleSaveBankAccounts} disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    Save Bank Accounts
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => bankFileRef.current?.click()}
                    disabled={isLoading}
                  >
                    Import JSON
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() =>
                      handleExportJson(bankAccountsJson, 'bank-accounts.json')
                    }
                    disabled={isLoading}
                  >
                    Export JSON
                  </Button>
                  <Button
                    variant='ghost'
                    onClick={resetBankAccounts}
                    disabled={isLoading}
                  >
                    Reset
                  </Button>
                  <input
                    ref={bankFileRef}
                    type='file'
                    accept='application/json'
                    className='hidden'
                    onChange={(event) => handleImportJson(event, 'bank')}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value='crypto'>
              <div className='space-y-4 py-4'>
                <div className='space-y-2'>
                  <Label htmlFor='crypto-wallets-json'>
                    Crypto Wallets JSON
                  </Label>
                  <Textarea
                    id='crypto-wallets-json'
                    value={cryptoWalletsJson}
                    onChange={(e) => setCryptoWalletsJson(e.target.value)}
                    rows={15}
                    placeholder='{
  "BTC": {
    "wallet_address": "bc1q...",
    "network": "Bitcoin",
    "instructions": [
      "Send exact amount to the address above",
      "Include your User ID in memo field if available",
      "Wait for blockchain confirmation",
      "Upload transaction screenshot"
    ]
  },
  "ETH": {
    "wallet_address": "0x...",
    "network": "Ethereum (ERC20)"
  }
}'
                  />
                </div>
                <div className='flex flex-wrap gap-2'>
                  <Button
                    onClick={handleSaveCryptoWallets}
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    Save Crypto Wallets
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => cryptoFileRef.current?.click()}
                    disabled={isLoading}
                  >
                    Import JSON
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() =>
                      handleExportJson(cryptoWalletsJson, 'crypto-wallets.json')
                    }
                    disabled={isLoading}
                  >
                    Export JSON
                  </Button>
                  <Button
                    variant='ghost'
                    onClick={resetCryptoWallets}
                    disabled={isLoading}
                  >
                    Reset
                  </Button>
                  <input
                    ref={cryptoFileRef}
                    type='file'
                    accept='application/json'
                    className='hidden'
                    onChange={(event) => handleImportJson(event, 'crypto')}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
