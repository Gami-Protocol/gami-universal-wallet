export const GAMI_API_URL = 'https://api.gamiprotocol.xyz';
export const GAMI_DASHBOARD_URL = 'https://gamiprotocol.xyz/dashboard';

export type ExtensionPermissionState = {
  enabled: boolean;
  domainAllowlist: string[];
  userConsent: boolean;
  analyticsEnabled: boolean;
};

export const DEFAULT_PERMISSION_STATE: ExtensionPermissionState = {
  enabled: false,
  domainAllowlist: [],
  userConsent: false,
  analyticsEnabled: false,
};
