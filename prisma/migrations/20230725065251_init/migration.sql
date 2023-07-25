/*
  Warnings:

  - You are about to drop the column `client_email` on the `ticket` table. All the data in the column will be lost.
  - You are about to drop the column `client_name` on the `ticket` table. All the data in the column will be lost.
  - You are about to drop the column `issues_and_concerns` on the `ticket` table. All the data in the column will be lost.
  - You are about to drop the column `project_name` on the `ticket` table. All the data in the column will be lost.
  - You are about to drop the column `project_status` on the `ticket` table. All the data in the column will be lost.
  - Added the required column `clientEmail` to the `ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientName` to the `ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issuesAndConcerns` to the `ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectName` to the `ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectStatus` to the `ticket` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectStatus" TEXT NOT NULL,
    "issuesAndConcerns" TEXT NOT NULL
);
INSERT INTO "new_ticket" ("id") SELECT "id" FROM "ticket";
DROP TABLE "ticket";
ALTER TABLE "new_ticket" RENAME TO "ticket";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
