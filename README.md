# Homeyo — Uganda's Premium Property Marketplace

A production-ready React + Vite application built for Vercel deployment.

## 🎨 Design

- **Fonts**: Cormorant Garamond (display) + DM Sans (body) + DM Mono (code)
- **Palette**: Deep Forest Green (#1A3C2E) + Burnished Gold (#C9A84C) + Warm Ivory
- **Inspired by**: Qatar Airways refined elegance + Global real estate standards
- **Mobile-first**: Dedicated mobile bottom nav, responsive at all breakpoints

## 🚀 Deploy to Vercel

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Vercel auto-detects Vite — click **Deploy**

## 🔐 Demo credentials

| Role | URL | Login |
|---|---|---|
| Client / Landlord / Provider | `/` → Sign in | Any email + 8+ char password |
| Admin | `/admin` | `admin@rentright.ug` / `admin2025` |
| Warden | `/hostel` → Warden login | `warden2025` |

## 📁 Structure

```
src/
  App.jsx          — Complete homepage (1001 lines): Hero, Properties, Jobs, Services, Moving, Land, Hostels, Referral, Footer
  index.css        — Full design system (440 lines): CSS vars, buttons, cards, modals, nav, chat, dashboard, mobile
  data/index.js    — All data: listings, jobs, providers, moving, land, hostels, tips
  hooks/useAuth.jsx
  components/
    AuthModal.jsx  — 6 signup flows with step indicators and live photo upload preview
    Modal.jsx
  pages/
    Dashboard.jsx      — Role-based: client/landlord/agent/provider
    AdminLogin.jsx     — Standalone dark login at /admin
    AdminDashboard.jsx — Full admin panel: alerts with prompts, provider verification
    HostelPortal.jsx   — Student portal: browse, book, reference, bank payment
```

## ✨ Homepage sections

1. **Hero** — Full-viewport with auto-rotating featured property, search bar with tabs (Rent/Buy/Hostel/Land/Services), stats
2. **Properties** — Filtered grid with chip filters (Featured/Move-in ready/Student/Shared/Verified), trust bars, favorites, booking
3. **Job Board** — View full scope, accept with e-sign, counter offer with dedicated form, ask question
4. **Home Services** — 8 service type cards + provider grid with live negotiation chat and offer/counter system
5. **Moving Services** — Truck photos with capacity labels, provider cards, negotiate with moving company
6. **Land for sale** — 3 premium land listings with locked GPS and owner details (pay to unlock)
7. **Land Safety Guide** — 10 legal tips with HIGH RISK badges (green on dark background)
8. **Student Hostels** — 2 sample hostels, room booking with reference generation, bank payment instructions
9. **Referral Programme** — Earn UGX 2,000 per referral, copy link widget
10. **Footer** — Links, quick access to admin/hostel portals (low visibility)

## 🔧 Local dev

```bash
npm install
npm run dev
```
