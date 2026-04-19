-- =========================================================================
-- ChargeFlow DB v2: "My Garage" and "Reviews" Tables
-- Run this script in your Supabase SQL Editor.
-- =========================================================================

-- 1. Create the Vehicles table
create table public.vehicles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  vendor_name text not null,       -- e.g., 'Tata'
  model_name text not null,        -- e.g., 'Nexon EV'
  battery_capacity numeric,        -- e.g., 30.2
  connector_type text not null,    -- e.g., 'CCS2'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS for vehicles
alter table public.vehicles enable row level security;

create policy "Users can insert their own vehicles" on public.vehicles
  for insert with check (auth.uid() = user_id);

create policy "Users can view their own vehicles" on public.vehicles
  for select using (auth.uid() = user_id);

create policy "Users can delete their own vehicles" on public.vehicles
  for delete using (auth.uid() = user_id);


-- 2. Create the Reviews table
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  station_id text not null,        -- matches our frontend static station IDs
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- A user can only leave one review per station
  unique(user_id, station_id)
);

-- Turn on RLS for reviews
alter table public.reviews enable row level security;

create policy "Users can insert their own reviews" on public.reviews
  for insert with check (auth.uid() = user_id);

create policy "Anyone can read reviews" on public.reviews
  for select using (true);
