let mpesaConfig = {};

async function loadMpesaConfig() {
  const res = await fetch('mpesa_config.json');
  mpesaConfig = await res.json();
}

$('#login-form').on('submit', async function (e) {
  e.preventDefault();

  const sel = document.querySelector('input[name="plan"]:checked');
  const phone = $('#phone').val().trim();

  if (!sel || !/^(07|01)\d{8}$/.test(phone)) {
    $('#message').text('Select a valid package and phone number');
    return;
  }

  const [duration, amount] = sel.value.split('|');

  try {
    // Load config if not already loaded
    if (!mpesaConfig.MPESA_SHORTCODE) await loadMpesaConfig();

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = btoa(
      mpesaConfig.MPESA_SHORTCODE +
      mpesaConfig.MPESA_PASSKEY +
      timestamp
    );

    const oauthURL = mpesaConfig.ENV === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

    const stkPushURL = mpesaConfig.ENV === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
      : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    // Get access token
    const tokenRes = await fetch(oauthURL, {
      headers: {
        Authorization: 'Basic ' + btoa(
          `${mpesaConfig.MPESA_CONSUMER_KEY}:${mpesaConfig.MPESA_CONSUMER_SECRET}`
        )
      }
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Make STK Push request
    const pushRes = await fetch(stkPushURL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        BusinessShortCode: mpesaConfig.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: mpesaConfig.PAYMENT_TYPE === 'Paybill'
          ? 'CustomerPayBillOnline'
          : 'CustomerBuyGoodsOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: mpesaConfig.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: mpesaConfig.MPESA_CALLBACK_URL,
        AccountReference: 'WIFI',
        TransactionDesc: 'WiFi Access Payment'
      })
    });

    const result = await pushRes.json();

    if (result.ResponseCode !== '0') {
      throw new Error(result.errorMessage || 'Payment failed.');
    }

    // Store session expiration time
     const expiryTime = Date.now() + parseDuration(duration);
    // Store phone for auto-login
    localStorage.setItem('phone', phone);
    localStorage.setItem('expiry', expiryTime);
    window.location.href = 'status.html';
  } catch (err) {
    $('#message').text(err.message);
  }
});

function parseDuration(d) {
  const n = parseInt(d, 10);
  return d.endsWith('m') ? n * 60000 : n * 3600000;
}
