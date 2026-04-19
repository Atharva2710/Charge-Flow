-- Run this in your Supabase SQL Editor to create the bookings table

-- 1. Create the bookings table
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  station_id text not null,
  station_name text not null,
  charger_type text not null,
  duration_minutes integer not null,
  vehicle_name text not null,
  estimated_cost numeric not null,
  estimated_kwh numeric not null,
  status text not null default 'active', -- 'active', 'completed', 'cancelled'
  start_time timestamp with time zone default timezone('utc'::text, now()) not null,
  end_time timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Turn on Row Level Security (RLS)
alter table public.bookings enable row level security;

-- 3. Allow users to insert their own bookings
create policy "Users can insert their own bookings"
on public.bookings for insert
with check (auth.uid() = user_id);

-- 4. Allow users to view their own bookings
create policy "Users can view their own bookings"
on public.bookings for select
using (auth.uid() = user_id);

-- 5. Allow users to update their own bookings (e.g. to cancel them)
create policy "Users can update their own bookings"
on public.bookings for update
using (auth.uid() = user_id);
