import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { setUserSubscription } from '@/lib/db';
import crypto from 'crypto';

async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('aethera_session');

    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    return JSON.parse(sessionCookie.value);
  } catch (e) {
    console.error('Session authentication error inside subscription API:', e);
    return null;
  }
}

export async function POST(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { mobileNumber, name } = body;

    // 10-digit mobile number validation
    if (!mobileNumber || typeof mobileNumber !== 'string') {
      return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 });
    }

    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      return NextResponse.json({ error: 'Mobile number must be exactly 10 digits' }, { status: 400 });
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Customer name is required' }, { status: 400 });
    }

    if (name.includes('@')) {
      return NextResponse.json({ error: 'Customer name cannot be an email address' }, { status: 400 });
    }

    // Generate unique reference ID
    const randomHex = crypto.randomBytes(4).toString('hex');
    const referenceId = `REF_${Date.now()}_${randomHex}`;

    // Calculate tomorrow's date in Asia/Kolkata timezone
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tzDate = tomorrow.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' });
    const [month, day, year] = tzDate.split('/');
    const startDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    // Dynamic payload configuration matching the requested schema (DAILY frequency)
    const gatewayPayload = {
      customer: {
        mobile_number: `+91${cleanPhone}`,
        name: name.trim()
      },
      client_meta: {
        description: "jebfaewf"
      },
      mode: "UPI_AUTO_PAY",
      schedule: {
        frequency: "DAILY",
        time_zone: "Asia/Kolkata",
        advance_amount: 1.0,
        amount: 2990.0,
        installment_count: 10,
        start_date: startDate
      },
      reference_id: referenceId,
      reference_type: "MAIN"
    };

    // Forward request to RocketPay staging gateway API
    let gatewaySuccess = false;
    let gatewayError = null;
    let gatewayData = null;

    try {
      const baseUrl = process.env.ROCKETPAY_API_BASE_URL || 'https://api-staging.rocketpay.co.in/v4/';
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      const apiUrl = `${cleanBaseUrl}mandates`;

      const gatewayHeaders = {
        'Content-Type': 'application/json',
        'x-app-context': process.env.ROCKETPAY_APP_CONTEXT || '',
        'x-token': process.env.ROCKETPAY_TOKEN || ''
      };

      const gatewayRes = await fetch(apiUrl, {
        method: 'POST',
        headers: gatewayHeaders,
        body: JSON.stringify(gatewayPayload)
      });

      const responseBodyText = await gatewayRes.text();
      let responseBodyJson = null;
      try {
        responseBodyJson = JSON.parse(responseBodyText);
      } catch (parseError) {
        // Text is not JSON
      }

      console.log("\n=======================================================");
      console.log("🚀 FORWARDED TO ROCKETPAY STAGING MANDATES GATEWAY:");
      console.log("Request Payload:", JSON.stringify(gatewayPayload, null, 2));
      console.log(`HTTP Response Status: ${gatewayRes.status}`);
      console.log("Response Body:", responseBodyText);
      console.log("=======================================================\n");

      if (gatewayRes.ok) {
        gatewaySuccess = true;
        gatewayData = responseBodyJson;
      } else {
        gatewayError = responseBodyJson?.message || responseBodyJson?.error || `Gateway returned status ${gatewayRes.status}`;
      }
    } catch (fetchError) {
      console.error("Failed to fetch RocketPay staging mandates API:", fetchError);
      gatewayError = "Gateway network connection failure";
    }

    let paymentUrl = '';
    let qrUrl = '';
    let mandateId = '';
    if (gatewaySuccess && gatewayData) {
      if (gatewayData.meta && Array.isArray(gatewayData.meta.txns)) {
        for (const txn of gatewayData.meta.txns) {
          if (txn?.meta?.auth_meta?.QR) {
            qrUrl = txn.meta.auth_meta.QR;
            break;
          }
        }
      }
      paymentUrl = (gatewayData.meta && gatewayData.meta.mandate_auth_checkout_url)
        || qrUrl
        || gatewayData.payment_url
        || gatewayData.redirect_url
        || '';
      mandateId = gatewayData.id || gatewayData.mandate_id || '';
    }

    // In development/staging test mode, if the RocketPay staging server returns a timeout or failure,
    // we allow falling back to a mock success so that testing the app flow is not blocked by third-party outages.
    const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
    const isMockAllowed = process.env.ALLOW_MOCK_PAYMENT_FALLBACK !== 'false';
    const useFallback = !gatewaySuccess && isDev && isMockAllowed;

    if (gatewaySuccess || useFallback) {
      let isSubscribed = false;
      let finalMandateId = mandateId;

      if (useFallback) {
        // Automatically activate subscription immediately in database for fallback
        const updatedUser = setUserSubscription(sessionUser.username, true);
        isSubscribed = true;
        finalMandateId = `mn_sim_${referenceId}`;
        console.warn(`[Mock Payment Fallback] Gateway call failed with "${gatewayError}", but subscription was activated for testing in development.`);
      }

      return NextResponse.json({
        success: true,
        mocked: useFallback,
        paymentUrl: paymentUrl,
        qrUrl: qrUrl,
        mandateId: finalMandateId,
        user: {
          name: sessionUser.name,
          email: sessionUser.email,
          username: sessionUser.username,
          isSubscribed: isSubscribed
        }
      });
    } else {
      // Return gateway error so checkout handles it and displays it
      return NextResponse.json({
        error: `${gatewayError} (HTTP ${gatewayError === "Gateway network connection failure" ? '500' : '400'})`
      }, { status: 400 });
    }
  } catch (e) {
    console.error('POST subscription/purchase error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
