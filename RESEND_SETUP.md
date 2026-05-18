# Resend Email Setup Guide for RentInAlvin.com

> **Last updated:** 2026-05-18  
> **Goal:** Connect Resend so all website forms send real lead notifications to the Yellowstone team.

---

## ✅ What I Already Fixed in the Code

I updated `src/lib/email.ts` so the backend now correctly routes emails with:

- **From:** `RentInAlvin Website <no-reply@rentinalvin.com>`
- **To:** `office@yellowstone-am.com`
- **CC:** `manager@yellowstone-am.com`, `dor@yellowstone-am.com`, `lise@yellowstone-am.com`, `zoe@yellowstone-am.com`
- **Reply-To:** The customer's email from the form (so the office can reply directly to the customer)

All forms already submit to a secure backend API route (`/api/leads`). The Resend API key is **never** exposed to the frontend.

---

## 🔐 Step 1 — Create or Confirm Your Resend Account

1. Go to **https://resend.com**
2. Sign up (free plan = 100 emails/day — more than enough for this site).
3. Verify your Resend account email.

---

## 🌐 Step 2 — Add Your Domain to Resend

1. In the Resend dashboard, go to **Domains** → **Add Domain**.
2. Enter: `rentinalvin.com`
3. Choose your region (usually **US** if your audience is in Texas).
4. Resend will show you DNS records to add.

### ⚠️ STOP — Do not guess these values

Resend will give you **exact** DNS records. They typically look like this:

| Type | Host / Name | Value / Points to | TTL |
|------|-------------|-------------------|-----|
| TXT | `_resend` | `resend-verify=xxxxxxxx` | Auto |
| TXT | `resend._domainkey` | `p=MIIB...` | Auto |
| TXT | `_dmarc` | `v=DMARC1; p=none;` | Auto |

> **Important:** Copy these **exactly** from your Resend dashboard. Do not use the example values above. Resend generates unique values for each domain.

---

## 🌍 Step 3 — Add DNS Records to Your Domain Registrar

You need to add the DNS records from Step 2 wherever you manage DNS for `rentinalvin.com`. Common places:

- **Vercel:** Dashboard → Domains → `rentinalvin.com` → DNS Records
- **Cloudflare:** DNS → Records
- **GoDaddy / Namecheap / Google Domains:** DNS Management section
- **Your hosting provider:** cPanel or DNS zone editor

### What to add:
1. Add every record Resend gave you **exactly** as shown.
2. Make sure there are no extra spaces or missing characters.
3. If you already have an SPF record (`v=spf1 ...`), you may need to merge it with Resend's SPF instruction. Resend typically uses SPF through their DKIM/DomainKey setup, but if they give you a separate SPF record, merge it like this:
   ```
   v=spf1 include:_spf.resend.com include:_spf.google.com ~all
   ```
   (Only if you use Google Workspace email for `office@yellowstone-am.com`.)

---

## ✅ Step 4 — Verify Domain in Resend

1. Back in Resend, click **Verify** on your domain.
2. DNS propagation can take **5 minutes to 48 hours** (usually under 30 minutes).
3. Resend will show a green checkmark when verified.
4. **Do not continue until you see the green checkmark.**

---

## 🔑 Step 5 — Create a Resend API Key

1. In Resend, go to **API Keys** → **Create API Key**.
2. Name it: `RentInAlvin Website`
3. Permission: **Sending access only** (do not use full access unless you need it).
4. Click **Create**.
5. **Copy the key immediately** — it starts with `re_` and Resend will only show it once.

> **Store this key safely.** You will paste it into Vercel in the next step.

---

## ▲ Step 6 — Add Environment Variables to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select the **RentInAlvin** project.
3. Go to **Settings** → **Environment Variables**.
4. Add these variables **exactly** as shown:

