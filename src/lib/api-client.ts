import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import { useTokenStorage } from '@/hooks/useTokenStorage';
import { useAuthStore } from '@/stores/auth.store';

class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;
  private isRefreshing = false;
  private failedQueue: any[] = [];

  // Base URLs for different environments
  private get baseURL(): string {
    if (typeof window === 'undefined') {
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }

  private constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 3000000,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Skip token for login and register endpoints
        if (
          config.url?.includes('/auth/login') ||
          config.url?.includes('/auth/register') ||
          config.url?.includes('/auth/forgot-password') ||
          config.url?.includes('/auth/reset-password') ||
          config.url?.includes('/auth/verify-email')
        ) {
          return config;
        }

        // Get token from token storage
        const { getAccessToken } = useTokenStorage();
        const accessToken = getAccessToken();

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
          console.log(
            'Adding Authorization header:',
            accessToken.substring(0, 20) + '...'
          );
        } else {
          console.warn('No access token found for request:', config.url);
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Check if response contains new tokens and update storage
        const responseData = response.data;
        const tokens = this.extractTokensFromResponse(responseData);

        if (tokens.accessToken || tokens.refreshToken) {
          this.updateTokens(
            tokens.accessToken,
            tokens.refreshToken,
            tokens.user
          );
        }

        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Add to queue and wait for token refresh
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.client(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const { getRefreshToken } = useTokenStorage();
            const refreshToken = getRefreshToken();

            if (refreshToken) {
              const response = await axios.post(
                `${this.baseURL}/auth/refresh-token`,
                { refresh_token: refreshToken }
              );

              const tokens = this.extractTokensFromResponse(response.data);

              if (tokens.accessToken) {
                this.updateTokens(
                  tokens.accessToken,
                  tokens.refreshToken,
                  tokens.user
                );

                // Process queued requests
                this.failedQueue.forEach((prom) =>
                  prom.resolve(tokens.accessToken)
                );
                this.failedQueue = [];

                originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
                return this.client(originalRequest);
              }
            } else {
              throw new Error('No refresh token available');
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);

            // Process queued requests with error
            this.failedQueue.forEach((prom) => prom.reject(refreshError));
            this.failedQueue = [];

            // Clear all auth data
            this.clearAuthData();

            // Only redirect if we're on the client
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private extractTokensFromResponse(responseData: any) {
    let accessToken = null;
    let refreshToken = null;
    let user = null;

    // Check different response structures
    if (responseData && typeof responseData === 'object') {
      // Structure 1: Direct properties
      if (responseData.access_token) {
        accessToken = responseData.access_token;
      }
      if (responseData.refresh_token) {
        refreshToken = responseData.refresh_token;
      }
      if (responseData.user) {
        user = responseData.user;
      }

      // Structure 2: Nested in data property
      if (!accessToken && responseData.data?.access_token) {
        accessToken = responseData.data.access_token;
      }
      if (!refreshToken && responseData.data?.refresh_token) {
        refreshToken = responseData.data.refresh_token;
      }
      if (!user && responseData.data?.user) {
        user = responseData.data.user;
      }
    }

    return { accessToken, refreshToken, user };
  }

  private updateTokens(
    accessToken: string | null,
    refreshToken: string | null,
    user?: any
  ): void {
    const { setTokens } = useTokenStorage();
    setTokens(accessToken, refreshToken, user);
    console.log('Tokens updated in storage:', {
      accessToken: !!accessToken,
      refreshToken: !!refreshToken,
      user: !!user
    });
  }

  private clearAuthData(): void {
    const { clearTokens } = useTokenStorage();
    clearTokens();

    // Clear any additional localStorage items
    localStorage.removeItem('pending_verification_email');

    console.log('Auth data cleared');
  }

  // HTTP Methods
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config).then((response) => response.data);
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.client
      .post(url, data, config)
      .then((response) => response.data);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.client.put(url, data, config).then((response) => response.data);
  }

  public patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.client
      .patch(url, data, config)
      .then((response) => response.data);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config).then((response) => response.data);
  }

  // Auth-specific methods
  public async login(email: string, password: string): Promise<any> {
    try {
      const response = await this.post('/auth/login', { email, password });

      // Handle 2FA response
      if (response.requires_two_factor) {
        return response;
      }

      // Tokens will be automatically updated by the interceptor
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  public async verifyEmail(token: string): Promise<any> {
    try {
      const response = await this.post('/auth/verify-email', { token });
      return response;
    } catch (error) {
      console.error('Verify email error:', error);
      throw error;
    }
  }

  public async logout(): Promise<any> {
    try {
      const response = await this.post('/auth/logout');
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      // Always clear local data
      this.clearAuthData();
    }
  }

  public async refreshToken(refreshToken: string): Promise<any> {
    try {
      const response = await this.post('/auth/refresh-token', {
        refresh_token: refreshToken
      });

      if (response.access_token && response.refresh_token) {
        this.updateTokens(response.access_token, response.refresh_token);
      }

      return response;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }

  // =================================================================
  // Company Information
  // =================================================================
  public getCompanyInformation<T = any>(): Promise<T> {
    return this.get<T>('/company-information');
  }

  public updateBankAccounts<T = any>(data: any): Promise<T> {
    return this.put<T>('/company-information/bank-accounts', {
      bank_accounts: data
    });
  }

  public updateCryptoWallets<T = any>(data: any): Promise<T> {
    return this.put<T>('/company-information/crypto-wallets', {
      crypto_wallets: data
    });
  }

  // =================================================================
  // Manual Deposits (User)
  // =================================================================
  public getCompanyAccountDetails<T = any>(
    method: string,
    currency: string
  ): Promise<T> {
    return this.get<T>(
      `/manual-deposits/company-account/${method}/${currency}`
    );
  }

  public createManualDeposit<T = any>(data: any): Promise<T> {
    return this.post<T>('/manual-deposits', data);
  }

  public getManualDeposits<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/manual-deposits/history', { params });
  }

  public uploadDepositProof<T = any>(
    depositId: string,
    formData: FormData
  ): Promise<T> {
    return this.put<T>(`/manual-deposits/${depositId}/proof`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  // =================================================================
  // Manual Deposits (Admin)
  // =================================================================
  public getPendingManualDeposits<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/manual-deposits/admin/pending', { params });
  }

  public confirmManualDeposit<T = any>(
    depositId: string,
    notes: string
  ): Promise<T> {
    return this.post<T>(`/manual-deposits/admin/${depositId}/confirm`, {
      notes
    });
  }

  public rejectManualDeposit<T = any>(
    depositId: string,
    reason: string
  ): Promise<T> {
    return this.post<T>(`/manual-deposits/admin/${depositId}/reject`, {
      reason
    });
  }

  // =================================================================
  // Transfers
  // =================================================================
  public validateRecipientAccount<T = any>(accountNumber: string): Promise<T> {
    return this.get<T>('/transfer/validate-account', {
      params: { account_number: accountNumber }
    });
  }

  public getTransferLimits<T = any>(): Promise<T> {
    return this.get<T>('/transfer/limits');
  }

  public initiateTransfer<T = any>(data: any): Promise<T> {
    return this.post<T>('/transfer/transfer', data);
  }

  public getUserTransfers<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/transfers', { params });
  }

  public getScheduledTransfers<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/transfers/scheduled', { params });
  }

  public cancelTransfer<T = any>(
    transferId: string,
    reason: string
  ): Promise<T> {
    return this.post<T>(`/transfers/${transferId}/cancel`, { reason });
  }

  public scheduleTransfer<T = any>(data: any): Promise<T> {
    return this.post<T>('/transfer/schedule', data);
  }

  public cancelScheduledTransfer<T = any>(transferId: string): Promise<T> {
    return this.post<T>(`/transfers/scheduled/${transferId}/cancel`);
  }

  public getTransferFees<T = any>(
    amount: number,
    currency: string,
    type: string
  ): Promise<T> {
    return this.get<T>('/transfer/fees', {
      params: { amount, currency, type }
    });
  }

  public getTransferDetails<T = any>(transferId: string): Promise<T> {
    return this.get<T>(`/transfers/${transferId}`);
  }

  // =================================================================
  // Loans
  // =================================================================
  public applyForLoan<T = any>(data: any): Promise<T> {
    return this.post<T>('/loans/apply', data);
  }

  public getUserLoans<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/loans', { params });
  }

  public checkEligibility<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/loans/eligibility', { params });
  }

  public calculateLoan<T = any>(data: any): Promise<T> {
    return this.post<T>('/loans/calculate', data);
  }

  public getLoanDetails<T = any>(loanId: string): Promise<T> {
    return this.get<T>(`/loans/${loanId}`);
  }

  public makeRepayment<T = any>(loanId: string, data: any): Promise<T> {
    return this.post<T>(`/loans/${loanId}/repay`, data);
  }

  public getRepaymentSchedule<T = any>(loanId: string): Promise<T> {
    return this.get<T>(`/loans/${loanId}/schedule`);
  }

  public getLoanDocuments<T = any>(loanId: string): Promise<T> {
    return this.get<T>(`/loans/${loanId}/documents`);
  }

  public uploadLoanDocument<T = any>(
    loanId: string,
    formData: FormData
  ): Promise<T> {
    return this.post<T>(`/loans/${loanId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  public cancelLoanApplication<T = any>(
    loanId: string,
    reason: string
  ): Promise<T> {
    return this.post<T>(`/loans/${loanId}/cancel`, { reason });
  }

  public getLoanSummary<T = any>(): Promise<T> {
    return this.get<T>('/loans/summary');
  }

  public getPendingLoans<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/admin/loans', {
      params: { ...params, status: 'pending' }
    });
  }

  public approveLoan<T = any>(loanId: string, notes: string): Promise<T> {
    return this.post<T>(`/admin/loans/${loanId}/approve`, { notes });
  }

  public rejectLoan<T = any>(loanId: string, reason: string): Promise<T> {
    return this.post<T>(`/admin/loans/${loanId}/reject`, { reason });
  }

  // =================================================================
  // Cards
  // =================================================================
  public requestCard<T = any>(data: any): Promise<T> {
    return this.post<T>('/cards/request', data);
  }

  public getUserCards<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/cards', { params });
  }

  public getPendingCardRequests<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/admin/cards/pending', { params });
  }

  public approveCardRequest<T = any>(cardId: string): Promise<T> {
    return this.post<T>(`/admin/cards/${cardId}/approve`);
  }

  public rejectCardRequest<T = any>(
    cardId: string,
    reason: string
  ): Promise<T> {
    return this.post<T>(`/admin/cards/${cardId}/reject`, { reason });
  }

  public getCardTransactions<T = any>(
    cardId: string,
    params: any = {}
  ): Promise<T> {
    return this.get<T>(`/cards/${cardId}/transactions`, { params });
  }

  public getCardUsageSummary<T = any>(
    cardId: string,
    period: string = 'month'
  ): Promise<T> {
    return this.get<T>(`/cards/${cardId}/summary`, { params: { period } });
  }

  public getCardDetails<T = any>(cardId: string): Promise<T> {
    return this.get<T>(`/cards/${cardId}`);
  }

  public updateCard<T = any>(cardId: string, data: any): Promise<T> {
    return this.put<T>(`/cards/${cardId}`, data);
  }

  public activateCard<T = any>(cardId: string): Promise<T> {
    return this.post<T>(`/cards/${cardId}/activate`);
  }

  public blockCard<T = any>(cardId: string, reason: string): Promise<T> {
    return this.post<T>(`/cards/${cardId}/block`, { reason });
  }

  public reportCardLost<T = any>(cardId: string): Promise<T> {
    return this.post<T>(`/cards/${cardId}/report-lost`);
  }

  public reportCardStolen<T = any>(cardId: string): Promise<T> {
    return this.post<T>(`/cards/${cardId}/report-stolen`);
  }

  public updateCardLimits<T = any>(cardId: string, limits: any): Promise<T> {
    return this.put<T>(`/cards/${cardId}/limits`, limits);
  }

  public getVirtualCardDetails<T = any>(cardId: string): Promise<T> {
    return this.get<T>(`/cards/virtual/${cardId}`);
  }

  public generateVirtualCard<T = any>(accountId: bigint): Promise<T> {
    return this.post<T>(`/accounts/${accountId}/virtual-card`);
  }

  // =================================================================
  // Additional Auth Methods
  // =================================================================
  public async register(userData: any): Promise<any> {
    try {
      const response = await this.post('/auth/register', userData);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  public async forgotPassword(email: string): Promise<any> {
    try {
      const response = await this.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  public async resetPassword(token: string, newPassword: string): Promise<any> {
    try {
      const response = await this.post('/auth/reset-password', {
        token,
        new_password: newPassword
      });
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  public async changePassword(data: {
    current_password: string;
    new_password: string;
  }): Promise<any> {
    try {
      const response = await this.post('/auth/change-password', data);
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  public async verifyTwoFactor(tempToken: string, code: string): Promise<any> {
    try {
      const response = await this.post('/auth/verify-2fa', {
        temp_token: tempToken,
        code
      });

      // Update tokens if present
      if (response.access_token && response.refresh_token) {
        this.updateTokens(response.access_token, response.refresh_token);
      }

      return response;
    } catch (error) {
      console.error('2FA verification error:', error);
      throw error;
    }
  }

  public async getProfile<T = any>(): Promise<T> {
    return this.get<T>('/auth/profile');
  }

  public async resendVerification(email: string): Promise<any> {
    try {
      const response = await this.post('/auth/resend-verification', { email });
      return response;
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  }

  // =================================================================
  // Utility Methods
  // =================================================================

  public isAuthenticated(): boolean {
    const { accessToken, isAuthenticated } = useAuthStore.getState();
    return (
      !!(accessToken || localStorage.getItem('access_token')) && isAuthenticated
    );
  }

  public getCurrentToken(): string | null {
    const { accessToken } = useAuthStore.getState();
    return accessToken || localStorage.getItem('access_token');
  }

  // =================================================================
  // Account Management
  // =================================================================
  public getUserAccounts<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/accounts', { params });
  }

  public getAccountDetails<T = any>(accountId: string): Promise<T> {
    return this.get<T>(`/accounts/${accountId}`);
  }

  public createAccount<T = any>(data: any): Promise<T> {
    return this.post<T>('/accounts', data);
  }

  public updateAccount<T = any>(accountId: string, data: any): Promise<T> {
    return this.put<T>(`/accounts/${accountId}`, data);
  }

  public getAccountTransactions<T = any>(
    accountId: string,
    params: any = {}
  ): Promise<T> {
    return this.get<T>(`/accounts/${accountId}/transactions`, { params });
  }

  // =================================================================
  // Transactions
  // =================================================================
  public getTransactionHistory<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/transactions', { params });
  }

  public getTransactionDetails<T = any>(transactionId: string): Promise<T> {
    return this.get<T>(`/transactions/${transactionId}`);
  }

  public exportTransactions<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/transactions/export', {
      params,
      responseType: 'blob'
    });
  }

  // =================================================================
  // User Management (Admin)
  // =================================================================
  public getUsers<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/admin/users', { params });
  }

  public getUserDetails<T = any>(userId: string): Promise<T> {
    return this.get<T>(`/admin/users/${userId}`);
  }

  public updateUserStatus<T = any>(userId: string, status: string): Promise<T> {
    return this.put<T>(`/admin/users/${userId}/status`, { status });
  }

  public updateUserRole<T = any>(userId: string, role: string): Promise<T> {
    return this.put<T>(`/admin/users/${userId}/role`, { role });
  }

  // =================================================================
  // Settings
  // =================================================================
  public getUserSettings<T = any>(): Promise<T> {
    return this.get<T>('/settings');
  }

  public updateUserSettings<T = any>(data: any): Promise<T> {
    return this.put<T>('/settings', data);
  }

  public updateNotificationSettings<T = any>(data: any): Promise<T> {
    return this.put<T>('/settings/notifications', data);
  }

  public updateSecuritySettings<T = any>(data: any): Promise<T> {
    return this.put<T>('/settings/security', data);
  }

  // =================================================================
  // Support/Contact
  // =================================================================
  public submitContactForm<T = any>(data: any): Promise<T> {
    return this.post<T>('/contact', data);
  }

  public getSupportTickets<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/support/tickets', { params });
  }

  public createSupportTicket<T = any>(data: any): Promise<T> {
    return this.post<T>('/support/tickets', data);
  }

  public getTicketDetails<T = any>(ticketId: string): Promise<T> {
    return this.get<T>(`/support/tickets/${ticketId}`);
  }

  public addTicketReply<T = any>(
    ticketId: string,
    message: string
  ): Promise<T> {
    return this.post<T>(`/support/tickets/${ticketId}/reply`, { message });
  }

  // =================================================================
  // Voice Balance Requests
  // =================================================================
  public requestVoiceBalance<T = any>(data: any): Promise<T> {
    return this.post<T>('/voice-balance', data);
  }

  public getVoiceBalanceHistory<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/voice-balance/history', { params });
  }

  // =================================================================
  // File Uploads
  // =================================================================
  public uploadFile<T = any>(formData: FormData): Promise<T> {
    return this.post<T>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  public uploadProfileImage<T = any>(formData: FormData): Promise<T> {
    return this.post<T>('/upload/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  public uploadDocument<T = any>(formData: FormData): Promise<T> {
    return this.post<T>('/upload/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
}

export const apiClient = ApiClient.getInstance();
