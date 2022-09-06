-- CreateTable
CREATE TABLE "WatchProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profile_pic" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "WatchProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "can_delete" BOOLEAN NOT NULL DEFAULT false,
    "TMDBMovieID" TEXT NOT NULL,
    "watchProfileId" TEXT,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Watched" (
    "id" SERIAL NOT NULL,
    "TMDBMovieID" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "watchProfileId" TEXT,

    CONSTRAINT "Watched_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WatchProfile" ADD CONSTRAINT "WatchProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_watchProfileId_fkey" FOREIGN KEY ("watchProfileId") REFERENCES "WatchProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watched" ADD CONSTRAINT "Watched_watchProfileId_fkey" FOREIGN KEY ("watchProfileId") REFERENCES "WatchProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
