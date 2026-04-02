# TTP Admin Console — Angular 17

## Run in 3 commands

```bash
npm install
npm start
# Open http://localhost:4200
```

## Requirements
- Node.js v18+ (you have v22 ✓)
- npm v9+

## Build for production
```bash
npm run build
# Output → dist/ttp-admin/
```

## Project structure

```
src/app/
├── core/
│   ├── models/index.ts              ← All TypeScript interfaces & enums
│   ├── constants.ts                 ← All option lists, feature keys, defaultSetupForm()
│   ├── services/
│   │   ├── mock-data.service.ts     ← All static data (swap .getX() for API calls)
│   │   ├── api.service.ts           ← All backend HTTP endpoints ready to wire
│   │   └── setup-form.service.ts   ← Wizard state, 50+ form fields + helpers
│   └── interceptors/auth.interceptor.ts  ← Bearer token + 401 redirect
│
├── shared/components/
│   ├── sidebar/    ← Fixed nav with badges
│   ├── topbar/     ← Breadcrumb + search
│   ├── pill/       ← Coloured status badge
│   ├── toggle/     ← Animated switch
│   ├── chip-group/ ← Multi-select chips
│   ├── lang-tabs/  ← Language switcher
│   ├── kv-pairs/   ← Key-value pair editor
│   ├── sparkline/  ← SVG chart
│   └── expiry-block/ ← Expiry + reminder config
│
└── features/
    ├── dashboard/  ← KPI cards + tables
    ├── accounts/   ← Filter/search + table
    ├── failures/   ← Expandable API failure rows
    ├── campaigns/  ← Promotions tables
    ├── pricing/    ← Asset pricing records
    ├── comms/      ← Email + SMS matrix
    ├── queries/    ← Customer query list
    └── setup/      ← 5-step guided wizard
        ├── setup.component.ts/html ← Shell: step bar, validation, navigation
        └── steps/
            ├── step0  Program & Pricing  — Price model, grading questions, question categories
            ├── step1  Account            — Branding, URL, country, currency, languages
            ├── step2  Channels           — Per-channel feature config (proposed Channel entity)
            ├── step3  Account Features   — Payment, expiry, SMS, recycle, T&Cs
            └── step4  Review             — Full summary with Edit links per section
```

## Hierarchy

```
Program  →  Pricing engine, grading rules. Shared across all accounts.
  Account  →  One carrier/brand instance. Inherits program defaults.
    Channel  →  Operational context (Online / Retail / Care / API).
               Inherits account defaults. Per-journey feature overrides.
               ⚠ Channel does not yet exist in GTP — this models the proposed
               Program → Account → Channel architecture.
```

## Connecting to a real backend
1. Set `apiUrl` in `src/environments/environment.ts`
2. In each feature replace `this.mock.getX()` with `this.api.getX()`
3. In `setup.component.ts` replace the `createAccount()` placeholder
   with `this.api.createAccount(this.svc.form)`

MockDataService and TTPApiService have matching method signatures — single line swap per call.

## All GTP feature keys
All values in `constants.ts` are sourced directly from GTP UAT screenshots.
Note: `iban_validation` validation type is a free text field — enter the value as configured in GTP.
