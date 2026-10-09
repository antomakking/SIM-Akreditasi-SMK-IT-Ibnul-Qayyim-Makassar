import { UserRole, UserProfile } from './akreditasi';

export interface UserAccount extends UserProfile {
  id: string;
  username: string;
  password: string;
  permissions: string[];
  lastLogin?: string;
  avatarBg?: string;
  isDefault?: boolean;
}

export interface AuthSession {
  isLoggedIn: boolean;
  currentUser: UserAccount;
  loginTime?: string;
  rememberMe?: boolean;
}

export interface RolePermissionDetail {
  role: UserRole;
  label: string;
  badgeColor: string;
  deskripsi: string;
  canEditEvaluasi: boolean;
  canUploadBukti: boolean;
  canValidate: boolean;
  canManageUsers: boolean;
  canExportReport: boolean;
  canConfigureDb: boolean;
  aksesModul: string[];
}
