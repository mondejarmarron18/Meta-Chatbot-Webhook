-- CreateTable
CREATE TABLE "ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectStatus" TEXT NOT NULL,
    "issuesAndConcerns" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
