'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import { useState, useEffect } from 'react';

export default function CardsPage() {
  const { 
    cards, 
    getCards, 
    requestCard, 
    activateCard, 
    blockCard,
    updateCardLimits,
    generateVirtualCard,
    formatCardNumber,
    formatExpiryDate,
    isCardExpired,
    getRemainingLimit
  } = useCard();
  
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showVirtualCardDialog, setShowVirtualCardDialog] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [cardNumberVisible, setCardNumberVisible] = useState<Record<string, boolean>>({});
  const [newCardData, setNewCardData] = useState({
    type: 'physical',
    card_type: 'debit',
    account_id: ''
  });

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      await getCards();
    } catch (error) {
      console.error('Failed to load cards:', error);
    }
  };

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'debit': return 'bg-blue-100 text-blue-800';
      case 'credit': return 'bg-purple-100 text-purple-800';
      case 'virtual': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCardStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <PageContainer
      scrollable
      pageTitle="Cards"
      pageDescription="Manage your debit and credit cards"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cards</h1>
            <p className="text-muted-foreground">
              {getCardStats().total} cards • {getCardStats().active} active
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog open={showVirtualCardDialog} onOpenChange={setShowVirtualCardDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
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
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Linked Account</Label>
                    <Select
                      value={newCardData.account_id}
                      onValueChange={(value) => setNewCardData({
                        ...newCardData,
                        account_id: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Add account options here */}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Security Features</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Single-use card numbers</li>
                      <li>• Custom spending limits</li>
                      <li>• Automatic expiry after use</li>
                      <li>• Enhanced fraud protection</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowVirtualCardDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button>
                    Generate Card
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
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
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Card Type</Label>
                    <Select
                      value={newCardData.type}
                      onValueChange={(value) => setNewCardData({
                        ...newCardData,
                        type: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select card type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="physical">Physical Card</SelectItem>
                        <SelectItem value="virtual">Virtual Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Card Category</Label>
                    <Select
                      value={newCardData.card_type}
                      onValueChange={(value) => setNewCardData({
                        ...newCardData,
                        card_type: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select card category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debit">Debit Card</SelectItem>
                        <SelectItem value="credit">Credit Card</SelectItem>
                        <SelectItem value="prepaid">Prepaid Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowRequestDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button>
                    Request Card
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Card Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cards</p>
                  <div className="text-2xl font-bold">{getCardStats().total}</div>
                </div>
                <CreditCard className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <div className="text-2xl font-bold">{getCardStats().active}</div>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Debit Cards</p>
                  <div className="text-2xl font-bold">{getCardStats().debit}</div>
                </div>
                <CreditCard className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Virtual Cards</p>
                  <div className="text-2xl font-bold">{getCardStats().virtual}</div>
                </div>
                <Shield className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards Grid */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Cards</TabsTrigger>
            <TabsTrigger value="physical">Physical</TabsTrigger>
            <TabsTrigger value="virtual">Virtual</TabsTrigger>
            <TabsTrigger value="blocked">Blocked</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {cards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cards.map((card: UserCard) => (
                  <Card key={card.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      {/* Card Header */}
                      <div className={`p-6 ${
                        card.type === 'credit' 
                          ? 'bg-gradient-to-r from-purple-600 to-purple-800' 
                          : 'bg-gradient-to-r from-blue-600 to-blue-800'
                      } text-white`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm opacity-80">CARD HOLDER</div>
                            <div className="font-medium">{card.card_holder}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm opacity-80">VALID THRU</div>
                            <div className="font-medium">
                              {formatExpiryDate(card.expiry_month, card.expiry_year)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <div className="text-sm opacity-80">CARD NUMBER</div>
                          <div className="font-mono text-xl tracking-widest flex items-center gap-2">
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
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-white hover:bg-white/20"
                              onClick={() => setCardNumberVisible(prev => ({
                                ...prev,
                                [card.id]: !prev[card.id]
                              }))}
                            >
                              {cardNumberVisible[card.id] ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Card Details */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Card Type</div>
                            <Badge className={getCardTypeColor(card.card_type)}>
                              {card.card_type.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Status</div>
                            <Badge className={getCardStatusColor(card.status)}>
                              {card.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="bg-muted p-4 flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <MoreVertical className="h-4 w-4 mr-2" />
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Card Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setSelectedCard(card);
                            setShowCardDetails(true);
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download Statement
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Update Limits
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {card.status === 'active' ? (
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                setSelectedCard(card);
                                setShowBlockDialog(true);
                              }}
                            >
                              <Lock className="h-4 w-4 mr-2" />
                              Block Card
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <Unlock className="h-4 w-4 mr-2" />
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
              <Card className="text-center py-12">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                    <CreditCard className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">No cards found</h3>
                  <p className="text-muted-foreground">
                    Get started by requesting your first card
                  </p>
                  <Button onClick={() => setShowRequestDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
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
            <CardDescription>Manage your card settings and security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full justify-start">
                <Lock className="h-4 w-4 mr-2" />
                Block All Cards
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Statements
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="h-4 w-4 mr-2" />
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
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Card Holder</Label>
                  <div className="font-medium">{selectedCard.card_holder}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Card Number</Label>
                  <div className="font-mono">{formatCardNumber(selectedCard.card_number)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Expiry Date</Label>
                  <div className="font-medium">
                    {formatExpiryDate(selectedCard.expiry_month, selectedCard.expiry_year)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">CVV</Label>
                  <div className="font-mono">•••</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Card Type</Label>
                  <Badge className={getCardTypeColor(selectedCard.card_type)}>
                    {selectedCard.card_type.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
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