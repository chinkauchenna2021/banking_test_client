'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCompanyInformation } from '@/hooks/useCompanyInformation';
import { useEnhancedAdmin } from '@/hooks/useEnhancedAdmin';
import type { AdminPaymentMethod } from '@/stores/admin.store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';

type BankAccountForm = {
  id: string;
  currency: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  swift_code: string;
  iban: string;
  routing_number: string;
  bank_address: string;
  instructions: string;
};

type CryptoWalletForm = {
  id: string;
  currency: string;
  wallet_address: string;
  network: string;
  instructions: string;
};

type PaymentMethodForm = {
  user_lookup: string;
  type: string;
  name: string;
  status: string;
  is_default: boolean;
  provider: string;
  account_number: string;
  account_holder: string;
  routing_number: string;
  swift_code: string;
  iban: string;
  bank_name: string;
  bank_country: string;
  crypto_wallet_address: string;
  crypto_type: string;
  card_number: string;
  card_holder: string;
  card_expiry: string;
  card_cvv: string;
  mobile_number: string;
  mobile_provider: string;
  paypal_email: string;
};
const createId = () =>
  `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const splitInstructions = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const createBankEntry = (currency = '', data: any = {}): BankAccountForm => ({
  id: createId(),
  currency,
  account_name: typeof data.account_name === 'string' ? data.account_name : '',
  account_number:
    typeof data.account_number === 'string' ? data.account_number : '',
  bank_name: typeof data.bank_name === 'string' ? data.bank_name : '',
  swift_code: typeof data.swift_code === 'string' ? data.swift_code : '',
  iban: typeof data.iban === 'string' ? data.iban : '',
  routing_number:
    typeof data.routing_number === 'string' ? data.routing_number : '',
  bank_address: typeof data.bank_address === 'string' ? data.bank_address : '',
  instructions: Array.isArray(data.instructions)
    ? data.instructions.join('\n')
    : typeof data.instructions === 'string'
      ? data.instructions
      : ''
});

const createCryptoEntry = (
  currency = '',
  data: any = {}
): CryptoWalletForm => ({
  id: createId(),
  currency,
  wallet_address:
    typeof data.wallet_address === 'string' ? data.wallet_address : '',
  network: typeof data.network === 'string' ? data.network : '',
  instructions: Array.isArray(data.instructions)
    ? data.instructions.join('\n')
    : typeof data.instructions === 'string'
      ? data.instructions
      : ''
});

const mapBankAccounts = (bankAccounts: any): BankAccountForm[] => {
  if (
    !bankAccounts ||
    typeof bankAccounts !== 'object' ||
    Array.isArray(bankAccounts)
  ) {
    return [];
  }

  return Object.entries(bankAccounts).map(([currency, entry]) =>
    createBankEntry(currency, entry)
  );
};

const mapCryptoWallets = (wallets: any): CryptoWalletForm[] => {
  if (!wallets || typeof wallets !== 'object' || Array.isArray(wallets)) {
    return [];
  }

  return Object.entries(wallets).map(([currency, entry]) =>
    createCryptoEntry(currency, entry)
  );
};

const getDefaultPaymentForm = (): PaymentMethodForm => ({
  user_lookup: '',
  type: 'bank',
  name: '',
  status: 'pending_verification',
  is_default: false,
  provider: '',
  account_number: '',
  account_holder: '',
  routing_number: '',
  swift_code: '',
  iban: '',
  bank_name: '',
  bank_country: '',
  crypto_wallet_address: '',
  crypto_type: '',
  card_number: '',
  card_holder: '',
  card_expiry: '',
  card_cvv: '',
  mobile_number: '',
  mobile_provider: '',
  paypal_email: ''
});

const maskValue = (value?: string, visible: number = 4) => {
  if (!value) return '-';
  const trimmed = value.trim();
  if (trimmed.length <= visible) return trimmed;
  return `****${trimmed.slice(-visible)}`;
};

const shortenValue = (value?: string, start: number = 8, end: number = 6) => {
  if (!value) return '-';
  const trimmed = value.trim();
  if (trimmed.length <= start + end) return trimmed;
  return `${trimmed.slice(0, start)}...${trimmed.slice(-end)}`;
};

export default function AdminPaymentSettingsPage() {
  const {
    information,
    isLoading: isCompanyLoading,
    updateBankAccounts,
    updateCryptoWallets
  } = useCompanyInformation();
  const {
    paymentMethods,
    getPaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    isLoading: isAdminLoading
  } = useEnhancedAdmin();
  const { toast } = useToast();

  const [bankAccounts, setBankAccounts] = useState<BankAccountForm[]>([]);
  const [cryptoWallets, setCryptoWallets] = useState<CryptoWalletForm[]>([]);
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [paymentType, setPaymentType] = useState('all');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<AdminPaymentMethod | null>(
    null
  );
  const [paymentForm, setPaymentForm] = useState<PaymentMethodForm>(
    getDefaultPaymentForm()
  );
  useEffect(() => {
    if (information) {
      setBankAccounts(mapBankAccounts(information.bank_accounts));
      setCryptoWallets(mapCryptoWallets(information.crypto_wallets));
    }
  }, [information]);

  useEffect(() => {
    getPaymentMethods().catch((error) => {
      console.error('Failed to load payment methods:', error);
      toast({
        title: 'Payment methods unavailable',
        description:
          error?.response?.data?.error ||
          error?.message ||
          'Unable to load payment methods.',
        variant: 'destructive'
      });
    });
  }, [getPaymentMethods, toast]);

  const filteredPaymentMethods = useMemo(() => {
    const query = paymentSearch.trim().toLowerCase();
    return paymentMethods.filter((method) => {
      const matchesQuery =
        !query ||
        method.name?.toLowerCase().includes(query) ||
        method.user?.email?.toLowerCase().includes(query) ||
        method.user?.account_number?.toLowerCase().includes(query) ||
        method.account_number?.toLowerCase().includes(query) ||
        method.card_number?.toLowerCase().includes(query) ||
        method.crypto_wallet_address?.toLowerCase().includes(query) ||
        method.paypal_email?.toLowerCase().includes(query) ||
        method.mobile_number?.toLowerCase().includes(query);

      const matchesStatus =
        paymentStatus === 'all' || method.status === paymentStatus;
      const matchesType = paymentType === 'all' || method.type === paymentType;

      return matchesQuery && matchesStatus && matchesType;
    });
  }, [paymentMethods, paymentSearch, paymentStatus, paymentType]);

  const updateBankEntry = (
    id: string,
    field: keyof BankAccountForm,
    value: string
  ) => {
    setBankAccounts((entries) =>
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const updateCryptoEntry = (
    id: string,
    field: keyof CryptoWalletForm,
    value: string
  ) => {
    setCryptoWallets((entries) =>
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const addBankAccount = () =>
    setBankAccounts((entries) => [...entries, createBankEntry()]);
  const addCryptoWallet = () =>
    setCryptoWallets((entries) => [...entries, createCryptoEntry()]);

  const removeBankAccount = (id: string) =>
    setBankAccounts((entries) => entries.filter((entry) => entry.id !== id));
  const removeCryptoWallet = (id: string) =>
    setCryptoWallets((entries) => entries.filter((entry) => entry.id !== id));

  const resetBankAccounts = () => {
    if (information) {
      setBankAccounts(mapBankAccounts(information.bank_accounts));
    }
  };

  const resetCryptoWallets = () => {
    if (information) {
      setCryptoWallets(mapCryptoWallets(information.crypto_wallets));
    }
  };
  const handleSaveBankAccounts = async () => {
    const errors: string[] = [];
    const payload: Record<string, any> = {};
    const seen = new Set<string>();

    bankAccounts.forEach((entry, index) => {
      const currency = entry.currency.trim().toUpperCase();
      const account_name = entry.account_name.trim();
      const account_number = entry.account_number.trim();
      const bank_name = entry.bank_name.trim();
      const swift_code = entry.swift_code.trim();
      const iban = entry.iban.trim();
      const routing_number = entry.routing_number.trim();
      const bank_address = entry.bank_address.trim();
      const instructionList = splitInstructions(entry.instructions);

      const hasData =
        currency ||
        account_name ||
        account_number ||
        bank_name ||
        swift_code ||
        iban ||
        routing_number ||
        bank_address ||
        instructionList.length > 0;

      if (!hasData) {
        return;
      }

      if (!currency) {
        errors.push(`Bank account ${index + 1} requires a currency.`);
      } else if (seen.has(currency)) {
        errors.push(`Duplicate bank currency: ${currency}.`);
      } else {
        seen.add(currency);
      }

      if (!account_name) {
        errors.push(`Bank account ${currency || index + 1} needs a name.`);
      }
      if (!account_number) {
        errors.push(`Bank account ${currency || index + 1} needs a number.`);
      }
      if (!bank_name) {
        errors.push(`Bank account ${currency || index + 1} needs a bank name.`);
      }

      if (currency && account_name && account_number && bank_name) {
        const normalized: Record<string, any> = {
          account_name,
          account_number,
          bank_name
        };

        if (swift_code) normalized.swift_code = swift_code;
        if (iban) normalized.iban = iban;
        if (routing_number) normalized.routing_number = routing_number;
        if (bank_address) normalized.bank_address = bank_address;
        if (instructionList.length) normalized.instructions = instructionList;

        payload[currency] = normalized;
      }
    });

    if (errors.length) {
      toast({
        title: 'Bank accounts need attention',
        description: errors[0],
        variant: 'destructive'
      });
      return;
    }

    try {
      await updateBankAccounts(payload);
      toast({
        title: 'Success',
        description: 'Bank accounts updated successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'Failed to update bank accounts. Please check the console.',
        variant: 'destructive'
      });
      console.error('Failed to save bank accounts:', error);
    }
  };

  const handleSaveCryptoWallets = async () => {
    const errors: string[] = [];
    const payload: Record<string, any> = {};
    const seen = new Set<string>();

    cryptoWallets.forEach((entry, index) => {
      const currency = entry.currency.trim().toUpperCase();
      const wallet_address = entry.wallet_address.trim();
      const network = entry.network.trim();
      const instructionList = splitInstructions(entry.instructions);

      const hasData =
        currency || wallet_address || network || instructionList.length > 0;

      if (!hasData) {
        return;
      }

      if (!currency) {
        errors.push(`Crypto wallet ${index + 1} requires a currency.`);
      } else if (seen.has(currency)) {
        errors.push(`Duplicate crypto currency: ${currency}.`);
      } else {
        seen.add(currency);
      }

      if (!wallet_address) {
        errors.push(`Crypto wallet ${currency || index + 1} needs an address.`);
      }
      if (!network) {
        errors.push(`Crypto wallet ${currency || index + 1} needs a network.`);
      }

      if (currency && wallet_address && network) {
        const normalized: Record<string, any> = {
          wallet_address,
          network
        };

        if (instructionList.length) normalized.instructions = instructionList;

        payload[currency] = normalized;
      }
    });

    if (errors.length) {
      toast({
        title: 'Crypto wallets need attention',
        description: errors[0],
        variant: 'destructive'
      });
      return;
    }

    try {
      await updateCryptoWallets(payload);
      toast({
        title: 'Success',
        description: 'Crypto wallets updated successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'Failed to update crypto wallets. Please check the console.',
        variant: 'destructive'
      });
      console.error('Failed to save crypto wallets:', error);
    }
  };
  const openCreatePaymentDialog = () => {
    setEditingMethod(null);
    setPaymentForm(getDefaultPaymentForm());
    setPaymentDialogOpen(true);
  };

  const openEditPaymentDialog = (method: AdminPaymentMethod) => {
    setEditingMethod(method);
    setPaymentForm({
      user_lookup: '',
      type: method.type || 'bank',
      name: method.name || '',
      status: method.status || 'pending_verification',
      is_default: method.is_default || false,
      provider: method.provider || '',
      account_number: method.account_number || '',
      account_holder: method.account_holder || '',
      routing_number: method.routing_number || '',
      swift_code: method.swift_code || '',
      iban: method.iban || '',
      bank_name: method.bank_name || '',
      bank_country: method.bank_country || '',
      crypto_wallet_address: method.crypto_wallet_address || '',
      crypto_type: method.crypto_type || '',
      card_number: method.card_number || '',
      card_holder: method.card_holder || '',
      card_expiry: method.card_expiry || '',
      card_cvv: method.card_cvv || '',
      mobile_number: method.mobile_number || '',
      mobile_provider: method.mobile_provider || '',
      paypal_email: method.paypal_email || ''
    });
    setPaymentDialogOpen(true);
  };

  const buildPaymentPayload = (
    form: PaymentMethodForm,
    requireUser: boolean
  ) => {
    const errors: string[] = [];
    const payload: Record<string, any> = {};
    const type = form.type.trim();
    const name = form.name.trim();

    if (!type) {
      errors.push('Payment method type is required.');
    }
    if (!name) {
      errors.push('Payment method name is required.');
    }

    if (requireUser) {
      const lookup = form.user_lookup.trim();
      if (!lookup) {
        errors.push('User email or account number is required.');
      } else if (lookup.includes('@')) {
        payload.user_email = lookup;
      } else {
        payload.user_account_number = lookup;
      }
    }

    payload.type = type;
    payload.name = name;
    payload.status = form.status || 'pending_verification';
    payload.is_default = form.is_default;

    const setField = (key: string, value: string) => {
      const trimmed = value.trim();
      if (trimmed) {
        payload[key] = trimmed;
      }
    };

    setField('provider', form.provider);

    switch (type) {
      case 'bank':
        setField('account_number', form.account_number);
        setField('account_holder', form.account_holder);
        setField('routing_number', form.routing_number);
        setField('swift_code', form.swift_code);
        setField('iban', form.iban);
        setField('bank_name', form.bank_name);
        setField('bank_country', form.bank_country);

        if (
          !payload.account_number ||
          !payload.account_holder ||
          !payload.bank_name
        ) {
          errors.push(
            'Bank account number, holder, and bank name are required.'
          );
        }
        break;
      case 'crypto':
        setField('crypto_wallet_address', form.crypto_wallet_address);
        setField('crypto_type', form.crypto_type);

        if (!payload.crypto_wallet_address || !payload.crypto_type) {
          errors.push('Crypto wallet address and network are required.');
        }
        break;
      case 'card':
        setField('card_number', form.card_number);
        setField('card_holder', form.card_holder);
        setField('card_expiry', form.card_expiry);
        setField('card_cvv', form.card_cvv);

        if (
          !payload.card_number ||
          !payload.card_holder ||
          !payload.card_expiry ||
          !payload.card_cvv
        ) {
          errors.push('Card number, holder, expiry, and CVV are required.');
        }
        break;
      case 'paypal':
        setField('paypal_email', form.paypal_email);
        if (!payload.paypal_email) {
          errors.push('PayPal email is required.');
        }
        break;
      case 'mobile_money':
        setField('mobile_number', form.mobile_number);
        setField('mobile_provider', form.mobile_provider);
        if (!payload.mobile_number || !payload.mobile_provider) {
          errors.push('Mobile number and provider are required.');
        }
        break;
      default:
        errors.push('Payment method type is invalid.');
    }

    return { payload, errors };
  };

  const handleSavePaymentMethod = async () => {
    const { payload, errors } = buildPaymentPayload(
      paymentForm,
      !editingMethod
    );

    if (errors.length) {
      toast({
        title: 'Payment method needs attention',
        description: errors[0],
        variant: 'destructive'
      });
      return;
    }

    try {
      if (editingMethod) {
        await updatePaymentMethod(editingMethod.id, payload);
        toast({
          title: 'Updated',
          description: 'Payment method updated successfully.'
        });
      } else {
        await createPaymentMethod(payload);
        toast({
          title: 'Created',
          description: 'Payment method created successfully.'
        });
      }

      setPaymentDialogOpen(false);
      setEditingMethod(null);
    } catch (error: any) {
      toast({
        title: 'Action failed',
        description:
          error?.response?.data?.error ||
          error?.message ||
          'Payment method update failed.',
        variant: 'destructive'
      });
    }
  };

  const handleDeletePaymentMethod = async (methodId: string) => {
    if (!window.confirm('Delete this payment method? This cannot be undone.')) {
      return;
    }

    try {
      await deletePaymentMethod(methodId);
      toast({
        title: 'Deleted',
        description: 'Payment method removed.'
      });
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description:
          error?.response?.data?.error ||
          error?.message ||
          'Unable to delete payment method.',
        variant: 'destructive'
      });
    }
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      await setDefaultPaymentMethod(methodId);
      toast({
        title: 'Default updated',
        description: 'Payment method is now default.'
      });
    } catch (error: any) {
      toast({
        title: 'Action failed',
        description:
          error?.response?.data?.error ||
          error?.message ||
          'Unable to set default payment method.',
        variant: 'destructive'
      });
    }
  };

  const getMethodDetails = (method: AdminPaymentMethod) => {
    switch (method.type) {
      case 'bank':
        return `${method.bank_name || 'Bank'} - ${maskValue(method.account_number)}`;
      case 'crypto':
        return `${method.crypto_type || 'Crypto'} - ${shortenValue(method.crypto_wallet_address)}`;
      case 'card':
        return `${maskValue(method.card_number)} - ${method.card_expiry || 'Expiry N/A'}`;
      case 'paypal':
        return method.paypal_email || 'PayPal account';
      case 'mobile_money':
        return `${method.mobile_provider || 'Provider'} - ${method.mobile_number || ''}`;
      default:
        return method.name;
    }
  };
  return (
    <div className='space-y-6'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-bold'>Deposit Settings</h1>
        <p className='text-muted-foreground'>
          Configure company deposit accounts and manage user payment methods.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Accounts</CardTitle>
          <CardDescription>
            Maintain the bank accounts and crypto wallets users see during
            deposits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='bank'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='bank'>Bank Accounts</TabsTrigger>
              <TabsTrigger value='crypto'>Crypto Wallets</TabsTrigger>
            </TabsList>

            <TabsContent value='bank'>
              <div className='space-y-4 pt-4'>
                {bankAccounts.length === 0 ? (
                  <p className='text-muted-foreground text-sm'>
                    No bank accounts configured yet.
                  </p>
                ) : (
                  bankAccounts.map((account, index) => (
                    <div
                      key={account.id}
                      className='space-y-4 rounded-lg border p-4'
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <h3 className='text-sm font-semibold'>
                            Bank Account {index + 1}
                          </h3>
                          <p className='text-muted-foreground text-xs'>
                            {account.currency
                              ? `Currency: ${account.currency}`
                              : 'Set currency'}
                          </p>
                        </div>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => removeBankAccount(account.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                      <div className='grid gap-4 md:grid-cols-2'>
                        <div className='space-y-2'>
                          <Label htmlFor={`bank-${account.id}-currency`}>
                            Currency
                          </Label>
                          <Input
                            id={`bank-${account.id}-currency`}
                            value={account.currency}
                            placeholder='USD'
                            onChange={(event) =>
                              updateBankEntry(
                                account.id,
                                'currency',
                                event.target.value.toUpperCase()
                              )
                            }
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor={`bank-${account.id}-name`}>
                            Account Name
                          </Label>
                          <Input
                            id={`bank-${account.id}-name`}
                            value={account.account_name}
                            placeholder='Company Name'
                            onChange={(event) =>
                              updateBankEntry(
                                account.id,
                                'account_name',
                                event.target.value
                              )
                            }
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor={`bank-${account.id}-number`}>
                            Account Number
                          </Label>
                          <Input
                            id={`bank-${account.id}-number`}
                            value={account.account_number}
                            placeholder='1234567890'
                            onChange={(event) =>
                              updateBankEntry(
                                account.id,
                                'account_number',
                                event.target.value
                              )
                            }
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor={`bank-${account.id}-bank`}>
                            Bank Name
                          </Label>
                          <Input
                            id={`bank-${account.id}-bank`}
                            value={account.bank_name}
                            placeholder='Bank Name'
                            onChange={(event) =>
                              updateBankEntry(
                                account.id,
                                'bank_name',
                                event.target.value
                              )
                            }
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor={`bank-${account.id}-swift`}>
                            Swift Code
                          </Label>
                          <Input
                            id={`bank-${account.id}-swift`}
                            value={account.swift_code}
                            placeholder='SWIFT'
                            onChange={(event) =>
                              updateBankEntry(
                                account.id,
                                'swift_code',
                                event.target.value
                              )
                            }
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor={`bank-${account.id}-iban`}>
                            IBAN
                          </Label>
                          <Input
                            id={`bank-${account.id}-iban`}
                            value={account.iban}
                            placeholder='IBAN'
                            onChange={(event) =>
                              updateBankEntry(
                                account.id,
                                'iban',
                                event.target.value
                              )
                            }
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor={`bank-${account.id}-routing`}>
                            Routing Number
                          </Label>
                          <Input
                            id={`bank-${account.id}-routing`}
                            value={account.routing_number}
                            placeholder='Routing Number'
                            onChange={(event) =>
                              updateBankEntry(
                                account.id,
                                'routing_number',
                                event.target.value
                              )
                            }
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor={`bank-${account.id}-address`}>
                            Bank Address
                          </Label>
                          <Input
                            id={`bank-${account.id}-address`}
                            value={account.bank_address}
                            placeholder='Address'
                            onChange={(event) =>
                              updateBankEntry(
                                account.id,
                                'bank_address',
                                event.target.value
                              )
                            }
                          />
                        </div>
                        <div className='space-y-2 md:col-span-2'>
                          <Label htmlFor={`bank-${account.id}-instructions`}>
                            Deposit Instructions
                          </Label>
                          <Textarea
                            id={`bank-${account.id}-instructions`}
                            value={account.instructions}
                            rows={4}
                            placeholder='One instruction per line'
                            onChange={(event) =>
                              updateBankEntry(
                                account.id,
                                'instructions',
                                event.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <div className='flex flex-wrap items-center gap-2'>
                  <Button variant='outline' onClick={addBankAccount}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add Bank Account
                  </Button>
                  <Button
                    onClick={handleSaveBankAccounts}
                    disabled={isCompanyLoading}
                  >
                    {isCompanyLoading && (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    Save Bank Accounts
                  </Button>
                  <Button
                    variant='ghost'
                    onClick={resetBankAccounts}
                    disabled={isCompanyLoading}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value='crypto'>
              <div className='space-y-4 pt-4'>
                {cryptoWallets.length === 0 ? (
                  <p className='text-muted-foreground text-sm'>
                    No crypto wallets configured yet.
                  </p>
                ) : (
                  cryptoWallets.map((wallet, index) => (
                    <div
                      key={wallet.id}
                      className='space-y-4 rounded-lg border p-4'
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <h3 className='text-sm font-semibold'>
                            Crypto Wallet {index + 1}
                          </h3>
                          <p className='text-muted-foreground text-xs'>
                            {wallet.currency
                              ? `Currency: ${wallet.currency}`
                              : 'Set currency'}
                          </p>
                        </div>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => removeCryptoWallet(wallet.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                      <div className='grid gap-4 md:grid-cols-2'>
                        <div className='space-y-2'>
                          <Label htmlFor={`crypto-${wallet.id}-currency`}>
                            Currency
                          </Label>
                          <Input
                            id={`crypto-${wallet.id}-currency`}
                            value={wallet.currency}
                            placeholder='BTC'
                            onChange={(event) =>
                              updateCryptoEntry(
                                wallet.id,
                                'currency',
                                event.target.value.toUpperCase()
                              )
                            }
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor={`crypto-${wallet.id}-network`}>
                            Network
                          </Label>
                          <Input
                            id={`crypto-${wallet.id}-network`}
                            value={wallet.network}
                            placeholder='Bitcoin'
                            onChange={(event) =>
                              updateCryptoEntry(
                                wallet.id,
                                'network',
                                event.target.value
                              )
                            }
                          />
                        </div>
                        <div className='space-y-2 md:col-span-2'>
                          <Label htmlFor={`crypto-${wallet.id}-address`}>
                            Wallet Address
                          </Label>
                          <Input
                            id={`crypto-${wallet.id}-address`}
                            value={wallet.wallet_address}
                            placeholder='Wallet address'
                            onChange={(event) =>
                              updateCryptoEntry(
                                wallet.id,
                                'wallet_address',
                                event.target.value
                              )
                            }
                          />
                        </div>
                        <div className='space-y-2 md:col-span-2'>
                          <Label htmlFor={`crypto-${wallet.id}-instructions`}>
                            Deposit Instructions
                          </Label>
                          <Textarea
                            id={`crypto-${wallet.id}-instructions`}
                            value={wallet.instructions}
                            rows={4}
                            placeholder='One instruction per line'
                            onChange={(event) =>
                              updateCryptoEntry(
                                wallet.id,
                                'instructions',
                                event.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <div className='flex flex-wrap items-center gap-2'>
                  <Button variant='outline' onClick={addCryptoWallet}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add Crypto Wallet
                  </Button>
                  <Button
                    onClick={handleSaveCryptoWallets}
                    disabled={isCompanyLoading}
                  >
                    {isCompanyLoading && (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    Save Crypto Wallets
                  </Button>
                  <Button
                    variant='ghost'
                    onClick={resetCryptoWallets}
                    disabled={isCompanyLoading}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='space-y-3'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div>
              <CardTitle>User Payment Methods</CardTitle>
              <CardDescription>
                Create and manage payment methods tied to user accounts.
              </CardDescription>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button variant='outline' onClick={() => getPaymentMethods()}>
                <RefreshCw className='mr-2 h-4 w-4' />
                Refresh
              </Button>
              <Button onClick={openCreatePaymentDialog}>
                <Plus className='mr-2 h-4 w-4' />
                New Method
              </Button>
            </div>
          </div>
          <div className='flex flex-col gap-3 sm:flex-row'>
            <div className='relative flex-1'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input
                value={paymentSearch}
                onChange={(event) => setPaymentSearch(event.target.value)}
                placeholder='Search by user, account, wallet...'
                className='pl-9'
              />
            </div>
            <Select value={paymentType} onValueChange={setPaymentType}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Types</SelectItem>
                <SelectItem value='bank'>Bank</SelectItem>
                <SelectItem value='crypto'>Crypto</SelectItem>
                <SelectItem value='card'>Card</SelectItem>
                <SelectItem value='paypal'>PayPal</SelectItem>
                <SelectItem value='mobile_money'>Mobile Money</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='inactive'>Inactive</SelectItem>
                <SelectItem value='suspended'>Suspended</SelectItem>
                <SelectItem value='pending_verification'>
                  Pending Verification
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Default</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isAdminLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-8 text-center'>
                    Loading payment methods...
                  </TableCell>
                </TableRow>
              ) : filteredPaymentMethods.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-8 text-center'>
                    No payment methods found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPaymentMethods.map((method) => (
                  <TableRow key={method.id}>
                    <TableCell>
                      <div className='font-medium'>
                        {method.user
                          ? `${method.user.first_name} ${method.user.last_name}`
                          : 'Unknown User'}
                      </div>
                      <div className='text-muted-foreground text-xs'>
                        {method.user?.email || 'No email'} -{' '}
                        {method.user?.account_number || 'No account'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='font-medium'>{method.name}</div>
                      <div className='text-muted-foreground text-xs capitalize'>
                        {method.type.replace('_', ' ')}
                      </div>
                    </TableCell>
                    <TableCell className='text-sm'>
                      {getMethodDetails(method)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          method.status === 'active'
                            ? 'default'
                            : method.status === 'pending_verification'
                              ? 'secondary'
                              : 'outline'
                        }
                        className='capitalize'
                      >
                        {method.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {method.is_default ? (
                        <Badge variant='default'>Default</Badge>
                      ) : (
                        <Badge variant='outline'>-</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {method.created_at
                        ? format(new Date(method.created_at), 'MMM d, yyyy')
                        : '-'}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex flex-wrap justify-end gap-2'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => openEditPaymentDialog(method)}
                        >
                          <Pencil className='mr-1 h-4 w-4' />
                          Edit
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          disabled={method.is_default}
                          onClick={() => handleSetDefault(method.id)}
                        >
                          <CheckCircle className='mr-1 h-4 w-4' />
                          Default
                        </Button>
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={() => handleDeletePaymentMethod(method.id)}
                        >
                          <Trash2 className='mr-1 h-4 w-4' />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>
              {editingMethod ? 'Edit Payment Method' : 'Create Payment Method'}
            </DialogTitle>
            <DialogDescription>
              {editingMethod
                ? 'Update the payment method details below.'
                : 'Create a payment method for a specific user.'}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            {!editingMethod ? (
              <div className='space-y-2'>
                <Label htmlFor='payment-user'>
                  User Email or Account Number
                </Label>
                <Input
                  id='payment-user'
                  value={paymentForm.user_lookup}
                  placeholder='user@example.com or ACC12345'
                  onChange={(event) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      user_lookup: event.target.value
                    }))
                  }
                />
              </div>
            ) : (
              <div className='rounded-md border p-3 text-sm'>
                <div className='font-medium'>User</div>
                <div className='text-muted-foreground'>
                  {editingMethod.user?.email || 'Unknown'} -{' '}
                  {editingMethod.user?.account_number || 'N/A'}
                </div>
              </div>
            )}

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='payment-name'>Method Name</Label>
                <Input
                  id='payment-name'
                  value={paymentForm.name}
                  placeholder='Primary Bank'
                  onChange={(event) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      name: event.target.value
                    }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='payment-type'>Type</Label>
                <Select
                  value={paymentForm.type}
                  onValueChange={(value) =>
                    setPaymentForm((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger id='payment-type'>
                    <SelectValue placeholder='Select type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='bank'>Bank</SelectItem>
                    <SelectItem value='crypto'>Crypto</SelectItem>
                    <SelectItem value='card'>Card</SelectItem>
                    <SelectItem value='paypal'>PayPal</SelectItem>
                    <SelectItem value='mobile_money'>Mobile Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='payment-status'>Status</Label>
                <Select
                  value={paymentForm.status}
                  onValueChange={(value) =>
                    setPaymentForm((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger id='payment-status'>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='inactive'>Inactive</SelectItem>
                    <SelectItem value='suspended'>Suspended</SelectItem>
                    <SelectItem value='pending_verification'>
                      Pending Verification
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='payment-provider'>Provider (Optional)</Label>
                <Input
                  id='payment-provider'
                  value={paymentForm.provider}
                  placeholder='Provider'
                  onChange={(event) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      provider: event.target.value
                    }))
                  }
                />
              </div>
              <div className='flex items-center gap-2 md:col-span-2'>
                <Checkbox
                  id='payment-default'
                  checked={paymentForm.is_default}
                  onCheckedChange={(checked) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      is_default: Boolean(checked)
                    }))
                  }
                />
                <Label htmlFor='payment-default'>Set as default</Label>
              </div>
            </div>

            {paymentForm.type === 'bank' && (
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='bank-account-number'>Account Number</Label>
                  <Input
                    id='bank-account-number'
                    value={paymentForm.account_number}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        account_number: event.target.value
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='bank-account-holder'>Account Holder</Label>
                  <Input
                    id='bank-account-holder'
                    value={paymentForm.account_holder}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        account_holder: event.target.value
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='bank-name'>Bank Name</Label>
                  <Input
                    id='bank-name'
                    value={paymentForm.bank_name}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        bank_name: event.target.value
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='bank-country'>Bank Country</Label>
                  <Input
                    id='bank-country'
                    value={paymentForm.bank_country}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        bank_country: event.target.value
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='bank-routing'>Routing Number</Label>
                  <Input
                    id='bank-routing'
                    value={paymentForm.routing_number}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        routing_number: event.target.value
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='bank-swift'>Swift Code</Label>
                  <Input
                    id='bank-swift'
                    value={paymentForm.swift_code}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        swift_code: event.target.value
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='bank-iban'>IBAN</Label>
                  <Input
                    id='bank-iban'
                    value={paymentForm.iban}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        iban: event.target.value
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {paymentForm.type === 'crypto' && (
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2 md:col-span-2'>
                  <Label htmlFor='crypto-address'>Wallet Address</Label>
                  <Input
                    id='crypto-address'
                    value={paymentForm.crypto_wallet_address}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        crypto_wallet_address: event.target.value
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='crypto-network'>Network</Label>
                  <Input
                    id='crypto-network'
                    value={paymentForm.crypto_type}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        crypto_type: event.target.value
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {paymentForm.type === 'card' && (
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='card-number'>Card Number</Label>
                  <Input
                    id='card-number'
                    value={paymentForm.card_number}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        card_number: event.target.value
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='card-holder'>Card Holder</Label>
                  <Input
                    id='card-holder'
                    value={paymentForm.card_holder}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        card_holder: event.target.value
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='card-expiry'>Expiry (MM/YY)</Label>
                  <Input
                    id='card-expiry'
                    value={paymentForm.card_expiry}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        card_expiry: event.target.value
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='card-cvv'>CVV</Label>
                  <Input
                    id='card-cvv'
                    value={paymentForm.card_cvv}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        card_cvv: event.target.value
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {paymentForm.type === 'paypal' && (
              <div className='space-y-2'>
                <Label htmlFor='paypal-email'>PayPal Email</Label>
                <Input
                  id='paypal-email'
                  value={paymentForm.paypal_email}
                  onChange={(event) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      paypal_email: event.target.value
                    }))
                  }
                />
              </div>
            )}

            {paymentForm.type === 'mobile_money' && (
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='mobile-number'>Mobile Number</Label>
                  <Input
                    id='mobile-number'
                    value={paymentForm.mobile_number}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        mobile_number: event.target.value
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='mobile-provider'>Provider</Label>
                  <Input
                    id='mobile-provider'
                    value={paymentForm.mobile_provider}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        mobile_provider: event.target.value
                      }))
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSavePaymentMethod} disabled={isAdminLoading}>
              {isAdminLoading && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              {editingMethod ? 'Update Method' : 'Create Method'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
