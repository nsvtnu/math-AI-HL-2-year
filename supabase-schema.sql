-- ============================================================
-- Mathkitty backend schema — paste this whole file into
-- Supabase > SQL Editor > New query, then press Run.
-- Safe to run once on a fresh project.
-- ============================================================

-- Who is who. One row per account; usernames are unique.
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null check (username ~ '^[a-z0-9_]{3,16}$'),
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "profiles are readable" on profiles for select using (true);
create policy "create own profile" on profiles for insert with check (auth.uid() = id);

-- One small document per user: flags, syllabus marks, streak.
create table states (
  user_id uuid primary key references auth.users on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);
alter table states enable row level security;
create policy "own state only" on states for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Append-only log of answered questions. XP and stats derive from it.
create table attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  q text not null,
  u text not null,
  ok boolean not null,
  first boolean not null default false,
  ts timestamptz not null
);
alter table attempts enable row level security;
create policy "write own attempts" on attempts for insert with check (auth.uid() = user_id);
create policy "read own attempts" on attempts for select using (auth.uid() = user_id);
create index attempts_user_ts on attempts (user_id, ts);
create index attempts_q on attempts (q);

-- Class leaderboard: everyone's XP without exposing raw attempt rows.
create or replace function leaderboard()
returns table (username text, xp bigint, solved bigint, streak_last text, streak_days int)
language sql security definer set search_path = public as $$
  select p.username,
         10 * count(distinct a.q) filter (where a.ok) as xp,
         count(distinct a.q) filter (where a.ok) as solved,
         s.data->'streak'->>'last' as streak_last,
         coalesce((s.data->'streak'->>'days')::int, 0) as streak_days
  from profiles p
  left join attempts a on a.user_id = p.id
  left join states s on s.user_id = p.id
  group by p.username, s.data
  order by xp desc, p.username
  limit 100;
$$;
revoke all on function leaderboard() from public;
grant execute on function leaderboard() to authenticated;

-- Per-question class stats: how many tries, what fraction correct.
create or replace function question_stats()
returns table (q text, attempts bigint, correct_pct int)
language sql security definer set search_path = public as $$
  select a.q, count(*) as attempts,
         round(100.0 * count(*) filter (where a.ok) / count(*))::int as correct_pct
  from attempts a
  group by a.q;
$$;
revoke all on function question_stats() from public;
grant execute on function question_stats() to authenticated;
