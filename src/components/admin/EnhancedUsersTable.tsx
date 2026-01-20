'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  useEnhancedAdmin,
  useEnhancedAdminUser,
  EnhancedAdminFilters
} from '../../hooks/useEnhancedAdmin';
import {
  Search,
  MoreVertical,
  Eye,
  Shield,
  Tag,
  TrendingUp,
  TrendingDown,
  Filter,
  X,
  Mail,
  Phone,
  UserCheck,
  UserX
} from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedUsersTableProps {
  showFilters?: boolean;
  limit?: number;
}

export default function EnhancedUsersTable({
  showFilters = true,
  limit
}: EnhancedUsersTableProps) {
  const router = useRouter();
  const {
    enhancedUsers,
    searchEnhancedUsers,
    enhancedUserStats,
    isLoading,
    getEnhancedUsers,
    createAdminUser
  } = useEnhancedAdmin();
  const { suspendUser, activateUser, updateRiskLevel, addUserTag } =
    useEnhancedAdminUser();

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<EnhancedAdminFilters>({});
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<
    'suspend' | 'activate' | 'tag' | 'risk'
  >('suspend');
  const [actionData, setActionData] = useState<string>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    account_type: 'savings',
    currency: 'USD',
    initial_balance: '',
    password: '',
    send_credentials: true
  });

  useEffect(() => {
    getEnhancedUsers().catch((error) => {
      console.error('Failed to load enhanced users:', error);
    });
  }, [getEnhancedUsers]);

  const filteredUsers = searchEnhancedUsers(searchQuery, filters);
  const displayUsers = limit ? filteredUsers.slice(0, limit) : filteredUsers;

  const handleAction = async () => {
    if (!selectedUser) return;

    try {
      switch (actionType) {
        case 'suspend':
          await suspendUser(actionData);
          toast.success('User suspended successfully');
          break;
        case 'activate':
          await activateUser();
          toast.success('User activated successfully');
          break;
        case 'risk':
          await updateRiskLevel(actionData);
          toast.success('Risk level updated');
          break;
        case 'tag':
          await addUserTag(actionData);
          toast.success('Tag added successfully');
          break;
      }
      setShowActionDialog(false);
      setActionData('');
    } catch (error: any) {
      toast.error(`Failed to perform action: ${error.message}`);
    }
  };

  const handleCreateUser = async () => {
    if (
      !createForm.first_name ||
      !createForm.last_name ||
      !createForm.email ||
      !createForm.phone
    ) {
      toast.error('First name, last name, email, and phone are required');
      return;
    }

    try {
      const payload: any = {
        ...createForm,
        initial_balance: createForm.initial_balance
          ? Number(createForm.initial_balance)
          : 0
      };

      if (!payload.password) {
        delete payload.password;
      }

      const response = await createAdminUser(payload);

      toast.success('User created successfully', {
        description: response?.temporary_password
          ? `Temporary password: ${response.temporary_password}`
          : 'Credentials sent to the user'
      });

      setShowCreateDialog(false);
      setCreateForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        account_type: 'savings',
        currency: 'USD',
        initial_balance: '',
        password: '',
        send_credentials: true
      });
      await getEnhancedUsers();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          'Failed to create user'
      );
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderFilters = () => (
    <div className='mb-6 space-y-4'>
      <div className='flex flex-wrap gap-2'>
        <div className='relative min-w-[200px] flex-1'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
          <Input
            placeholder='Search users...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-9'
          />
        </div>

        <Select
          value={filters.status || ''}
          onValueChange={(value) =>
            setFilters({ ...filters, status: value || undefined })
          }
        >
          <SelectTrigger className='w-[150px]'>
            <SelectValue placeholder='Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=''>All Status</SelectItem>
            <SelectItem value='active'>Active</SelectItem>
            <SelectItem value='suspended'>Suspended</SelectItem>
            <SelectItem value='pending'>Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.risk_level || ''}
          onValueChange={(value) =>
            setFilters({ ...filters, risk_level: value || undefined })
          }
        >
          <SelectTrigger className='w-[150px]'>
            <SelectValue placeholder='Risk Level' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=''>All Risks</SelectItem>
            <SelectItem value='low'>Low</SelectItem>
            <SelectItem value='medium'>Medium</SelectItem>
            <SelectItem value='high'>High</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.account_type || ''}
          onValueChange={(value) =>
            setFilters({ ...filters, account_type: value || undefined })
          }
        >
          <SelectTrigger className='w-[150px]'>
            <SelectValue placeholder='Account Type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=''>All Types</SelectItem>
            <SelectItem value='savings'>Savings</SelectItem>
            <SelectItem value='current'>Current</SelectItem>
            <SelectItem value='business'>Business</SelectItem>
            <SelectItem value='premium'>Premium</SelectItem>
          </SelectContent>
        </Select>

        {Object.keys(filters).length > 0 && (
          <Button variant='ghost' size='sm' onClick={() => setFilters({})}>
            <X className='mr-1 h-4 w-4' />
            Clear Filters
          </Button>
        )}

        <Button onClick={() => setShowCreateDialog(true)}>Create User</Button>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
        <Card className='p-3'>
          <div className='text-muted-foreground text-sm'>Total Users</div>
          <div className='text-2xl font-bold'>{enhancedUserStats.total}</div>
        </Card>
        <Card className='p-3'>
          <div className='text-muted-foreground text-sm'>Active</div>
          <div className='text-2xl font-bold text-green-600'>
            {enhancedUserStats.active}
          </div>
        </Card>
        <Card className='p-3'>
          <div className='text-muted-foreground text-sm'>High Risk</div>
          <div className='text-2xl font-bold text-red-600'>
            {enhancedUserStats.riskLevels.high || 0}
          </div>
        </Card>
        <Card className='p-3'>
          <div className='text-muted-foreground text-sm'>Avg Balance</div>
          <div className='text-2xl font-bold'>
            ${enhancedUserStats.averageBalance.toFixed(2)}
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div>
      {showFilters && renderFilters()}

      <div className='rounded-md border bg-white dark:bg-slate-900'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Account Info</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className='py-8 text-center'>
                  Loading enhanced user data...
                </TableCell>
              </TableRow>
            ) : displayUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='py-8 text-center'>
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              displayUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className='hover:bg-slate-50 dark:hover:bg-slate-800'
                >
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-medium text-white'>
                        {(user.first_name || 'U').charAt(0)}
                        {(user.last_name || '').charAt(0)}
                      </div>
                      <div>
                        <div className='font-medium'>
                          {user.first_name} {user.last_name}
                        </div>
                        <div className='text-muted-foreground flex items-center gap-1 text-sm'>
                          <Mail className='h-3 w-3' /> {user.email}
                        </div>
                        {user.phone && (
                          <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                            <Phone className='h-3 w-3' /> {user.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='text-sm'>
                      <div className='font-mono'>{user.account_number}</div>
                      <Badge variant='outline' className='text-xs capitalize'>
                        {user.account_type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='font-semibold'>
                      $
                      {parseFloat(user.balance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                      })}
                    </div>
                    <div className='text-muted-foreground text-xs'>
                      {user._count?.deposits || 0} deposits
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`capitalize ${getRiskLevelColor(user.risk_level || 'unknown')}`}
                    >
                      {user.risk_level || 'unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`capitalize ${getStatusColor(user.account_status)}`}
                    >
                      {user.account_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-wrap gap-1'>
                      {user.tags?.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant='secondary'
                          className='text-xs'
                        >
                          {tag}
                        </Badge>
                      ))}
                      {user.tags && user.tags.length > 2 && (
                        <span className='text-muted-foreground text-xs'>
                          +{user.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/users/${user.id}`)}
                        >
                          <Eye className='mr-2 h-4 w-4' />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setActionType('risk');
                            setShowActionDialog(true);
                          }}
                        >
                          <Shield className='mr-2 h-4 w-4' />
                          Update Risk Level
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setActionType('tag');
                            setShowActionDialog(true);
                          }}
                        >
                          <Tag className='mr-2 h-4 w-4' />
                          Add Tag
                        </DropdownMenuItem>
                        {user.account_status === 'active' ? (
                          <DropdownMenuItem
                            className='text-red-600'
                            onClick={() => {
                              setSelectedUser(user);
                              setActionType('suspend');
                              setShowActionDialog(true);
                            }}
                          >
                            <UserX className='mr-2 h-4 w-4' />
                            Suspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className='text-green-600'
                            onClick={() => {
                              setSelectedUser(user);
                              setActionType('activate');
                              setShowActionDialog(true);
                            }}
                          >
                            <UserCheck className='mr-2 h-4 w-4' />
                            Activate User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'suspend'
                ? 'Suspend User'
                : actionType === 'activate'
                  ? 'Activate User'
                  : actionType === 'risk'
                    ? 'Update Risk Level'
                    : 'Add Tag'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <span>
                  For user: <strong>{selectedUser.email}</strong>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {actionType === 'suspend' && (
            <div className='space-y-4'>
              <Label htmlFor='reason'>Reason for suspension</Label>
              <Textarea
                id='reason'
                placeholder='Enter reason for suspending this user...'
                value={actionData}
                onChange={(e) => setActionData(e.target.value)}
              />
            </div>
          )}

          {actionType === 'risk' && (
            <div className='space-y-4'>
              <Label htmlFor='riskLevel'>Select Risk Level</Label>
              <Select value={actionData} onValueChange={setActionData}>
                <SelectTrigger>
                  <SelectValue placeholder='Select risk level' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='low'>Low Risk</SelectItem>
                  <SelectItem value='medium'>Medium Risk</SelectItem>
                  <SelectItem value='high'>High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {actionType === 'tag' && (
            <div className='space-y-4'>
              <Label htmlFor='tag'>Tag Name</Label>
              <Input
                id='tag'
                placeholder='Enter tag name...'
                value={actionData}
                onChange={(e) => setActionData(e.target.value)}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setShowActionDialog(false);
                setActionData('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={!actionData && actionType !== 'activate'}
            >
              {actionType === 'suspend'
                ? 'Suspend User'
                : actionType === 'activate'
                  ? 'Activate User'
                  : actionType === 'risk'
                    ? 'Update Risk'
                    : 'Add Tag'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Create a user, optional initial funding, and send credentials
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='first_name'>First Name</Label>
              <Input
                id='first_name'
                value={createForm.first_name}
                onChange={(event) =>
                  setCreateForm({
                    ...createForm,
                    first_name: event.target.value
                  })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='last_name'>Last Name</Label>
              <Input
                id='last_name'
                value={createForm.last_name}
                onChange={(event) =>
                  setCreateForm({
                    ...createForm,
                    last_name: event.target.value
                  })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={createForm.email}
                onChange={(event) =>
                  setCreateForm({ ...createForm, email: event.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='phone'>Phone</Label>
              <Input
                id='phone'
                value={createForm.phone}
                onChange={(event) =>
                  setCreateForm({ ...createForm, phone: event.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label>Account Type</Label>
              <Select
                value={createForm.account_type}
                onValueChange={(value) =>
                  setCreateForm({ ...createForm, account_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='savings'>Savings</SelectItem>
                  <SelectItem value='current'>Current</SelectItem>
                  <SelectItem value='business'>Business</SelectItem>
                  <SelectItem value='premium'>Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='currency'>Currency</Label>
              <Input
                id='currency'
                value={createForm.currency}
                onChange={(event) =>
                  setCreateForm({
                    ...createForm,
                    currency: event.target.value.toUpperCase()
                  })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='initial_balance'>Initial Balance</Label>
              <Input
                id='initial_balance'
                type='number'
                value={createForm.initial_balance}
                onChange={(event) =>
                  setCreateForm({
                    ...createForm,
                    initial_balance: event.target.value
                  })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Temporary Password (optional)</Label>
              <Input
                id='password'
                type='text'
                value={createForm.password}
                onChange={(event) =>
                  setCreateForm({ ...createForm, password: event.target.value })
                }
              />
            </div>
            <div className='flex items-center gap-2 sm:col-span-2'>
              <Checkbox
                checked={createForm.send_credentials}
                onCheckedChange={(value) =>
                  setCreateForm({
                    ...createForm,
                    send_credentials: value === true
                  })
                }
              />
              <Label>Send credentials email to the user</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
