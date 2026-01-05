'use client';
import useLocalStorage from 'use-local-storage';

export interface TokenData {
  accessToken: string | null;
  refreshToken: string | null;
  user: {
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
    email_verified?: boolean;
    email_verified_at?: string;
  } | null;
  isAuthenticated: boolean;
}

const defaultTokenData: TokenData = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false
};

export const useTokenStorage = () => {
  const [tokenData, setTokenData] = useLocalStorage<TokenData>(
    'fidelity_auth',
    defaultTokenData
  );

  const setTokens = (
    accessToken: string | null,
    refreshToken: string | null,
    user?: TokenData['user']
  ) => {
    const newData: TokenData = {
      accessToken,
      refreshToken,
      user: user || tokenData.user,
      isAuthenticated: !!accessToken
    };
    setTokenData(newData);
    console.log('Tokens saved to localStorage:', {
      accessToken: !!accessToken,
      refreshToken: !!refreshToken
    });
  };

  const setUser = (user: TokenData['user']) => {
    setTokenData({
      ...tokenData,
      user
    });
  };

  const clearTokens = () => {
    setTokenData(defaultTokenData);
    console.log('Tokens cleared from localStorage');
  };

  const getAccessToken = (): string | null => {
    return tokenData.accessToken;
  };

  const getRefreshToken = (): string | null => {
    return tokenData.refreshToken;
  };

  const getUser = (): TokenData['user'] => {
    return tokenData.user;
  };

  const isAuthenticated = (): boolean => {
    return tokenData.isAuthenticated && !!tokenData.accessToken;
  };

  return {
    tokenData,
    setTokens,
    setUser,
    clearTokens,
    getAccessToken,
    getRefreshToken,
    getUser,
    isAuthenticated
  };
};
