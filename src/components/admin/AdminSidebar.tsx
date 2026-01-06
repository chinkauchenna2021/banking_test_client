'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  ArrowUpDown,
  Wallet,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
  Landmark,
  CreditCard,
  Bell,
  BarChart3,
  AlertTriangle,
  Coins,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useEnhancedAdmin } from '../../hooks/useEnhancedAdmin';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: Users
  },
  {
    name: 'Enhanced Users',
    href: '/admin/users/enhanced',
    icon: Users,
    badge: 'New'
  },
  {
    name: 'Transactions',
    href: '/admin/transactions',
    icon: ArrowUpDown
  },
  {
    name: 'Deposits',
    href: '/admin/deposits',
    icon: Wallet
  },
  {
    name: 'Enhanced Deposits',
    href: '/admin/deposits/enhanced',
    icon: Wallet,
    badge: 'New'
  },
  {
    name: 'Pending Loans',
    href: '/admin/loans/pending',
    icon: Landmark
  },
  {
    name: 'Pending Cards',
    href: '/admin/cards/pending',
    icon: CreditCard
  },
  {
    name: 'System Alerts',
    href: '/admin/alerts',
    icon: AlertTriangle,
    alertCount: true
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    name: 'Crypto Accounts',
    href: '/admin/crypto',
    icon: Coins
  },
  {
    name: 'Activity Log',
    href: '/admin/activity',
    icon: Activity
  },
  {
    name: 'Deposit Settings',
    href: '/admin/settings/accounts',
    icon: Settings
  },
  {
    name: 'System Settings',
    href: '/admin/settings',
    icon: Settings
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { criticalAlerts } = useEnhancedAdmin();

  const alertCount = criticalAlerts.length;

  return (
    <>
      {/* Mobile menu button */}
      <div className='fixed top-4 left-4 z-50 md:hidden'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 text-white transition-transform duration-300 ease-in-out md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className='flex h-full flex-col'>
          {/* Logo */}
          <div className='flex h-16 items-center border-b border-slate-800 px-6'>
            <Link href='/admin' className='flex items-center gap-2'>
              <Shield className='h-8 w-8 text-blue-400' />
              <span className='text-xl font-bold'>Enhanced Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className='flex-1 space-y-1 overflow-y-auto p-4'>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const hasAlerts = item.alertCount && alertCount > 0;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group relative flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <div className='flex items-center gap-3'>
                    <Icon className='h-5 w-5' />
                    {item.name}
                  </div>

                  {/* Badges */}
                  <div className='flex items-center gap-1'>
                    {hasAlerts && (
                      <span className='flex h-2 w-2'>
                        <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75'></span>
                        <span className='relative inline-flex h-2 w-2 rounded-full bg-red-500'></span>
                      </span>
                    )}
                    {item.badge && (
                      <span className='rounded-full bg-blue-500 px-1.5 py-0.5 text-xs text-white'>
                        {item.badge}
                      </span>
                    )}
                    {hasAlerts && (
                      <span className='rounded-full bg-red-500 px-2 py-0.5 text-xs text-white'>
                        {alertCount}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className='border-t border-slate-800 p-4'>
            <div className='flex items-center gap-3'>
              <Avatar className='h-10 w-10 border border-slate-700'>
                <AvatarFallback className='bg-gradient-to-br from-blue-600 to-purple-600 text-white'>
                  {user?.first_name?.charAt(0)}
                  {user?.last_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 overflow-hidden'>
                <p className='truncate text-sm font-medium text-white'>
                  {user?.first_name} {user?.last_name}
                </p>
                <p className='truncate text-xs text-slate-400'>
                  Administrator • Enhanced Access
                </p>
              </div>
              <Button
                variant='ghost'
                size='icon'
                className='text-slate-400 hover:text-white'
                onClick={logout}
              >
                <LogOut className='h-5 w-5' />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className='fixed inset-0 z-30 bg-black/80 md:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
