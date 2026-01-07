'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  CreditCard,
  Lock,
  Unlock,
  AlertCircle,
  Download,
  Eye,
  EyeOff,
  MoreVertical,
  Plus,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { useCard } from '@/hooks/useCard';
import { UserCard } from '@/stores/card.store';
import { useAccount } from '@/hooks/useAccount';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

export default function CardsPage() {
  const {
    cards,
    cardTransactions,
    getCards,
    requestCard,
    activateCard,
    blockCard,
    updateCardLimits,
    getCardTransactions,
    generateVirtualCard,
    formatCardNumber,
    formatExpiryDate,
    isCardExpired,
    getRemainingLimit
  } = useCard();
  const { accounts, getAccounts } = useAccount();
  const { toast } = useToast();

  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showVirtualCardDialog, setShowVirtualCardDialog] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [cardNumberVisible, setCardNumberVisible] = useState<
    Record<string, boolean>
  >({});
  const [newCardData, setNewCardData] = useState({
    type: 'physical',
    card_type: 'debit',
    card_brand: 'visa',
    account_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([getCards(), getAccounts()]);
    } catch (error) {
      console.error('Failed to load cards:', error);
      toast({
        title: 'Failed to load cards',
        description: 'Please try again in a moment.',
        variant: 'destructive'
      });
    }
  };

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'debit':
        return 'bg-blue-100 text-blue-800';
      case 'credit':
        return 'bg-purple-100 text-purple-800';
      case 'virtual':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCardStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCardStats = () => {
    return {
      total: cards.length,
      active: cards.filter((c: UserCard) => c.status === 'active').length,
      debit: cards.filter((c: UserCard) => c.type === 'debit').length,
      credit: cards.filter((c: UserCard) => c.type === 'credit').length,
      virtual: cards.filter((c: UserCard) => c.is_virtual).length
    };
  };

  const exportToCsv = (rows: Record<string, any>[], filename: string) => {
    if (!rows.length) {
      toast({
        title: 'Nothing to export',
        description: 'No records available for export.'
      });
      return;
    }

    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const value = row[header] ?? '';
            const escaped = String(value).replace(/\"/g, '\"\"');
            return `\"${escaped}\"`;
          })
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerateVirtualCard = async () => {
    if (!newCardData.account_id) {
      toast({
        title: 'Select an account',
        description: 'Choose the account to link this virtual card.',
        variant: 'destructive'
      });
      return;
    }

    setIsRequesting(true);
    try {
      await generateVirtualCard(newCardData.account_id as any);
      toast({
        title: 'Virtual card created',
        description: 'Your virtual card is ready to use.'
      });
      setShowVirtualCardDialog(false);
      await getCards();
    } catch (error: any) {
      toast({
        title: 'Failed to generate virtual card',
        description: error?.message || 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleRequestCard = async () => {
    if (!newCardData.account_id) {
      toast({
        title: 'Select an account',
        description: 'Choose the account for this card.',
        variant: 'destructive'
      });
      return;
    }

    setIsRequesting(true);
    try {
      await requestCard({
        account_id: newCardData.account_id as any,
        type: newCardData.card_type as any,
        card_type: newCardData.card_brand as any,
        is_virtual: newCardData.type === 'virtual'
      });
      toast({
        title: 'Card request submitted',
        description: 'Your request is being processed.'
      });
      setShowRequestDialog(false);
      await getCards();
    } catch (error: any) {
      toast({
        title: 'Failed to request card',
        description: error?.message || 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleBlockCard = async (card: UserCard) => {
    const reason = window.prompt(
      'Reason for blocking this card?',
      'User request'
    );
    if (!reason) return;

    try {
      await blockCard(card.id, reason);
      toast({
        title: 'Card blocked',
        description: `Card ending in ${card.card_number.slice(-4)} blocked.`
      });
    } catch (error: any) {
      toast({
        title: 'Failed to block card',
        description: error?.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleUnblockCard = async (card: UserCard) => {
    try {
      await activateCard(card.id);
      toast({
        title: 'Card unblocked',
        description: `Card ending in ${card.card_number.slice(-4)} is active again.`
      });
    } catch (error: any) {
      toast({
        title: 'Failed to unblock card',
        description: error?.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateLimits = async (card: UserCard) => {
    const daily = window.prompt(
      'Daily limit (leave blank to keep)',
      card.limits?.daily_limit?.toString() || ''
    );
    const perTx = window.prompt(
      'Per-transaction limit (leave blank to keep)',
      card.limits?.transaction_limit?.toString() || ''
    );

    const limits: any = {};
    if (daily) limits.daily_limit = Number(daily);
    if (perTx) limits.transaction_limit = Number(perTx);
    if (!Object.keys(limits).length) return;

    try {
      await updateCardLimits(card.id, limits);
      toast({
        title: 'Limits updated',
        description: `Limits updated for ${card.card_number.slice(-4)}.`
      });
    } catch (error: any) {
      toast({
        title: 'Failed to update limits',
        description: error?.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleDownloadStatement = async (card: UserCard) => {
    try {
      await getCardTransactions(card.id, { limit: 100 });
      const rows = (cardTransactions || []).map((tx) => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        description: tx.description,
        created_at: tx.created_at
      }));
      exportToCsv(rows, `card-${card.card_number.slice(-4)}-transactions.csv`);
    } catch (error: any) {
      toast({
        title: 'Failed to export statement',
        description: error?.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleBlockAllCards = async () => {
    const activeCards = cards.filter(
      (card: UserCard) => card.status === 'active'
    );
    if (!activeCards.length) {
      toast({ title: 'No active cards to block' });
      return;
    }

    try {
      await Promise.all(
        activeCards.map((card: UserCard) =>
          blockCard(card.id, 'User requested block all')
        )
      );
      toast({
        title: 'All cards blocked',
        description: `${activeCards.length} cards were blocked.`
      });
    } catch (error: any) {
      toast({
        title: 'Failed to block all cards',
        description: error?.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleExportStatements = () => {
    const rows = cards.map((card: UserCard) => ({
      id: card.id,
      card_number: card.card_number,
      type: card.type,
      card_type: card.card_type,
      status: card.status,
      expiry_month: card.expiry_month,
      expiry_year: card.expiry_year,
      is_virtual: card.is_virtual
    }));
    exportToCsv(rows, 'cards.csv');
  };

  const handleReportLostCard = async () => {
    const lastFour = window.prompt('Enter last 4 digits of the lost card');
    if (!lastFour) return;

    const card = cards.find((c: UserCard) => c.card_number.endsWith(lastFour));
    if (!card) {
      toast({
        title: 'Card not found',
        description: 'No card matches those digits.',
        variant: 'destructive'
      });
      return;
    }

    try {
      await blockCard(card.id, 'Reported lost by user');
      toast({
        title: 'Card reported lost',
        description: `Card ending in ${lastFour} has been blocked.`
      });
    } catch (error: any) {
      toast({
        title: 'Failed to report lost card',
        description: error?.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSecuritySettings = () => {
    toast({
      title: 'Security settings',
      description: 'Security preferences are managed in your profile settings.'
    });
  };

  return (
    <PageContainer
      scrollable
      pageTitle='Cards'
      pageDescription='Manage your debit and credit cards'
    >
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Cards</h1>
            <p className='text-muted-foreground'>
              {getCardStats().total} cards • {getCardStats().active} active
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <Dialog
              open={showVirtualCardDialog}
              onOpenChange={setShowVirtualCardDialog}
            >
              <DialogTrigger asChild>
                <Button variant='outline'>
                  <Plus className='mr-2 h-4 w-4' />
                  Virtual Card
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate Virtual Card</DialogTitle>
                  <DialogDescription>
                    Create a virtual card for online purchases
                  </DialogDescription>
                </DialogHeader>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label>Linked Account</Label>
                    <Select
                      value={newCardData.account_id}
                      onValueChange={(value) =>
                        setNewCardData({
                          ...newCardData,
                          account_id: value
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select account' />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.account_name} ••••
                            {account.account_number.slice(-4)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
                    <div className='mb-2 flex items-center gap-2'>
                      <Shield className='h-4 w-4 text-blue-600' />
                      <span className='font-medium'>Security Features</span>
                    </div>
                    <ul className='space-y-1 text-sm text-gray-600'>
                      <li>• Single-use card numbers</li>
                      <li>• Custom spending limits</li>
                      <li>• Automatic expiry after use</li>
                      <li>• Enhanced fraud protection</li>
                    </ul>
                  </div>
                </div>

                <div className='flex justify-end gap-3'>
                  <Button
                    variant='outline'
                    onClick={() => setShowVirtualCardDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerateVirtualCard}
                    disabled={isRequesting}
                  >
                    Generate Card
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={showRequestDialog}
              onOpenChange={setShowRequestDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Request Card
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request New Card</DialogTitle>
                  <DialogDescription>
                    Order a new physical or virtual card
                  </DialogDescription>
                </DialogHeader>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label>Linked Account</Label>
                    <Select
                      value={newCardData.account_id}
                      onValueChange={(value) =>
                        setNewCardData({
                          ...newCardData,
                          account_id: value
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select account' />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.account_name} ••••
                            {account.account_number.slice(-4)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label>Card Type</Label>
                    <Select
                      value={newCardData.type}
                      onValueChange={(value) =>
                        setNewCardData({
                          ...newCardData,
                          type: value
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select card type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='physical'>Physical Card</SelectItem>
                        <SelectItem value='virtual'>Virtual Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label>Card Category</Label>
                    <Select
                      value={newCardData.card_type}
                      onValueChange={(value) =>
                        setNewCardData({
                          ...newCardData,
                          card_type: value
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select card category' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='debit'>Debit Card</SelectItem>
                        <SelectItem value='credit'>Credit Card</SelectItem>
                        <SelectItem value='prepaid'>Prepaid Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label>Card Network</Label>
                    <Select
                      value={newCardData.card_brand}
                      onValueChange={(value) =>
                        setNewCardData({
                          ...newCardData,
                          card_brand: value
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select card network' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='visa'>Visa</SelectItem>
                        <SelectItem value='mastercard'>Mastercard</SelectItem>
                        <SelectItem value='amex'>American Express</SelectItem>
                        <SelectItem value='discover'>Discover</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='flex justify-end gap-3'>
                  <Button
                    variant='outline'
                    onClick={() => setShowRequestDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleRequestCard} disabled={isRequesting}>
                    Request Card
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Card Stats */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Total Cards</p>
                  <div className='text-2xl font-bold'>
                    {getCardStats().total}
                  </div>
                </div>
                <CreditCard className='h-8 w-8 text-blue-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Active</p>
                  <div className='text-2xl font-bold'>
                    {getCardStats().active}
                  </div>
                </div>
                <CheckCircle2 className='h-8 w-8 text-green-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Debit Cards</p>
                  <div className='text-2xl font-bold'>
                    {getCardStats().debit}
                  </div>
                </div>
                <CreditCard className='h-8 w-8 text-blue-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Virtual Cards</p>
                  <div className='text-2xl font-bold'>
                    {getCardStats().virtual}
                  </div>
                </div>
                <Shield className='h-8 w-8 text-green-500' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards Grid */}
        <Tabs defaultValue='all' className='w-full'>
          <TabsList className='mb-6'>
            <TabsTrigger value='all'>All Cards</TabsTrigger>
            <TabsTrigger value='physical'>Physical</TabsTrigger>
            <TabsTrigger value='virtual'>Virtual</TabsTrigger>
            <TabsTrigger value='blocked'>Blocked</TabsTrigger>
          </TabsList>

          <TabsContent value='all' className='space-y-4'>
            {cards.length > 0 ? (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {cards.map((card: UserCard) => (
                  <Card key={card.id} className='overflow-hidden'>
                    <CardContent className='p-0'>
                      {/* Card Header */}
                      <div
                        className={`p-6 ${
                          card.type === 'credit'
                            ? 'bg-gradient-to-r from-purple-600 to-purple-800'
                            : 'bg-gradient-to-r from-blue-600 to-blue-800'
                        } text-white`}
                      >
                        <div className='flex items-start justify-between'>
                          <div>
                            <div className='text-sm opacity-80'>
                              CARD HOLDER
                            </div>
                            <div className='font-medium'>
                              {card.card_holder}
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className='text-sm opacity-80'>VALID THRU</div>
                            <div className='font-medium'>
                              {formatExpiryDate(
                                card.expiry_month,
                                card.expiry_year
                              )}
                            </div>
                          </div>
                        </div>

                        <div className='mt-6'>
                          <div className='text-sm opacity-80'>CARD NUMBER</div>
                          <div className='flex items-center gap-2 font-mono text-xl tracking-widest'>
                            {cardNumberVisible[card.id] ? (
                              formatCardNumber(card.card_number)
                            ) : (
                              <>
                                <span>••••</span>
                                <span>••••</span>
                                <span>••••</span>
                                <span>{card.card_number.slice(-4)}</span>
                              </>
                            )}
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-6 w-6 text-white hover:bg-white/20'
                              onClick={() =>
                                setCardNumberVisible((prev) => ({
                                  ...prev,
                                  [card.id]: !prev[card.id]
                                }))
                              }
                            >
                              {cardNumberVisible[card.id] ? (
                                <EyeOff className='h-3 w-3' />
                              ) : (
                                <Eye className='h-3 w-3' />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className='p-6'>
                        <div className='mb-4 flex items-center justify-between'>
                          <div className='space-y-1'>
                            <div className='text-muted-foreground text-sm'>
                              Card Type
                            </div>
                            <Badge className={getCardTypeColor(card.card_type)}>
                              {card.card_type.toUpperCase()}
                            </Badge>
                          </div>
                          <div className='space-y-1'>
                            <div className='text-muted-foreground text-sm'>
                              Status
                            </div>
                            <Badge className={getCardStatusColor(card.status)}>
                              {card.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className='bg-muted flex gap-2 p-4'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='outline'
                            size='sm'
                            className='flex-1'
                          >
                            <MoreVertical className='mr-2 h-4 w-4' />
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuLabel>Card Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCard(card);
                              setShowCardDetails(true);
                            }}
                          >
                            <Eye className='mr-2 h-4 w-4' />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownloadStatement(card)}
                          >
                            <Download className='mr-2 h-4 w-4' />
                            Download Statement
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateLimits(card)}
                          >
                            <RefreshCw className='mr-2 h-4 w-4' />
                            Update Limits
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {card.status === 'active' ? (
                            <DropdownMenuItem
                              className='text-red-600'
                              onClick={() => handleBlockCard(card)}
                            >
                              <Lock className='mr-2 h-4 w-4' />
                              Block Card
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleUnblockCard(card)}
                            >
                              <Unlock className='mr-2 h-4 w-4' />
                              Unblock Card
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className='py-12 text-center'>
                <CardContent className='space-y-4'>
                  <div className='bg-muted mx-auto flex h-24 w-24 items-center justify-center rounded-full'>
                    <CreditCard className='text-muted-foreground h-12 w-12' />
                  </div>
                  <h3 className='text-xl font-semibold'>No cards found</h3>
                  <p className='text-muted-foreground'>
                    Get started by requesting your first card
                  </p>
                  <Button onClick={() => setShowRequestDialog(true)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Request Card
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Card Management */}
        <Card>
          <CardHeader>
            <CardTitle>Card Management</CardTitle>
            <CardDescription>
              Manage your card settings and security
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={handleBlockAllCards}
              >
                <Lock className='mr-2 h-4 w-4' />
                Block All Cards
              </Button>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={handleSecuritySettings}
              >
                <Shield className='mr-2 h-4 w-4' />
                Security Settings
              </Button>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={handleExportStatements}
              >
                <Download className='mr-2 h-4 w-4' />
                Export Statements
              </Button>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={handleReportLostCard}
              >
                <AlertCircle className='mr-2 h-4 w-4' />
                Report Lost Card
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card Details Dialog */}
      <Dialog open={showCardDetails} onOpenChange={setShowCardDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Card Details</DialogTitle>
            <DialogDescription>
              Detailed information about your card
            </DialogDescription>
          </DialogHeader>

          {selectedCard && (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-muted-foreground text-sm'>
                    Card Holder
                  </Label>
                  <div className='font-medium'>{selectedCard.card_holder}</div>
                </div>
                <div>
                  <Label className='text-muted-foreground text-sm'>
                    Card Number
                  </Label>
                  <div className='font-mono'>
                    {formatCardNumber(selectedCard.card_number)}
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-muted-foreground text-sm'>
                    Expiry Date
                  </Label>
                  <div className='font-medium'>
                    {formatExpiryDate(
                      selectedCard.expiry_month,
                      selectedCard.expiry_year
                    )}
                  </div>
                </div>
                <div>
                  <Label className='text-muted-foreground text-sm'>CVV</Label>
                  <div className='font-mono'>•••</div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-muted-foreground text-sm'>
                    Card Type
                  </Label>
                  <Badge className={getCardTypeColor(selectedCard.card_type)}>
                    {selectedCard.card_type.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className='text-muted-foreground text-sm'>
                    Status
                  </Label>
                  <Badge className={getCardStatusColor(selectedCard.status)}>
                    {selectedCard.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
