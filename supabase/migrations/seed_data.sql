-- Insert Categories
INSERT INTO "Category" (id, name, slug, description, "imageUrl", "order", "isActive", "updatedAt")
VALUES
  (gen_random_uuid(), 'Performing Arts', 'performing-arts', 'Traditional and contemporary Ethiopian dance, theater, and performance art celebrating our rich cultural heritage.', '/images/performing-arts.jpg', 1, true, now()),
  (gen_random_uuid(), 'Traditional Music', 'traditional-music', 'Authentic Ethiopian music featuring traditional instruments like the krar, masenqo, and washint.', '/images/traditional-music.jpg', 2, true, now()),
  (gen_random_uuid(), 'Digital Music', 'digital-music', 'Modern Ethiopian music blending traditional sounds with contemporary genres and digital production.', '/images/digital-music.jpg', 3, true, now()),
  (gen_random_uuid(), 'Poetry', 'poetry', 'Spoken word and written poetry in Amharic, Oromo, Tigrinya, and other Ethiopian languages.', '/images/poetry.jpg', 4, true, now())
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "imageUrl" = EXCLUDED."imageUrl";

-- Insert Nominees
-- Using DO block to handle lookups easily or just simple INSERT...SELECT for each category

-- Performing Arts Nominees
INSERT INTO "Nominee" (id, name, "categoryId", region, bio, "imageUrl", scope, featured, "updatedAt")
SELECT gen_random_uuid(), 'Melaku Belay', id, 'Addis Ababa', 'World-renowned dancer and cultural ambassador, founder of Fendika Cultural Center.', '/images/nominees/melaku.jpg', 'ethiopia', true, now()
FROM "Category" WHERE slug = 'performing-arts'
AND NOT EXISTS (SELECT 1 FROM "Nominee" WHERE name = 'Melaku Belay');

INSERT INTO "Nominee" (id, name, "categoryId", region, bio, "imageUrl", scope, featured, "updatedAt")
SELECT gen_random_uuid(), 'Addis Gezahegn', id, 'Gondar', 'Celebrated for her mastery of Eskista and traditional Gondar dances.', '/images/nominees/addis.jpg', 'ethiopia', false, now()
FROM "Category" WHERE slug = 'performing-arts'
AND NOT EXISTS (SELECT 1 FROM "Nominee" WHERE name = 'Addis Gezahegn');

-- Traditional Music Nominees
INSERT INTO "Nominee" (id, name, "categoryId", region, bio, "imageUrl", scope, featured, "updatedAt")
SELECT gen_random_uuid(), 'Hachalu Hundessa', id, 'Oromia', 'Late icon whose music resonated with the heartbeat of a generation.', '/images/nominees/hachalu.jpg', 'ethiopia', true, now()
FROM "Category" WHERE slug = 'traditional-music'
AND NOT EXISTS (SELECT 1 FROM "Nominee" WHERE name = 'Hachalu Hundessa');

INSERT INTO "Nominee" (id, name, "categoryId", region, bio, "imageUrl", scope, featured, "updatedAt")
SELECT gen_random_uuid(), 'Mulatu Astatke', id, 'Addis Ababa', 'The father of Ethio-Jazz, blending traditional Ethiopian music with jazz and Latin rhythms.', '/images/nominees/mulatu.jpg', 'worldwide', true, now()
FROM "Category" WHERE slug = 'traditional-music'
AND NOT EXISTS (SELECT 1 FROM "Nominee" WHERE name = 'Mulatu Astatke');

-- Digital Music Nominees
INSERT INTO "Nominee" (id, name, "categoryId", region, bio, "imageUrl", scope, featured, "updatedAt")
SELECT gen_random_uuid(), 'Rophnan Nuri', id, 'Addis Ababa', 'Pioneering electronic music producer merging traditional sounds with futuristic beats.', '/images/nominees/rophnan.jpg', 'ethiopia', true, now()
FROM "Category" WHERE slug = 'digital-music'
AND NOT EXISTS (SELECT 1 FROM "Nominee" WHERE name = 'Rophnan Nuri');

INSERT INTO "Nominee" (id, name, "categoryId", region, bio, "imageUrl", scope, featured, "updatedAt")
SELECT gen_random_uuid(), 'Jano Band', id, 'Addis Ababa', 'Rock fusion band bringing a new energy to Ethiopian music.', '/images/nominees/jano.jpg', 'ethiopia', false, now()
FROM "Category" WHERE slug = 'digital-music'
AND NOT EXISTS (SELECT 1 FROM "Nominee" WHERE name = 'Jano Band');

-- Poetry Nominees
INSERT INTO "Nominee" (id, name, "categoryId", region, bio, "imageUrl", scope, featured, "updatedAt")
SELECT gen_random_uuid(), 'Bewketu Seyoum', id, 'Debre Markos', 'Acclaimed poet and novelist known for his humorous yet poignant social commentary.', '/images/nominees/bewketu.jpg', 'ethiopia', true, now()
FROM "Category" WHERE slug = 'poetry'
AND NOT EXISTS (SELECT 1 FROM "Nominee" WHERE name = 'Bewketu Seyoum');

INSERT INTO "Nominee" (id, name, "categoryId", region, bio, "imageUrl", scope, featured, "updatedAt")
SELECT gen_random_uuid(), 'Lemn Sissay', id, 'United Kingdom', 'Award-winning poet and playwright connecting the Ethiopian diaspora through words.', '/images/nominees/lemn.jpg', 'worldwide', false, now()
FROM "Category" WHERE slug = 'poetry'
AND NOT EXISTS (SELECT 1 FROM "Nominee" WHERE name = 'Lemn Sissay');
