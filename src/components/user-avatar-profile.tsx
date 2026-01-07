import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Helper function to get initials from User
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  account_number: string;
  account_status: string;
  is_admin: boolean;
  two_factor_enabled: boolean;
  currency: string;
  balance: string;
  auth_type?: string;
  email_verified?: boolean;
  email_verified_at?: string;
}

const getInitialsFromUser = (user: User | null): string => {
  if (!user) return 'CN';

  const firstName = user.first_name?.trim();
  const lastName = user.last_name?.trim();

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  if (firstName) {
    return firstName.length >= 2
      ? firstName.slice(0, 2).toUpperCase()
      : firstName[0].toUpperCase();
  }

  if (lastName) {
    return lastName.length >= 2
      ? lastName.slice(0, 2).toUpperCase()
      : lastName[0].toUpperCase();
  }

  // Fallback to email initials
  if (user.email) {
    const emailName = user.email.split('@')[0];
    return emailName.slice(0, 2).toUpperCase();
  }

  return 'CN';
};

// Helper function to get full name
const getFullNameFromUser = (user: User | null): string => {
  if (!user) return '';

  const parts = [];
  if (user.first_name) parts.push(user.first_name);
  if (user.last_name) parts.push(user.last_name);

  return parts.join(' ').trim() || user.email || 'Unnamed User';
};

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: User | null;
  imageUrl?: string;
}

export function UserAvatarProfile({
  className,
  showInfo = false,
  user,
  imageUrl
}: UserAvatarProfileProps) {
  const fullName = getFullNameFromUser(user);
  const initials = getInitialsFromUser(user);

  return (
    <div className='flex items-center gap-2'>
      <Avatar className={className}>
        <AvatarImage src={imageUrl} alt={fullName} />
        <AvatarFallback className='rounded-lg'>{initials}</AvatarFallback>
      </Avatar>

      {showInfo && user && (
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>{fullName}</span>
          <span className='truncate text-xs'>{user.email}</span>
        </div>
      )}
    </div>
  );
}
