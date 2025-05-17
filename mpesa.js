$('#login-form').on('submit', async function(e) {
  e.preventDefault();
  const [duration, amount] = this.plan.value.split('|');
  const phone = this.phone.value.trim();

  if (!/^(07|01)[0-9]{8}$/.test(phone)) {
    $('#message').text('Please enter a valid phone number starting with 07 or 01');
    return;
  }

  try {
    const stk = await fetch('https://your-proxy.com/mpesa/stkpush', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ phone, amount })
    }).then(r => r.json());

    if (stk.ResponseCode !== '0') throw new Error(stk.errorMessage || 'STK Push failed');

    const expiryTime = Date.now() + parseDuration(duration);
    localStorage.setItem('checkoutId', stk.CheckoutRequestID);
    localStorage.setItem('expiry', expiryTime);

    window.location.href = `status.html?mac=${getUrlParam('mac')}&ip=${getUrlParam('ip')}&dst=${getUrlParam('dst')}`;
  } catch (err) {
    $('#message').text(err.message);
  }
});

function getUrlParam(k) {
  return new URLSearchParams(location.search).get(k) || '';
}

function parseDuration(d) {
  const n = parseInt(d);
  return d.endsWith('m') ? n*60000 : n*3600000;
}