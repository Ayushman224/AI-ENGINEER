-- AI Engineer OS — one row per user holding the full progress snapshot (same SQL as the in-app Sync panel).
create table if not exists user_progress (user_id uuid primary key references auth.users on delete cascade, state jsonb not null, updated_at timestamptz default now());
alter table user_progress enable row level security;
create policy "own progress" on user_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
