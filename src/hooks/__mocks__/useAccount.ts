export const useAccount = jest.fn(() => ({
  accounts: [],
  getAccounts: jest.fn(),
  createAccount: jest.fn(),
  updateAccount: jest.fn(),
  closeAccount: jest.fn(),
  formatCurrency: jest.fn((amount, currency) => `${amount} ${currency}`)
}));
