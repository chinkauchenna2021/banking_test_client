'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useTransaction } from '@/hooks/useTransaction';
import { useUser } from '@/hooks/useUser';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  MoreVertical,
  ShoppingBag,
  Home,
  Car,
  Utensils
} from 'lucide-react';
import { useEffect, useState } from 'react';

const transactionIcons = {
  shopping: ShoppingBag,
  transfer: ArrowUpRight,
  deposit: ArrowDownRight,
  bill: Home,
  transportation: Car,
  food: Utensils
};

export function RecentTransactions() {
  const { recentTransactions, getRecentTransactions } = useTransaction();
  const { formatCurrency } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      await getRecentTransactions();
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            <div className="ml-4 space-y-1 flex-1">
              <div className="h-4 w-[120px] bg-muted rounded animate-pulse" />
              <div className="h-3 w-[160px] bg-muted rounded animate-pulse" />
            </div>
            <div className="ml-auto h-4 w-[80px] bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIcon = (type: string) => {
    const Icon = transactionIcons[type as keyof typeof transactionIcons] || ArrowUpRight;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-8">
      {recentTransactions.slice(0, 5).map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <div className={`p-2 rounded-lg ${
            transaction.type === 'deposit' 
              ? 'bg-green-100 text-green-600'
              : 'bg-blue-100 text-blue-600'
          }`}>
            {getIcon(transaction.type)}
          </div>
          <div className="ml-4 space-y-1 flex-1">
            <p className="text-sm font-medium leading-none">
              {transaction.description || 'Transaction'}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(transaction.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              className={getStatusColor(transaction.status)}
              variant="outline"
            >
              {transaction.status}
            </Badge>
            <div className={`font-medium ${
              transaction.type === 'deposit' 
                ? 'text-green-600'
                : 'text-foreground'
            }`}>
              {transaction.type === 'deposit' ? '+' : '-'}
              {formatCurrency(parseFloat(transaction.amount))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}