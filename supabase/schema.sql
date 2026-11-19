-- GEO Brand Tracker SaaS — Supabase schema
-- Run this in Supabase Dashboard → SQL Editor (or via `supabase db push`).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  created_at timestamptz not null default now()
);

create table if not exists public.brands (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  domain text not null,
  description text default '',
  color text default '#6366f1',
  created_at timestamptz not null default now()
);

create table if not exists public.competitors (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  brand_id text not null references public.brands (id) on delete cascade,
  name text not null,
  domain text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.prompts (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  brand_id text not null references public.brands (id) on delete cascade,
  text text not null,
  intent text not null default 'commercial',
  created_at timestamptz not null default now()
);

create table if not exists public.checks (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  brand_id text not null references public.brands (id) on delete cascade,
  prompt_id text not null references public.prompts (id) on delete cascade,
  engine text not null,
  mentioned boolean not null default false,
  position int,
  visibility_score int not null default 0,
  sentiment text not null default 'neutral',
  citations text[] default '{}',
  answer_snippet text default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.brands enable row level security;
alter table public.competitors enable row level security;
alter table public.prompts enable row level security;
alter table public.checks enable row level security;

-- RLS policies: users can only access their own rows
create policy "profiles own" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "brands own" on public.brands for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "competitors own" on public.competitors for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "prompts own" on public.prompts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "checks own" on public.checks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
