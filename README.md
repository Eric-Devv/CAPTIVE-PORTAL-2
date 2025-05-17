# Captive Portal for PLUSNET WIFI with M-PESA Daraja Integration (Single Directory)

This is a lightweight, modern captive portal built using only HTML, CSS, and JavaScript. Designed to run directly on MikroTik routers, it uses M-PESA Daraja API for STK Push payments to unlock internet access. No backend is required.

---

## 📁 Directory Structure
easywisp-plusnet-portal/
├── login.html # Main login & payment page
├── status.html # Optional status page after login
├── success.html # Redirect page after successful payment
├── prices.json # Package plans and metadata
├── style.css # Global styles
├── mpesa.js # Handles M-PESA STK Push logic
├── jquery.min.js # jQuery (for compatibility)
├── md5.js # Used for MikroTik CHAP login if needed
├── swal.min.js # SweetAlert for alerts
└── assets/
└── logo.png # PLUSNET Logo


---

## 💻 Features
- 📶 Captive portal styled UI
- 🧾 Six customizable internet packages
- ✅ M-PESA STK Push via Daraja API
- 📱 Phone number validation (Kenyan format only)
- ⏱️ Auto-expiry based on package duration
- ⚡ Simple, file-based setup for MikroTik hotspot

---

## 🔧 Setup Instructions
1. **Configure MikroTik** hotspot with login.html as the login page.
2. **Upload files** to the router's web folder or serve locally.
3. **Ensure Daraja API credentials** are correctly configured in `mpesa.js`.
4. **Customize `prices.json`** with your preferred packages.
5. **Update hotspot settings** to redirect to `success.html` after login.

---

## ✨ login.html UI
This file loads the packages dynamically from `prices.json` and handles:
- Package selection
- Phone input validation
- STK push payment trigger
- Auto login on successful payment

Preview of package layout:
```html
<label>
  <input type="radio" name="plan" value="100MB|5|30m" />
  <div>
    <h2>100MB</h2>
    <p>KES 5 – 30m</p>
  </div>
</label>

Phone input validation ensures format like 07XXXXXXXX or 01XXXXXXXX (10-digit).

