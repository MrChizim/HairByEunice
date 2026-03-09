# Hair by Eunice — Setup Guide

This project is now fully independent of base44. It uses:
- **Supabase** — free database (PostgreSQL)
- **EmailJS** — free email sending from the browser (no backend needed)
- **Vite + React** — runs anywhere (Vercel, Netlify, or locally)

---

## Step 1 — Install dependencies

```bash
npm install
```

---

## Step 2 — Set up Supabase (free)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (pick a name, set a database password)
3. Once the project is ready, go to **SQL Editor** and run this SQL to create the tables:

```sql
-- Services table
create table services (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  description text,
  price numeric not null,
  duration integer not null,
  category text not null check (category in ('braids','cornrows','twists','men','kids')),
  image_url text
);

-- Bookings table
create table bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  client_name text not null,
  email text not null,
  phone text not null,
  service_id uuid references services(id),
  service_name text not null,
  date date not null,
  time text not null,
  location text not null check (location in ('Liverpool','Walsall','Birmingham')),
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  notes text
);

-- Allow public read/write (the app handles its own logic)
alter table services enable row level security;
alter table bookings enable row level security;

create policy "Public read services" on services for select using (true);
create policy "Public insert bookings" on bookings for insert with check (true);
create policy "Public read bookings" on bookings for select using (true);
create policy "Public update bookings" on bookings for update using (true);
create policy "Public insert services" on services for insert with check (true);
```

4. Go to **Settings → API** and copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon public** key

---

## Step 3 — Set up EmailJS (free)

1. Go to [emailjs.com](https://emailjs.com) and create a free account
2. Add an **Email Service** — connect your Gmail or any email (this is where notifications go TO Eunice)
3. Create an **Email Template** with this content:

**Subject:** New Booking — {{service}} on {{date}}

**Body:**
```
New booking request for Hair by Eunice!

Client: {{client_name}}
Phone: {{client_phone}}
Email: {{client_email}}

Service: {{service}} ({{price}})
Date: {{date}}
Time: {{time}}
Location: {{location}}

Notes: {{notes}}

---
Log in to your admin dashboard to confirm or cancel this booking.
```

4. Copy your **Service ID**, **Template ID**, and **Public Key** from EmailJS dashboard

---

## Step 4 — Create your .env file

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Then edit `.env`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

VITE_ADMIN_PASSWORD=choose_a_strong_password

VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

---

## Step 5 — Run the site

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## Step 6 — Add services

1. Go to `/AdminDashboard` and sign in with your admin password
2. Click **"Add Default Services"** to populate the services list
3. Edit prices to match Eunice's actual rates

---

## Deploying (free)

### Vercel (recommended — easiest)
1. Push this project to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add all your `.env` variables in the Vercel dashboard under **Environment Variables**
4. Deploy — done. You get a free `.vercel.app` URL

### Netlify
Same process — connect GitHub repo, add env vars, deploy.

---

## Admin Dashboard

Visit `/AdminDashboard` on the live site. Sign in with your `VITE_ADMIN_PASSWORD`.

From there Eunice can:
- See all bookings (pending, confirmed, completed, cancelled)
- Confirm or cancel bookings with one click
- Edit any booking details
- Add/manage services
