/*
  Warnings:

  - You are about to drop the `tickets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "tickets";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "client_name" TEXT NOT NULL,
    "client_email" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "project_status" TEXT NOT NULL,
    "issues_and_concerns" TEXT NOT NULL
);
