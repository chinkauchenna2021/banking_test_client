'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  Wallet,
  Send,
  CreditCard,
  Building,
  History,
  BarChart3,
  User,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Shield,
  DollarSign,
  TrendingUp,
  FileText,
  CheckCircle2,
  Banknote,
  PhoneCall,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"


export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Accounts', href: '/dashboard/accounts', icon: Wallet },
    { name: 'Manual Deposits', href: '/dashboard/deposits/manual', icon: Banknote },
    { name: 'Auto Deposits', href: '/dashboard/deposits', icon: DollarSign },
    { name: 'Transfers', href: '/dashboard/transfers', icon: Send },
    { name: 'Cards', href: '/dashboard/cards', icon: CreditCard },
    { name: 'Loans', href: '/dashboard/loans', icon: Building },
    { name: 'Transactions', href: '/dashboard/transactions', icon: History },
    { name: 'Voice Banking', href: '/dashboard/voice', icon: PhoneCall },
    { name: 'Receipts', href: '/dashboard/receipts', icon: FileText },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Contact', href: '/dashboard/contact', icon: Mail },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ...(user?.is_admin ? [
      { name: 'Admin', href: '/dashboard/admin', icon: Shield },
      { name: 'Deposit Approvals', href: '/dashboard/admin/deposits', icon: CheckCircle2 },
    ] : []),
  ];
  
  const [isOpen, setIsOpen] = useState(false)
  const [notifications] = useState(3)

  const handleLogout = async () => {
    await logout()
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">SecureBank</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                  {item.name === 'Dashboard' && (
                    <Badge variant="secondary" className="ml-auto">New</Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User profile */}
          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.first_name} />
                    <AvatarFallback>
                      {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col items-start">
                    <span className="text-sm font-medium">
                      {user?.first_name} {user?.last_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user?.account_number}
                    </span>
                  </div>
                  <Bell className="h-4 w-4" />
                  {notifications > 0 && (
                    <Badge className="ml-2 h-5 w-5 p-0">{notifications}</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}