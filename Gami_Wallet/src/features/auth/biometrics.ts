/**
 * Device biometrics (Face ID / Touch ID / fingerprint) via
 * expo-local-authentication. All functions are safe to call on simulators or
 * unsupported devices — they resolve to a sensible default rather than throwing.
 */
import * as LocalAuthentication from 'expo-local-authentication';

export async function isBiometricAvailable(): Promise<boolean> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && enrolled;
  } catch {
    return false;
  }
}

/**
 * Prompt for biometric authentication. Returns true on success, or true when no
 * biometrics are available (so it never hard-blocks the user on a simulator).
 */
export async function authenticate(promptMessage = 'Unlock Gami Wallet'): Promise<boolean> {
  try {
    const available = await isBiometricAvailable();
    if (!available) return true;
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      disableDeviceFallback: false,
    });
    return result.success;
  } catch {
    return false;
  }
}
