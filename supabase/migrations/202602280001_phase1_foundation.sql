-- Phase 1: Data + Auth foundation for Calendar Logs

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_types (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null,
  is_default boolean not null default false,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists activity_types_user_name_unique
  on public.activity_types (user_id, lower(name))
  where deleted_at is null;

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_type_id uuid not null references public.activity_types(id) on delete restrict,
  activity_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint activities_user_type_date_unique unique (user_id, activity_type_id, activity_date)
);

create index if not exists activities_user_date_idx
  on public.activities (user_id, activity_date);

create index if not exists activities_user_type_date_idx
  on public.activities (user_id, activity_type_id, activity_date);

create index if not exists activity_types_user_active_idx
  on public.activity_types (user_id, deleted_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists activity_types_set_updated_at on public.activity_types;
create trigger activity_types_set_updated_at
before update on public.activity_types
for each row
execute function public.set_updated_at();

drop trigger if exists activities_set_updated_at on public.activities;
create trigger activities_set_updated_at
before update on public.activities
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.activity_types enable row level security;
alter table public.activities enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "activity_types_select_own" on public.activity_types;
create policy "activity_types_select_own"
  on public.activity_types
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "activity_types_insert_own" on public.activity_types;
create policy "activity_types_insert_own"
  on public.activity_types
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "activity_types_update_own" on public.activity_types;
create policy "activity_types_update_own"
  on public.activity_types
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "activity_types_delete_own" on public.activity_types;
create policy "activity_types_delete_own"
  on public.activity_types
  for delete
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "activities_select_own" on public.activities;
create policy "activities_select_own"
  on public.activities
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "activities_insert_own" on public.activities;
create policy "activities_insert_own"
  on public.activities
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "activities_update_own" on public.activities;
create policy "activities_update_own"
  on public.activities
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "activities_delete_own" on public.activities;
create policy "activities_delete_own"
  on public.activities
  for delete
  to authenticated
  using (user_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  insert into public.activity_types (user_id, name, color, is_default)
  values
    (new.id, 'Gym', '#3b82f6', true),
    (new.id, 'Tan', '#f59e0b', true),
    (new.id, 'Laundry', '#8b5cf6', true)
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
