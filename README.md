# VOOH Furnitures

Full-Stack E-Commerce Platform built with Next.js 14 (App Router), Tailwind CSS, Supabase, and Paystack.

## Features
- **Modern UI/UX**: Premium, high-end editorial design using custom color palettes, responsive layouts, and Framer Motion micro-animations.
- **Global State**: Client-side cart managed by Zustand with `localStorage` persistence.
- **Database**: Supabase PostgreSQL with strict Row Level Security (RLS) policies.
- **Authentication**: Supabase Auth for the Admin Dashboard.
- **Payments**: Integrated Paystack checkout and webhook handling for `charge.success` events.
- **Server/Client Components**: Optimized using Next.js 14 App Router.

## Environment Variables

Create a `.env.local` file in the root directory and add the following keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...
```

## Setup & Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Database Setup:
   - Go to your Supabase project dashboard -> SQL Editor.
   - Copy the contents of `schema.sql` and run it to create tables, apply RLS policies, and insert mock data.
   - Create an admin user in Supabase Authentication to access the dashboard.

3. Start Development Server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Admin Dashboard

Access the admin panel at `/admin/login`. 
Login using the credentials of the user created via your Supabase Authentication dashboard.

## Webhooks (Paystack)
For local testing of Paystack webhooks, use a service like Ngrok to forward your local port 3000 to the internet, then configure the webhook URL in your Paystack dashboard to point to:
`https://your-ngrok-url/api/paystack/webhook`
