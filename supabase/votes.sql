-- Drop and recreate votes table with payment reference support
drop table if exists public.votes;

create table public.votes (
  id uuid primary key default gen_random_uuid(),
  voter_name text not null,
  voter_phone text not null default '',
  bank text not null default '',
  reference text not null,
  qty integer not null default 1,
  amount integer not null default 0,
  status text not null default 'pending', -- pending | approved | rejected
  category text not null,
  contestant_id uuid references public.contestants(id) on delete cascade,
  contestant_name text not null default '',
  created_at timestamptz default now()
);

alter table public.votes enable row level security;

create policy "Public insert votes" on public.votes for insert with check (true);
create policy "Public read approved votes" on public.votes for select using (status = 'approved');
create policy "Auth manage votes" on public.votes for all using (auth.role() = 'authenticated');
