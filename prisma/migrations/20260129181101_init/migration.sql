-- CreateTable
CREATE TABLE "Poi" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "shortFact" TEXT NOT NULL,
    "fullStory" TEXT NOT NULL,
    "curatorName" TEXT NOT NULL,
    "tags" TEXT,
    "audioUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Poi_isPublished_idx" ON "Poi"("isPublished");

-- CreateIndex
CREATE INDEX "Poi_title_idx" ON "Poi"("title");
