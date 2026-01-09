# NEWBANK Client

Web dashboard for the NEWBANK banking platform. This app provides the
customer and admin-facing UI for accounts, transactions, cards, loans,
receipts, voice banking, and support.

## What users can do
- Register and sign in
- View accounts, balances, and recent activity
- Send transfers and payments
- Create deposits and upload proof
- Request cards and loan products
- Generate, view, and download receipts
- Request balance by voice call
- Contact support and browse FAQs

## Tech stack
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS and shadcn/ui
- Zustand for state management
- Axios for API calls

## Local development

Prerequisites: Node 18+ and pnpm 10+.

1) Install dependencies
   - `pnpm install`
2) Configure environment
   - Start from `client/env.example.txt` (rename to `.env` or `.env.local`).
   - Add your API base URL:
     - `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
3) Run the app
   - `pnpm dev`

The dev server runs at http://localhost:3000.

## Scripts
- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`
- `pnpm test`

## Notes
- File uploads (profile, KYC, deposit proof) use multipart form data.
- Receipt downloads use `/receipts/:id/download` (PDF).
