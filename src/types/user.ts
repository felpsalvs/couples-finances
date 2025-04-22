export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  partnerId?: string; // ID of the partner user, if connected
  settings: UserSettings;
}

export interface UserSettings {
  defaultCurrency: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  shareAllTransactionsWithPartner: boolean;
  defaultSplitRatio?: number; // Default percentage for this user in shared expenses (0-1)
}