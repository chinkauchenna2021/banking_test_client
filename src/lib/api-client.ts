import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import { useAuthStore } from '@/stores/auth.store';

class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;
  private isRefreshing = false;
  private failedQueue: any[] = [];

  // Base URLs for different environments
  private getBaseURL(): string {
    if (typeof window === 'undefined') {
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }

  private constructor() {
    this.client = axios.create({
      baseURL: this.getBaseURL(),
      timeout: 3000000,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    this.setupInterceptors();
  }

  private getAuthState() {
    return useAuthStore.getState();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Skip token for auth endpoints (except refresh token)
        const skipAuthHeader = [
          '/auth/login',
          '/auth/register',
          '/auth/forgot-password',
          '/auth/reset-password',
          '/auth/verify-email',
          '/auth/refresh-token',
          '/auth/verify-2fa',
          '/auth/resend-verification'
        ].some((path) => config.url?.includes(path));

        if (skipAuthHeader) {
          return config;
        }

        // Get token from Zustand store
        const { accessToken } = this.getAuthState();

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
          console.warn('No access token found for request:', config.url);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Extract and update tokens from response if present
        const tokens = this.extractTokensFromResponse(response.data);

        if (tokens.accessToken) {
          this.updateAuthState(tokens);
        }

        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

        // Handle 401 Unauthorized errors
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !isAuthEndpoint
        ) {
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
            const { refreshToken } = this.getAuthState();

            if (refreshToken) {
              // Call refresh token endpoint
              const response = await axios.post(
                `${this.getBaseURL()}/auth/refresh-token`,
                { refresh_token: refreshToken }
              );

              const tokens = this.extractTokensFromResponse(response.data);

              if (tokens.accessToken) {
                // Update auth state
                this.updateAuthState(tokens);

                // Process queued requests
                this.failedQueue.forEach((prom) =>
                  prom.resolve(tokens.accessToken)
                );
                this.failedQueue = [];

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
                return this.client(originalRequest);
              } else {
                throw new Error('No access token in refresh response');
              }
            } else {
              throw new Error('No refresh token available');
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);

            // Process queued requests with error
            this.failedQueue.forEach((prom) => prom.reject(refreshError));
            this.failedQueue = [];

            // Clear auth state
            this.getAuthState().logout();

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // =================================================================
  // User Routes (change from '/user/' to '/users/')
  // =================================================================
  public getUserProfile<T = any>(): Promise<T> {
    return this.get<T>('/users/profile');
  }

  public updateUserProfile<T = any>(updateData: any): Promise<T> {
    const isFormData =
      typeof FormData !== 'undefined' && updateData instanceof FormData;
    return this.put<T>('/users/profile', updateData, {
      headers: isFormData
        ? {
            'Content-Type': 'multipart/form-data'
          }
        : undefined
    });
  }

  public submitKYC<T = any>(formData: FormData): Promise<T> {
    return this.post<T>('/users/kyc/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  public getUserDashboard<T = any>(): Promise<T> {
    return this.get<T>('/users/dashboard');
  }

  public getUserActivity<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/users/activity', { params });
  }

  // =================================================================
  // Transfer Routes
  // =================================================================
  public getTransferLimits<T = any>(): Promise<T> {
    return this.get<T>('/transfers/limits'); // Changed from '/transfer/limits'
  }

  public initiateTransfer<T = any>(data: any): Promise<T> {
    return this.post<T>('/transfers', data); // Changed from '/transfer/transfer'
  }

  public getTransferFees<T = any>(
    amount: number,
    currency: string,
    type: string
  ): Promise<T> {
    return this.get<T>('/transfers/fees', {
      // Changed from '/transfer/fees'
      params: { amount, currency, type }
    });
  }

  // =================================================================
  // Transaction Routes
  // =================================================================
  public getRecentTransactions<T = any>(limit: number = 10): Promise<T> {
    return this.get<T>('/transactions/recent', { params: { limit } });
  }

  // =================================================================
  // Other Routes (these should now work after adding them to api.routes.ts)
  // =================================================================
  public getCards<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/cards', { params });
  }

  public getLoans<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/loans', { params });
  }

  public getReceipts<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/receipts', { params });
  }

  public getManualDeposits<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/manual-deposits/history', { params });
  }

  private extractTokensFromResponse(responseData: any) {
    let accessToken = null;
    let refreshToken = null;
    let user = null;

    if (responseData && typeof responseData === 'object') {
      // Direct properties
      if (responseData.access_token) {
        accessToken = responseData.access_token;
      }
      if (responseData.refresh_token) {
        refreshToken = responseData.refresh_token;
      }
      if (responseData.user) {
        user = responseData.user;
      }

      // Nested in data property
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

  private updateAuthState({ accessToken, refreshToken, user }: any) {
    const store = useAuthStore.getState();

    // Only update if we have new tokens
    if (accessToken || refreshToken || user) {
      // Create a partial state update
      const updatedState: Partial<typeof store> = {};

      if (accessToken !== undefined) updatedState.accessToken = accessToken;
      if (refreshToken !== undefined) updatedState.refreshToken = refreshToken;
      if (user !== undefined) updatedState.user = user;
      if (accessToken !== undefined)
        updatedState.isAuthenticated = !!accessToken;

      // Use Zustand's set function to update state
      useAuthStore.setState(updatedState);
    }
  }

  private clearAuthData(): void {
    // Clear any additional localStorage items
    localStorage.removeItem('pending_verification_email');

    // Zustand will handle clearing the persisted state automatically
    console.log('Auth data cleared');
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
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
      const requiresTwoFactor =
        response?.requires_two_factor || response?.data?.requires_two_factor;
      if (requiresTwoFactor) {
        return {
          ...response,
          requires_two_factor: true,
          temp_token: response?.temp_token || response?.data?.temp_token
        };
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
  // Deposits (Automated)
  // =================================================================
  public getDepositMethods<T = any>(): Promise<T> {
    return this.get<T>('/deposits/methods');
  }

  public initiateDeposit<T = any>(data: any): Promise<T> {
    return this.post<T>('/deposits', data);
  }

  public bankTransferDeposit<T = any>(formData: FormData): Promise<T> {
    return this.post<T>('/deposits/bank-transfer', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  public cryptoDeposit<T = any>(data: any): Promise<T> {
    return this.post<T>('/deposits/crypto', data);
  }

  public cardDeposit<T = any>(data: any): Promise<T> {
    return this.post<T>('/deposits/card', data);
  }

  public getDeposits<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/deposits', { params });
  }

  public getDepositDetails<T = any>(depositId: string): Promise<T> {
    return this.get<T>(`/deposits/${depositId}`);
  }

  public cancelDeposit<T = any>(
    depositId: string,
    reason?: string
  ): Promise<T> {
    return this.post<T>(`/deposits/${depositId}/cancel`, { reason });
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

  // public getManualDeposits<T = any>(params: any = {}): Promise<T> {
  //   return this.get<T>('/manual-deposits/history', { params });
  // }

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
    return this.get<T>('/transfers/validate-account', {
      params: { account_number: accountNumber }
    });
  }

  // public getTransferLimits<T = any>(): Promise<T> {
  //   return this.get<T>('/transfer/limits');
  // }

  // public initiateTransfer<T = any>(data: any): Promise<T> {
  //   return this.post<T>('/transfer/transfer', data);
  // }

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
    return this.post<T>('/transfers/schedule', data);
  }

  public cancelScheduledTransfer<T = any>(transferId: string): Promise<T> {
    return this.post<T>(`/transfers/scheduled/${transferId}/cancel`);
  }

  // public getTransferFees<T = any>(
  //   amount: number,
  //   currency: string,
  //   type: string
  // ): Promise<T> {
  //   return this.get<T>('/transfer/fees', {
  //     params: { amount, currency, type }
  //   });
  // }

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

  // =================================================================
  // Cards
  // =================================================================
  public requestCard<T = any>(data: any): Promise<T> {
    return this.post<T>('/cards/request', data);
  }

  public getUserCards<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/cards', { params });
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
    return this.get<T>(`/cards/${cardId}/summary`, {
      params: { period }
    });
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
    return this.post<T>(`/cards/accounts/${accountId}/virtual-card`);
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
    return this.post<T>('/transactions/export', undefined, {
      params,
      responseType: 'blob'
    });
  }

  // =================================================================
  // User Management (Admin)
  // =================================================================

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
    return this.post<T>('/voice/balance/request', data);
  }

  public getVoiceBalanceHistory<T = any>(params: any = {}): Promise<T> {
    return this.get<T>('/voice/balance/requests', { params });
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

  // In api-client.ts, update/add these methods:

  public getTransactionStats<T = any>(): Promise<T> {
    return this.get<T>('/transactions/stats');
  }

  public searchTransactions<T = any>(
    query: string,
    limit: number = 20
  ): Promise<T> {
    return this.get<T>('/transactions/search', {
      params: { query, limit }
    });
  }

  public getDashboardTransactions<T = any>(
    limit: number = 5,
    days: number = 7,
    accountId?: string
  ): Promise<T> {
    const params: any = { limit, days };
    if (accountId) params.account_id = accountId;

    return this.get<T>('/transactions/dashboard', { params });
  }

  // =================================================================
  // Enhanced Admin Routes - Based on your router
  // =================================================================

  // Dashboard
  public getDashboardStats<T = any>(): Promise<T> {
    return this.get<T>('/admin/dashboard');
  }

  public getEnhancedDashboardStats<T = any>(): Promise<T> {
    return this.get<T>('/admin/dashboard/enhanced');
  }

  // User Management
  public getUsers<T = any>(params?: any): Promise<T> {
    return this.get<T>('/admin/users', { params });
  }

  public createAdminUser<T = any>(data: any): Promise<T> {
    return this.post<T>('/admin/users', data);
  }

  public getEnhancedUsers<T = any>(params?: any): Promise<T> {
    return this.get<T>('/admin/users/enhanced', { params });
  }

  public getUserDetails<T = any>(userId: string): Promise<T> {
    return this.get<T>(`/admin/users/${userId}/details`);
  }

  public updateUserStatus<T = any>(
    userId: string,
    status: string,
    reason?: string
  ): Promise<T> {
    return this.patch<T>(`/admin/users/${userId}/status`, { status, reason });
  }

  public createAdminUserAccount<T = any>(
    userId: string,
    data: any
  ): Promise<T> {
    return this.post<T>(`/admin/users/${userId}/accounts`, data);
  }

  public updateAdminUserProfile<T = any>(
    userId: string,
    data: any
  ): Promise<T> {
    return this.put<T>(`/admin/users/${userId}/profile`, data);
  }

  public deleteUser<T = any>(userId: string, reason?: string): Promise<T> {
    return this.delete<T>(`/admin/users/${userId}`, { data: { reason } });
  }

  public restoreUser<T = any>(userId: string): Promise<T> {
    return this.post<T>(`/admin/users/${userId}/restore`);
  }

  public updateUserBalance<T = any>(
    userId: string,
    data: { amount: number; reason: string; type: 'add' | 'deduct' | 'set' }
  ): Promise<T> {
    return this.post<T>(`/admin/users/${userId}/balance`, data);
  }

  public bulkUpdateUserStatus<T = any>(data: {
    userIds: string[];
    status: string;
    reason?: string;
  }): Promise<T> {
    return this.post<T>('/admin/users/bulk/status', data);
  }

  // Deposit Management
  public getAdminDeposits<T = any>(params?: any): Promise<T> {
    return this.get<T>('/admin/deposits', { params });
  }

  public getEnhancedDeposits<T = any>(params?: any): Promise<T> {
    return this.get<T>('/admin/deposits/enhanced', { params });
  }

  public getAdminDepositDetails<T = any>(depositId: string): Promise<T> {
    return this.get<T>(`/admin/deposits/${depositId}/details`);
  }

  public confirmDeposit<T = any>(
    depositId: string,
    notes?: string
  ): Promise<T> {
    return this.post<T>(`/admin/deposits/${depositId}/confirm`, { notes });
  }

  public updateDepositEvidence<T = any>(
    depositId: string,
    evidence: any
  ): Promise<T> {
    return this.put<T>(`/admin/deposits/${depositId}/evidence`, { evidence });
  }

  public verifyDepositEvidence<T = any>(
    depositId: string,
    data: { verified: boolean; notes?: string }
  ): Promise<T> {
    return this.post<T>(`/admin/deposits/${depositId}/verify`, data);
  }

  // Crypto Accounts Management
  public getCryptoAccounts<T = any>(params?: { user_id?: string }): Promise<T> {
    return this.get<T>('/admin/crypto-accounts', { params });
  }

  public verifyCryptoAccount<T = any>(
    paymentMethodId: string,
    data: { verified: boolean; notes?: string }
  ): Promise<T> {
    return this.post<T>(
      `/admin/crypto-accounts/${paymentMethodId}/verify`,
      data
    );
  }

  // Loan Management
  public getAdminLoans<T = any>(params?: any): Promise<T> {
    return this.get<T>('/admin/loans', { params });
  }

  public approveLoan<T = any>(loanId: string, notes?: string): Promise<T> {
    return this.post<T>(`/admin/loans/${loanId}/approve`, { notes });
  }

  public rejectLoan<T = any>(loanId: string, reason: string): Promise<T> {
    return this.post<T>(`/admin/loans/${loanId}/reject`, { reason });
  }

  // Card Management
  public getPendingCardRequests<T = any>(params?: any): Promise<T> {
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

  // Approval Queue
  public getApprovalQueue<T = any>(params?: any): Promise<T> {
    return this.get<T>('/admin/approvals', { params });
  }

  public processApproval<T = any>(
    approvalId: string,
    data: { action: string; notes?: string }
  ): Promise<T> {
    return this.post<T>(`/admin/approvals/${approvalId}/process`, data);
  }

  // Transaction Management
  public getTransactions<T = any>(params?: any): Promise<T> {
    return this.get<T>('/admin/transactions', { params });
  }

  public createAdminTransfer<T = any>(data: any): Promise<T> {
    return this.post<T>('/admin/transfers', data);
  }

  // Activity Monitoring
  public getUserActivities<T = any>(params?: {
    user_id?: string;
    limit?: number;
  }): Promise<T> {
    return this.get<T>('/admin/user-activities', { params });
  }

  public getAdminActionLogs<T = any>(params?: {
    admin_id?: string;
    limit?: number;
  }): Promise<T> {
    return this.get<T>('/admin/admin-action-logs', { params });
  }

  public getAuditLogs<T = any>(params?: any): Promise<T> {
    return this.get<T>('/admin/audit-logs', { params });
  }

  // System Management
  public getSystemAlerts<T = any>(): Promise<T> {
    return this.get<T>('/admin/system-alerts');
  }

  public generateReport<T = any>(options: any): Promise<T> {
    return this.post<T>('/admin/reports/generate', options);
  }

  public getSystemHealth<T = any>(): Promise<T> {
    return this.get<T>('/admin/system-health');
  }
}

export const apiClient = ApiClient.getInstance();
