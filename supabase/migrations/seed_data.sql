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

-- Categories are kept as foundation, but nominees should be added via Admin Dashboard or official data import.
