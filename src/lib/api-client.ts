import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';

class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;

  private constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
      timeout: 30000,
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
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/refresh-token`,
                { refresh_token: refreshToken }
              );

              localStorage.setItem('access_token', data.access_token);
              localStorage.setItem('refresh_token', data.refresh_token);

              originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Clear tokens and redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

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

  // NEW METHODS ADDED HERE
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

  // ADDED MISSING LOAN METHODS
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
}

export const apiClient = ApiClient.getInstance();
