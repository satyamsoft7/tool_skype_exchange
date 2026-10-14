# CloudTrim Enterprise: Admin Management, MFA & Email OTP Architecture Guide

This guide details the complete technical architecture and zero-maintenance workflow for managing user accounts, enforcing Multi-Factor Authentication (MFA), sending Email OTPs, and handling customer support inquiries as a solo founder.

---

## 1. The Solo-Founder Tech Stack (Zero Infrastructure Maintenance)

To manage users without building a complex backend from scratch, use these managed platforms on their generous free tiers:

| Component | Recommended Tool | Free Tier Quota | Role in CloudTrim |
| :--- | :--- | :--- | :--- |
| **Authentication & MFA** | [Supabase Auth](https://supabase.com) or [Clerk](https://clerk.com) | 50,000 monthly active users ($0) | Manages user identities, session tokens, Email OTPs, and TOTP Multi-Factor Authentication. |
| **Transactional Email (OTP)** | [Resend](https://resend.com) | 3,000 emails/month ($0) | Sends instant 6-digit login codes, verification links, and billing receipts. |
| **Customer Support Inquiries** | [Crisp](https://crisp.chat) or [Tawk.to](https://www.tawk.to) | 100% Free forever (2 seats) | In-app live chat and ticketing inbox that routes user questions directly to your phone or email. |
| **Database & User Roles** | Supabase PostgreSQL | 500 MB database ($0) | Stores user records, tenant associations, and admin role permissions (`role: 'admin'`). |

---

## 2. Authentication, Email OTP & MFA Workflow

### A. How Email OTP (One-Time Passcode) Works
1. **User enters work email** on the login screen.
2. The frontend calls the authentication API:
   ```javascript
   // Example via Supabase JavaScript Client
   const { data, error } = await supabase.auth.signInWithOtp({
     email: 'admin@contoso.com',
     options: {
       emailRedirectTo: 'https://tools.skypeexchange4u.com/dashboard'
     }
   });
   ```
3. A 6-digit passcode is dispatched via [Resend](https://resend.com) from `security@skypeexchange4u.com`.
4. User enters the 6-digit code on screen to authenticate without needing a password.

### B. How Multi-Factor Authentication (MFA) Works
1. After login, user is prompted to set up an Authenticator App (Google Authenticator or Microsoft Authenticator).
2. The user scans a QR code to bind their TOTP secret.
3. On every subsequent login from a new device or IP address, the user must provide both their Email OTP and their Authenticator app code.

---

## 3. Securing the Administrative Console (`admin.html`)

To prevent unauthorized access to your management console, enforce **Role-Based Access Control (RBAC)**:

1. **Assign Admin Role in the Database:**
   In your users table, set the role for your email:
   ```sql
   UPDATE auth.users 
   SET raw_user_meta_data = '{"role": "super_admin"}' 
   WHERE email = 'satya@skypeexchange4u.com';
   ```
2. **Client-Side Gatekeeper (in `admin.html`):**
   ```javascript
   // Check if user session has super_admin role
   const user = supabase.auth.user();
   if (!user || user.user_metadata.role !== 'super_admin') {
     window.location.href = '/index.html?error=unauthorized';
   }
   ```

---

## 4. Handling Customer Inquiries & Notifications

1. **Dedicated Support Address:** Route all inbound customer questions to:
   * **`support@skypeexchange4u.com`**
2. **Free In-App Chat Integration:**
   Add a 1-line script from [Crisp](https://crisp.chat) to the bottom of `index.html`:
   ```html
   <script type="text/javascript">
     window.$crisp=[];window.CRISP_WEBSITE_ID="YOUR_WEBSITE_ID";
     (function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
   </script>
   ```
   * When a customer on your live site has a question about a script or pricing, they type in the chat box.
   * You receive the message immediately on your mobile phone via the Crisp app and can reply in real time.

---

## 5. Live UI Prototype Reference

You can test the visual interface for this management workflow right now by opening:
* **Local:** `file:///Users/dell/tool_skype_exchange/admin.html`
* **Production:** `https://tools.skypeexchange4u.com/admin.html`
