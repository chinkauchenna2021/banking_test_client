import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within
} from '@testing-library/react';
import AccountsPage from '@/app/dashboard/accounts/page';
import { useAccount } from '@/hooks/useAccount';
import { useUser } from '@/hooks/useUser';

// Mock the hooks to control their behavior in tests
jest.mock('@/hooks/useAccount');
jest.mock('@/hooks/useUser');

// Mock data
const mockAccounts = [
  {
    id: 'acc_1',
    account_name: 'Main Checking',
    account_number: '1234567890',
    balance: '5000.00',
    available_balance: '4800.00',
    ledger_balance: '5000.00',
    account_type: 'checking',
    currency: 'USD',
    status: 'active'
  },
  {
    id: 'acc_2',
    account_name: 'High-Yield Savings',
    account_number: '0987654321',
    balance: '15000.00',
    available_balance: '15000.00',
    ledger_balance: '15000.00',
    account_type: 'savings',
    currency: 'USD',
    status: 'active'
  }
];

const mockUser = {
  id: 'user_123',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  currency: 'USD'
};

// Type casting for mock functions
const useAccountMock = useAccount as jest.Mock;
const useUserMock = useUser as jest.Mock;

describe('AccountsPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    useUserMock.mockReturnValue({
      user: mockUser,
      formatCurrency: (amount: any, currency: any) =>
        `$${parseFloat(amount).toLocaleString()}`
    });
    useAccountMock.mockReturnValue({
      accounts: [],
      getAccounts: jest.fn().mockResolvedValue(undefined),
      createAccount: jest.fn().mockResolvedValue(undefined),
      updateAccount: jest.fn().mockResolvedValue(undefined),
      closeAccount: jest.fn().mockResolvedValue(undefined),
      formatCurrency: (amount: any, currency: any) =>
        `$${parseFloat(amount).toLocaleString()}`
    });
  });

  it('should render the "no accounts" state when no accounts are available', async () => {
    render(<AccountsPage />);

    // Check for the empty state message and button
    expect(screen.getByText('No accounts found')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeInTheDocument();
  });

  it('should render account cards and table when accounts are available', async () => {
    useAccountMock.mockReturnValue({
      ...useAccountMock(),
      accounts: mockAccounts
    });

    render(<AccountsPage />);

    // Check for account stats
    expect(screen.getByText(/2 accounts/i)).toBeInTheDocument();
    // Use a more flexible regex for the balance, as formatting can vary
    expect(screen.getByText(/20,000 total balance/i)).toBeInTheDocument();

    // Check for account cards - use getAllByText since names can appear in cards and table
    expect(screen.getAllByText('Main Checking')[0]).toBeInTheDocument();
    expect(screen.getAllByText('High-Yield Savings')[0]).toBeInTheDocument();

    // Use more robust queries for amounts that match toLocaleString() output
    expect(screen.getAllByText('$5,000')[0]).toBeInTheDocument();
    expect(screen.getAllByText('$15,000')[0]).toBeInTheDocument();

    // Check for accounts in the table
    const tableRows = screen.getAllByRole('row');
    // Header + 2 data rows
    expect(tableRows).toHaveLength(3);
    expect(
      screen.getByRole('cell', { name: /main checking/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: /high-yield savings/i })
    ).toBeInTheDocument();
  });

  it('should filter accounts based on search query', async () => {
    useAccountMock.mockReturnValue({
      ...useAccountMock(),
      accounts: mockAccounts
    });

    render(<AccountsPage />);

    const searchInput = screen.getByPlaceholderText('Search accounts...');
    fireEvent.change(searchInput, { target: { value: 'Savings' } });

    await waitFor(() => {
      const cardGrid = screen.getByRole('tabpanel', { name: /all accounts/i });
      // After filtering, the masked savings account number should be visible within the card grid
      expect(
        within(cardGrid).getByText(/0987 \*\*\*\* \*\*\*\* 4321/)
      ).toBeInTheDocument();
      // And the checking account number should not be visible
      expect(
        within(cardGrid).queryByText(/1234 \*\*\*\* \*\*\*\* 7890/)
      ).not.toBeInTheDocument();
    });
  });

  it('should open the create account dialog and submit a new account', async () => {
    const createAccountMock = jest.fn().mockResolvedValue(undefined);
    useAccountMock.mockReturnValue({
      ...useAccountMock(),
      accounts: mockAccounts,
      createAccount: createAccountMock
    });

    render(<AccountsPage />);

    // Click "New Account" button
    fireEvent.click(screen.getByRole('button', { name: /new account/i }));

    // Wait for the dialog to appear
    await waitFor(() => {
      expect(
        screen.getByRole('dialog', { name: /create new account/i })
      ).toBeInTheDocument();
    });

    // Fill the form
    fireEvent.change(screen.getByLabelText(/account name/i), {
      target: { value: 'Test Account' }
    });

    // Open the select dropdown and click an option
    // Use getAllByRole to get the first combobox, which is "Account Type"
    fireEvent.click(screen.getAllByRole('combobox')[0]);
    fireEvent.click(await screen.findByText('Savings Account'));

    // Click "Create Account"
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    // Assert that createAccount was called with the correct data
    await waitFor(() => {
      expect(createAccountMock).toHaveBeenCalledWith({
        account_name: 'Test Account',
        account_type: 'savings',
        currency: 'USD'
      });
    });
  });
});
