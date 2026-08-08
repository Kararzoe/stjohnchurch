-- Create contest_categories table
create table if not exists public.contest_categories (
  id text primary key,
  icon text not null default '',
  label text not null,
  sort_order integer not null default 0
);

-- Enable RLS
alter table public.contest_categories enable row level security;

-- Allow public read
create policy "Public read contest_categories"
  on public.contest_categories for select
  using (true);

-- Allow authenticated write
create policy "Auth write contest_categories"
  on public.contest_categories for all
  using (auth.role() = 'authenticated');

-- Seed the 5 categories
insert into public.contest_categories (id, icon, label, sort_order) values
  ('face',     '👑', 'Face of Harvest',     1),
  ('king',     '🤴', 'King of Harvest',     2),
  ('queen',    '👸', 'Queen of Harvest',    3),
  ('prince',   '🫅', 'Prince of Harvest',   4),
  ('princess', '🌸', 'Princess of Harvest', 5)
on conflict (id) do update set
  icon = excluded.icon,
  label = excluded.label,
  sort_order = excluded.sort_order;
