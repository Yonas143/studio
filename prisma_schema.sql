-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'participant',
    "photoURL" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nominee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "categoryId" TEXT NOT NULL,
    "region" TEXT,
    "scope" TEXT NOT NULL DEFAULT 'ethiopia',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nominee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NomineeMedia" (
    "id" TEXT NOT NULL,
    "nomineeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hint" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NomineeMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "nomineeId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "fingerprint" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "txRef" TEXT NOT NULL,
    "chapaRef" TEXT,
    "nomineeId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
    "currency" TEXT NOT NULL DEFAULT 'ETB',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "fingerprint" TEXT,
    "ipAddress" TEXT,
    "checkoutUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "fileUrl" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "portfolioUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Popup" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT,
    "imageUrl" TEXT,
    "imageLink" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "delaySeconds" INTEGER NOT NULL DEFAULT 2,
    "storageKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Popup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CulturalInsight" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT,
    "imageUrl" TEXT,
    "category" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CulturalInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdConfig" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "leftAdImage" TEXT,
    "leftAdLink" TEXT,
    "leftAdActive" BOOLEAN NOT NULL DEFAULT true,
    "rightAdImage" TEXT,
    "rightAdLink" TEXT,
    "rightAdActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_isActive_idx" ON "Category"("isActive");

-- CreateIndex
CREATE INDEX "Nominee_categoryId_idx" ON "Nominee"("categoryId");

-- CreateIndex
CREATE INDEX "Nominee_scope_idx" ON "Nominee"("scope");

-- CreateIndex
CREATE INDEX "Nominee_featured_idx" ON "Nominee"("featured");

-- CreateIndex
CREATE INDEX "Nominee_isActive_idx" ON "Nominee"("isActive");

-- CreateIndex
CREATE INDEX "Nominee_voteCount_idx" ON "Nominee"("voteCount");

-- CreateIndex
CREATE INDEX "NomineeMedia_nomineeId_idx" ON "NomineeMedia"("nomineeId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_paymentId_key" ON "Vote"("paymentId");

-- CreateIndex
CREATE INDEX "Vote_ipAddress_idx" ON "Vote"("ipAddress");

-- CreateIndex
CREATE INDEX "Vote_nomineeId_idx" ON "Vote"("nomineeId");

-- CreateIndex
CREATE INDEX "Vote_createdAt_idx" ON "Vote"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_txRef_key" ON "Payment"("txRef");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_nomineeId_idx" ON "Payment"("nomineeId");

-- CreateIndex
CREATE INDEX "Payment_txRef_idx" ON "Payment"("txRef");

-- CreateIndex
CREATE INDEX "Submission_status_idx" ON "Submission"("status");

-- CreateIndex
CREATE INDEX "Submission_category_idx" ON "Submission"("category");

-- CreateIndex
CREATE INDEX "Submission_email_idx" ON "Submission"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Popup_storageKey_key" ON "Popup"("storageKey");

-- CreateIndex
CREATE INDEX "Popup_isActive_idx" ON "Popup"("isActive");

-- CreateIndex
CREATE INDEX "Popup_storageKey_idx" ON "Popup"("storageKey");

-- CreateIndex
CREATE INDEX "TimelineEvent_date_idx" ON "TimelineEvent"("date");

-- CreateIndex
CREATE INDEX "TimelineEvent_isActive_idx" ON "TimelineEvent"("isActive");

-- CreateIndex
CREATE INDEX "TimelineEvent_order_idx" ON "TimelineEvent"("order");

-- CreateIndex
CREATE INDEX "CulturalInsight_isPublished_idx" ON "CulturalInsight"("isPublished");

-- CreateIndex
CREATE INDEX "CulturalInsight_category_idx" ON "CulturalInsight"("category");

-- AddForeignKey
ALTER TABLE "Nominee" ADD CONSTRAINT "Nominee_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NomineeMedia" ADD CONSTRAINT "NomineeMedia_nomineeId_fkey" FOREIGN KEY ("nomineeId") REFERENCES "Nominee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_nomineeId_fkey" FOREIGN KEY ("nomineeId") REFERENCES "Nominee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_nomineeId_fkey" FOREIGN KEY ("nomineeId") REFERENCES "Nominee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create a trigger to sync Supabase Auth users to the public.User table

-- Function to handle new user insertion
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public."User" (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email), -- Use email as fallback name
    'participant' -- Default role
  );
  return new;
end;
$$;

-- Trigger to call the function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
-- Enable RLS for all sensitive tables
ALTER TABLE "Nominee" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NomineeMedia" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Submission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Popup" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TimelineEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CulturalInsight" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdConfig" ENABLE ROW LEVEL SECURITY;

-- Default Policies: Public READ access for public data
CREATE POLICY "Public Read Nominee" ON "Nominee" FOR SELECT USING (true);
CREATE POLICY "Public Read Category" ON "Category" FOR SELECT USING (true);
CREATE POLICY "Public Read NomineeMedia" ON "NomineeMedia" FOR SELECT USING (true);
CREATE POLICY "Public Read Vote" ON "Vote" FOR SELECT USING (true); -- Public can see vote counts/leaderboard
CREATE POLICY "Public Read CulturalInsight" ON "CulturalInsight" FOR SELECT USING ("isPublished" = true);
CREATE POLICY "Public Read TimelineEvent" ON "TimelineEvent" FOR SELECT USING ("isActive" = true);
CREATE POLICY "Public Read AdConfig" ON "AdConfig" FOR SELECT USING (true);

-- Deny all public WRITE/DELETE access
-- Writes should happen via the Next.js API layer which uses the Direct Database Connection (Prisma) 
-- bypassing Supabase RLS policies (as Prisma uses the postgres role).
-- This ensures that unauthenticated clients using the 'anon' key cannot modify anything.

DROP POLICY IF EXISTS "No Write Nominee" ON "Nominee";
CREATE POLICY "No Write Nominee" ON "Nominee" FOR ALL USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "No Write Vote" ON "Vote";
CREATE POLICY "No Write Vote" ON "Vote" FOR ALL USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "No Write Payment" ON "Payment";
CREATE POLICY "No Write Payment" ON "Payment" FOR ALL USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "No Write Category" ON "Category";
CREATE POLICY "No Write Category" ON "Category" FOR ALL USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "No Write User" ON "User";
CREATE POLICY "No Write User" ON "User" FOR ALL USING (false) WITH CHECK (false);

-- Admins can do anything (requires service_role which bypasses RLS, so no need for policies here unless using authenticated role)
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
