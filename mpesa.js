$('#login-form').on('submit', async function(e) {
  e.preventDefault();

  const sel = document.querySelector('input[name="plan"]:checked');
  if (!sel) {
    $('#message').text('Select a package');
    return;
  }

  const [duration, amount] = sel.value.split('|');
  const phone = $('#phone').val().trim();
  if (!/^(07|01)\d{8}$/.test(phone)) {
    $('#message').text('Invalid phone number');
    return;
  }

  try {
    const response = await fetch('https://your-proxy.com/mpesa/stkpush', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, amount })
    });

    const data = await response.json();
    if (data.ResponseCode !== '0') {
      throw new Error(data.errorMessage || 'Payment failed');
    }

    const expiryTime = Date.now() + parseDuration(duration);
    localStorage.setItem('expiry', expiryTime);
    window.location.href = 'status.html';
  } catch (err) {
    $('#message').text(err.message);
  }
});

function parseDuration(d) {
  const num = parseInt(d);
  if (d.endsWith('m')) return num * 60000;
  if (d.endsWith('h')) return num * 3600000;
  return 0;
}