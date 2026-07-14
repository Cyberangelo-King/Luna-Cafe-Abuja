/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AuthConfig {
  ownerRegistered: boolean;
  ownerUsername: string;
  ownerPasswordHash: string; // Stored simply for this client-only persistence
  ownerEmail: string;
  staffUsername: string;
  staffPasswordHash: string;
}

const STORAGE_KEY = 'lolas_cafe_auth_config';

const DEFAULT_AUTH: AuthConfig = {
  ownerRegistered: false,
  ownerUsername: 'admin',
  ownerPasswordHash: 'boss2026', // Initial default if not registered, but she will register
  ownerEmail: 'faithakinboyejo@gmail.com',
  staffUsername: 'staff',
  staffPasswordHash: 'lola2026',
};

export function getAuthConfig(): AuthConfig {
  if (typeof window === 'undefined') return DEFAULT_AUTH;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_AUTH));
    return DEFAULT_AUTH;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_AUTH;
  }
}

export function saveAuthConfig(config: AuthConfig) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

// Check session authentication status
export function getSessionUserRole(): 'owner' | 'staff' | null {
  if (typeof window === 'undefined') return null;
  const role = sessionStorage.getItem('lola_user_role');
  return (role === 'owner' || role === 'staff') ? role : null;
}

export function setSessionUserRole(role: 'owner' | 'staff' | null) {
  if (typeof window === 'undefined') return;
  if (role) {
    sessionStorage.setItem('lola_user_role', role);
  } else {
    sessionStorage.removeItem('lola_user_role');
  }
}
