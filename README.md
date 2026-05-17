# RentInAlvin.com

**Managed by Yellowstone Asset Management**  
Apartments & townhomes for rent in Alvin, Texas.

---

## 🚀 How to run this site

This is a **Next.js 14** application. Do not open the `.html` files directly — those are old standalone prototypes.

### Local development

```bash
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser.

### Build for production

```bash
npm run build
npm start
```

---

## 📁 Project structure

```
src/app/           → Next.js pages & API routes
src/components/    → React components (Nav, Footer, Map, TourBooking)
src/lib/           → Data, DB, Email helpers
prisma/            → Database schema
```

The root-level `.html` and `.jsx` files are **legacy standalone prototypes**. They are not used by the Next.js app.

---

## 🔌 Environment Variables

Copy `.env.example` to `.env.local` and fill in your real credentials:

```bash
cp .env.example .env.local
```

| Variable | Required? | Purpose |
|----------|-----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Site URL |
| `DATABASE_URL` | Yes | Database connection (SQLite for local, PostgreSQL for production) |
| `RESEND_API_KEY` | Yes* | Email provider API key |
| `EMAIL_FROM` | Yes* | Sender email address |
| `LEADS_TO_EMAIL` | Yes* | Where lead notifications go |
| `BOOKINGS_TO_EMAIL` | Yes* | Where tour requests go |
| `CONTACT_TO_EMAIL` | Yes* | Where contact submissions go |

\* Only required if you want emails to actually send. The site works without them — it will log emails to the console instead of crashing.

---

## 🗄️ Database setup

Local development uses SQLite by default:

```bash
npx prisma db push
```

For production, set `DATABASE_URL` to your PostgreSQL/MySQL provider and run:

```bash
npx prisma generate
npx prisma db push
```

---

## 📧 Email setup

1. Create an account at [Resend](https://resend.com)
2. Verify your domain
3. Copy your API key into `RESEND_API_KEY`
4. Set your recipient emails

---

## 🗺️ Map

The site uses **Leaflet + OpenStreetMap** by default. No API key is required.

If you want to switch to Google Maps later, set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

---

## 🌐 Deploy to Vercel

1. Push this repo to GitHub
2. Import into [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy

The `postinstall` script automatically runs `prisma generate` on install.

---

## 📱 Features

- Property listings with availability filters
- Interactive map with property pins
- Tour booking modal (3-step flow)
- Online application form (6-step flow)
- Property sale inquiry form
- Mobile-responsive navigation
- SEO metadata & structured data

---

## ⚠️ Legacy files

The following files are **not used** by the Next.js app and are kept for reference only:

- `Yellowstone Management.html`
- `Yellowstone Management - Standalone.html`
- `Yellowstone Management ES.html`
- `Living in Alvin.html`
- `Vivir en Alvin.html`
- `app.jsx`, `sections.jsx`, `apply.jsx`, `booking.jsx`, `sell.jsx`, `tweaks-panel.jsx`, `availability-data.jsx`

If you open these `.html` files directly in a browser, you will see a "Still loading…" screen because they compile React in the browser with Babel. **Use `npm run dev` instead.**
