-- Run this in your Supabase SQL Editor to set up the database

-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  bio text default '',
  age integer not null,
  photos text[] default '{}',
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view all profiles"
  on profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Swipes table
create table swipes (
  id uuid default gen_random_uuid() primary key,
  swiper_id uuid references profiles(id) on delete cascade not null,
  swiped_id uuid references profiles(id) on delete cascade not null,
  direction text not null check (direction in ('like', 'pass')),
  created_at timestamptz default now(),
  unique(swiper_id, swiped_id)
);

alter table swipes enable row level security;

create policy "Users can insert own swipes"
  on swipes for insert
  to authenticated
  with check (auth.uid() = swiper_id);

create policy "Users can view own swipes"
  on swipes for select
  to authenticated
  using (auth.uid() = swiper_id or auth.uid() = swiped_id);

-- Matches table
create table matches (
  id uuid default gen_random_uuid() primary key,
  user1_id uuid references profiles(id) on delete cascade not null,
  user2_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user1_id, user2_id)
);

alter table matches enable row level security;

create policy "Users can view own matches"
  on matches for select
  to authenticated
  using (auth.uid() = user1_id or auth.uid() = user2_id);

-- Messages table
create table messages (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references matches(id) on delete cascade not null,
  sender_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

alter table messages enable row level security;

create policy "Users can view messages in their matches"
  on messages for select
  to authenticated
  using (
    exists (
      select 1 from matches
      where matches.id = messages.match_id
      and (matches.user1_id = auth.uid() or matches.user2_id = auth.uid())
    )
  );

create policy "Users can send messages in their matches"
  on messages for insert
  to authenticated
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from matches
      where matches.id = match_id
      and (matches.user1_id = auth.uid() or matches.user2_id = auth.uid())
    )
  );

-- Function to auto-create a match when two users like each other
create or replace function check_and_create_match()
returns trigger as $$
begin
  if NEW.direction = 'like' then
    -- Check if the other person already liked us
    if exists (
      select 1 from swipes
      where swiper_id = NEW.swiped_id
      and swiped_id = NEW.swiper_id
      and direction = 'like'
    ) then
      -- Create a match (order IDs to avoid duplicates)
      insert into matches (user1_id, user2_id)
      values (
        least(NEW.swiper_id, NEW.swiped_id),
        greatest(NEW.swiper_id, NEW.swiped_id)
      )
      on conflict do nothing;
    end if;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_swipe_check_match
  after insert on swipes
  for each row execute function check_and_create_match();

-- Enable realtime for messages
alter publication supabase_realtime add table messages;

-- Storage bucket for profile photos
insert into storage.buckets (id, name, public) values ('photos', 'photos', true);

create policy "Anyone can view photos"
  on storage.objects for select
  using (bucket_id = 'photos');

create policy "Authenticated users can upload photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'photos');

create policy "Users can update own photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
