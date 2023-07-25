-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "client_name" TEXT NOT NULL,
    "client_email" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "project_status" TEXT NOT NULL,
    "issues_and_concerns" TEXT NOT NULL
);
