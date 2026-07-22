const WMS_BASE = process.env.WMS_BASE || 'https://wms.techbridge.edu.gh';

export async function verifyWmsToken(token: string) {
  try {
    const response = await fetch(`${WMS_BASE}/api/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      throw new Error('Failed to verify token with WMS');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error verifying WMS token:', error);
    throw error;
  }
}

export async function refreshWmsSession(refreshCookie: string) {
  try {
    const response = await fetch(`${WMS_BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Cookie': `wms_refresh=${refreshCookie}`,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh WMS session');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error refreshing WMS session:', error);
    throw error;
  }
}
