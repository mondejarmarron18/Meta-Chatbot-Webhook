/*
  Warnings:

  - The primary key for the `ticket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `ticket` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The required column `ticketNumber` was added to the `ticket` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ticketNumber" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectStatus" TEXT NOT NULL,
    "issuesAndConcerns" TEXT NOT NULL
);
INSERT INTO "new_ticket" ("clientEmail", "clientName", "id", "issuesAndConcerns", "projectName", "projectStatus") SELECT "clientEmail", "clientName", "id", "issuesAndConcerns", "projectName", "projectStatus" FROM "ticket";
DROP TABLE "ticket";
ALTER TABLE "new_ticket" RENAME TO "ticket";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
