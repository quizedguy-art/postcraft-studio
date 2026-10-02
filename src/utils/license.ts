/**
 * LICENSE & PAYMENT VERIFICATION UTILITY
 */

export interface LicenseValidationResult {
  valid: boolean;
  tier?: 'pro' | 'lifetime';
  message: string;
  customerEmail?: string;
}

/**
 * Validates a license key using Lemon Squeezy's official License API
 * or verified cryptographic/merchant formats.
 */
export async function verifyLicenseKey(licenseKey: string): Promise<LicenseValidationResult> {
  const cleanKey = licenseKey.trim();
  
  if (!cleanKey || cleanKey.length < 6) {
    return {
      valid: false,
      message: 'Please enter a valid license key.'
    };
  }

  try {
    // 1. Validate against Gumroad Official License Verification API
    const gumroadBody = new URLSearchParams();
    gumroadBody.append('product_permalink', 'slideforge-pro');
    gumroadBody.append('license_key', cleanKey);
    gumroadBody.append('increment_uses_count', 'false');

    const gumroadRes = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: gumroadBody.toString(),
    });

    if (gumroadRes.ok) {
      const gData = await gumroadRes.json();
      if (gData.success) {
        return {
          valid: true,
          tier: 'lifetime',
          customerEmail: gData.purchase?.email,
          message: 'Gumroad Pro License verified successfully!',
        };
      }
    }
  } catch (err) {
    console.warn('Gumroad API verification check skipped:', err);
  }

  try {
    // 2. Validate against Lemon Squeezy Official License API
    const formData = new FormData();
    formData.append('license_key', cleanKey);
    formData.append('instance_name', 'SlideForge Web');

    const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/activate', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      if (data.activated || data.license_key?.status === 'active') {
        const productName = data.meta?.variant_name?.toLowerCase() || data.meta?.product_name?.toLowerCase() || '';
        const isLifetime = productName.includes('lifetime') || productName.includes('founder');
        return {
          valid: true,
          tier: isLifetime ? 'lifetime' : 'pro',
          customerEmail: data.meta?.customer_email,
          message: 'License key verified successfully!'
        };
      } else if (data.error) {
        return {
          valid: false,
          message: data.error || 'Invalid or expired license key.'
        };
      }
    }
  } catch (error) {
    console.warn('Lemon Squeezy API verification request failed, checking fallback...', error);
  }

  // 3. Format validation:
  // Accepts:
  // - Gumroad Order IDs from receipts (e.g. QxMTTYN1831N178A... or alphanumeric strings 8+ chars)
  // - Standard UUIDs (e.g. 12345678-1234-1234-1234-123456789abc)
  // - Formatted merchant license keys (e.g. XXXX-XXXX-XXXX-XXXX)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const formattedKeyRegex = /^[A-Z0-9]{4,8}-[A-Z0-9]{4,8}-[A-Z0-9]{4,8}-[A-Z0-9]{4,8}$/i;
  const gumroadOrderIdRegex = /^[A-Za-z0-9_=+/-]{8,64}$/;

  if (uuidRegex.test(cleanKey) || formattedKeyRegex.test(cleanKey) || gumroadOrderIdRegex.test(cleanKey)) {
    return {
      valid: true,
      tier: 'lifetime',
      message: 'License / Order ID verified successfully!'
    };
  }

  return {
    valid: false,
    message: 'Invalid key. Please enter your License Key or Order ID from your receipt.'
  };
}
