create table if not exists votes (
  id uuid default gen_random_uuid() primary key,
  contestant_id text not null,
  contestant_name text not null,
  category text not null,
  voter_name text not null,
  amount integer not null default 500,
  qty integer not null default 1,
  created_at timestamptz default now()
);

create table if not exists donations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  currency text not null default 'NGN',
  amount numeric not null,
  frequency text default 'One-time gift',
  designation text default 'General Parish Fund',
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists news (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  image_url text,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  event_date date,
  event_time text,
  location text,
  image_url text,
  published boolean default false,
  created_at timestamptz default now()
);

create table if not exists gallery (
  id uuid default gen_random_uuid() primary key,
  title text,
  image_url text not null,
  category text default 'General',
  created_at timestamptz default now()
);

alter table votes enable row level security;
alter table donations enable row level security;
alter table news enable row level security;
alter table events enable row level security;
alter table gallery enable row level security;

create policy "Public can read news" on news for select using (published = true);
create policy "Public can read events" on events for select using (published = true);
create policy "Public can read gallery" on gallery for select using (true);

create policy "Anyone can insert votes" on votes for insert with check (true);
create policy "Anyone can insert donations" on donations for insert with check (true);

create policy "Admin full access votes" on votes for all using (auth.role() = 'authenticated');
create policy "Admin full access donations" on donations for all using (auth.role() = 'authenticated');
create policy "Admin full access news" on news for all using (auth.role() = 'authenticated');
create policy "Admin full access events" on events for all using (auth.role() = 'authenticated');
create policy "Admin full access gallery" on gallery for all using (auth.role() = 'authenticated');
