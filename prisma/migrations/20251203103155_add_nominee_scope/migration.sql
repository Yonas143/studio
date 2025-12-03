-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Nominee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "categoryId" TEXT NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'ethiopia',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Nominee_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Nominee" ("bio", "categoryId", "createdAt", "featured", "id", "imageUrl", "isActive", "name", "updatedAt", "videoUrl", "voteCount") SELECT "bio", "categoryId", "createdAt", "featured", "id", "imageUrl", "isActive", "name", "updatedAt", "videoUrl", "voteCount" FROM "Nominee";
DROP TABLE "Nominee";
ALTER TABLE "new_Nominee" RENAME TO "Nominee";
CREATE INDEX "Nominee_categoryId_idx" ON "Nominee"("categoryId");
CREATE INDEX "Nominee_scope_idx" ON "Nominee"("scope");
CREATE INDEX "Nominee_featured_idx" ON "Nominee"("featured");
CREATE INDEX "Nominee_isActive_idx" ON "Nominee"("isActive");
CREATE INDEX "Nominee_voteCount_idx" ON "Nominee"("voteCount");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
