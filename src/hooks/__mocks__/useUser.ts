export const useUser = jest.fn(() => ({
  user: {
    id: 'user_123',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    currency: 'USD'
  },
  dashboard: {},
  getDashboard: jest.fn(),
  formatCurrency: jest.fn((amount, currency) => `${amount} ${currency}`)
}));