| Name | Value |
|------|-------|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxxxxxx` (paste your real key from Step 5) |
| `EMAIL_FROM` | `RentInAlvin Website <no-reply@rentinalvin.com>` |
| `EMAIL_TO` | `office@yellowstone-am.com` |
| `EMAIL_CC` | `manager@yellowstone-am.com,dor@yellowstone-am.com,lise@yellowstone-am.com,zoe@yellowstone-am.com` |

5. Make sure you add them to the correct **Environment** (Production, and Preview if you want to test on preview deployments).
6. Click **Save**.
7. **Redeploy** the project so the new environment variables take effect:
   - Vercel dashboard → Deployments → Click the latest deployment → **Redeploy** (or push a new commit).

---

## 🧪 Step 7 — Test on Localhost (Optional but Recommended)

You can test locally before deploying:

1. Create a file named `.env.local` in the project root (next to `.env.example`).
2. Paste the same variables from Step 6 into `.env.local`.
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000
5. Submit the **Contact form** or **Tour booking** form.
6. Check your terminal console — you should see:
   ```
   [EMAIL] Provider: resend
   [EMAIL] From: RentInAlvin Website <no-reply@rentinalvin.com>
   [EMAIL] Reply-To: customer@example.com
   [EMAIL] To: office@yellowstone-am.com
   [EMAIL] CC: manager@yellowstone-am.com, dor@yellowstone-am.com, lise@yellowstone-am.com, zoe@yellowstone-am.com
   [EMAIL] Sent via Resend: { id: '...' }
   ```
7. Check the inboxes of all 5 recipients. The email should arrive within seconds.

---

## 🧪 Step 8 — Test on Production

1. After redeploying to Vercel, go to https://rentinalvin.com
2. Submit each form type:
   - **Contact form** (General inquiry at bottom of page)
   - **Tour booking** ("Book a tour" button)
   - **Apply form** ("Start application" section)
   - **Property inquiry** (Sell property section)
3. Verify that:
   - `office@yellowstone-am.com` receives the email in **To**
   - The other 4 emails receive it in **CC**
   - The **Reply-To** is the customer's email
   - The **From** is `RentInAlvin Website <no-reply@rentinalvin.com>`

---

## 🛡️ Security Checklist

- [ ] `RESEND_API_KEY` is **only** in Vercel Environment Variables (never in Git, never in frontend code).
- [ ] `no-reply@rentinalvin.com` is not used as the public contact email on the website.
- [ ] The public contact email `office@yellowstone-am.com` remains visible in the footer and contact section.
- [ ] Domain verification is green in Resend.

---

## 📋 Form Behavior Summary

Every form on the site already includes:

| Feature | Status |
|---------|--------|
| Required field validation | ✅ Built-in |
| Honeypot spam protection | ✅ Built-in (`website` field) |
| Loading state | ✅ Built-in |
| Disable submit while sending | ✅ Built-in |
| Prevent duplicate submissions | ✅ Rate-limited (5/min per IP) |
| Success message after confirmation | ✅ Built-in |
| Error message on failure | ✅ Built-in |
| Form only clears on success | ✅ Built-in |

### Success Messages (already in the code)

- **Tour booking:**  
  *"Thank you. Your tour request has been received. A member of the leasing team will contact you shortly to confirm availability."*

- **All other forms:**  
  *"Thank you. Your request has been received. A member of the leasing team will contact you shortly."*

---

## 🆘 Troubleshooting

### "No email provider configured" in console
- Your `RESEND_API_KEY` is missing or misspelled in environment variables.
- Redeploy after adding it.

### "Domain not verified" error from Resend
- DNS records are not propagated yet. Wait 30 minutes and check Resend dashboard.
- Double-check you copied the DNS values exactly — no extra spaces.

### Emails go to spam
- Make sure DKIM and SPF are verified in Resend.
- Ask recipients to add `no-reply@rentinalvin.com` to their contacts.

### "Too many requests" error
- This is the rate limiter. Wait 1 minute and try again.

---

## 📧 Email Details Included in Every Lead Notification

Every email sent by the backend includes:

- Form type (Tour / Apply / Sell / Contact)
- Customer name
- Phone number
- Email address
- Property interested in
- Move-in timeframe (if available)
- Bedroom needs (if available)
- Preferred tour date & time (if available)
- Message / notes
- Page URL / source
- Submission date/time (Central Time)
- Lead ID for tracking

---

## Next Step

**Please complete Steps 1–6 above and then submit a test form.**

If you run into any issues, copy the exact error message from:
1. Your browser console (F12 → Console)
2. Your Vercel deployment logs (Vercel dashboard → Deployments → Functions)
3. Your local terminal (if testing locally)

Then share those errors with me and I will help you fix them.
