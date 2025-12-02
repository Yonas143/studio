/*
  Warnings:

  - You are about to drop the column `userId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `email` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "fileUrl" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "portfolioUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Submission" ("category", "createdAt", "description", "fileUrl", "id", "status", "title", "updatedAt") SELECT "category", "createdAt", "description", "fileUrl", "id", "status", "title", "updatedAt" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
CREATE INDEX "Submission_status_idx" ON "Submission"("status");
CREATE INDEX "Submission_category_idx" ON "Submission"("category");
CREATE INDEX "Submission_email_idx" ON "Submission"("email");
CREATE TABLE "new_Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nomineeId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "fingerprint" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vote_nomineeId_fkey" FOREIGN KEY ("nomineeId") REFERENCES "Nominee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Vote" ("createdAt", "id", "ipAddress", "nomineeId") SELECT "createdAt", "id", "ipAddress", "nomineeId" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
CREATE INDEX "Vote_ipAddress_idx" ON "Vote"("ipAddress");
CREATE INDEX "Vote_nomineeId_idx" ON "Vote"("nomineeId");
CREATE INDEX "Vote_createdAt_idx" ON "Vote"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
