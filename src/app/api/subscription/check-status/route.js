import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { setUserSubscription } from '@/lib/db';

async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('aethera_session');
    
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }
    
    return JSON.parse(sessionCookie.value);
  } catch (e) {
    return null;
  }
}

export async function GET(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mandateId = searchParams.get('mandateId');

    if (!mandateId) {
      return NextResponse.json({ error: 'Missing mandateId parameter' }, { status: 400 });
    }

    // 1. Sandbox/Mock Mode check (if it's a simulated mandate ID)
    if (mandateId.startsWith('mn_sim_') || mandateId.startsWith('REF_')) {
      // For mock checkout in development, automatically succeed
      const updatedUser = setUserSubscription(sessionUser.username, true);
      return NextResponse.json({
        success: true,
        status: 'Active',
        gatewayStatus: 'ACTIVE'
      });
    }

    // 2. Real RocketPay Gateway Status Check
    const rpToken = process.env.ROCKETPAY_TOKEN;
    const rpBaseUrl = process.env.ROCKETPAY_API_BASE_URL || 'https://api-staging.rocketpay.co.in/v4/';
    const rpMerchantId = process.env.ROCKETPAY_APP_CONTEXT || '';

    const cleanBaseUrl = rpBaseUrl.endsWith('/') ? rpBaseUrl : `${rpBaseUrl}/`;
    
    // 2.1 Trigger mandate refresh status on RocketPay so they query the live banking network
    try {
      const refreshUrl = `${cleanBaseUrl}mandates/${mandateId}/refresh`;
      await fetch(refreshUrl, {
        method: 'POST',
        headers: {
          'x-app-context': rpMerchantId,
          'x-token': rpToken,
          'Content-Type': 'application/json'
        }
      });
    } catch (refreshErr) {
      console.warn(`[check-status] Mandate refresh call failed, moving to get status directly:`, refreshErr.message);
    }

    // 2.2 Retrieve the updated status
    const apiUrl = `${cleanBaseUrl}mandates/${mandateId}`;
    const gatewayRes = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-app-context': rpMerchantId,
        'x-token': rpToken,
        'Content-Type': 'application/json'
      }
    });

    if (!gatewayRes.ok) {
      const errorText = await gatewayRes.text();
      console.error(`[check-status] RocketPay error: ${gatewayRes.status} - ${errorText}`);
      return NextResponse.json({ error: `Gateway status check failed: ${gatewayRes.status}` }, { status: 400 });
    }

    const resData = await gatewayRes.json();
    const gatewayStatus = resData.state || resData.status || (resData.data && resData.data.status) || 'UNKNOWN';

    // Transaction checks (if transaction failed)
    const txns = resData.meta?.txns || [];
    const txnStatus = txns.length > 0 ? txns[0].state : null;
    const txnFailed = txnStatus && ['FAILED', 'EXPIRED', 'CANCELLED'].includes(txnStatus);

    let localStatus = 'Pending';
    let effectiveStatus = gatewayStatus;

    if (gatewayStatus === 'ACTIVE' || gatewayStatus === 'ACTIVATED') {
      localStatus = 'Active';
      // Activate subscription in local DB
      setUserSubscription(sessionUser.username, true);
    } else if (['REVOKED', 'FAILED', 'CANCELLED'].includes(gatewayStatus) || txnFailed) {
      localStatus = 'Cancelled';
      if (txnFailed && !['REVOKED', 'FAILED', 'CANCELLED', 'ACTIVE', 'ACTIVATED'].includes(gatewayStatus)) {
        effectiveStatus = 'FAILED';
      }
    }

    return NextResponse.json({
      success: true,
      status: localStatus,
      gatewayStatus: effectiveStatus,
      txnStatus
    });

  } catch (e) {
    console.error('[check-status] Route error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
