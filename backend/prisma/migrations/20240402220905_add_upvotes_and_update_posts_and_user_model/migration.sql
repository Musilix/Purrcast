-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isDeactivated" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Upvotes" (
    "voteId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Upvotes_pkey" PRIMARY KEY ("voteId")
);

-- AddForeignKey
ALTER TABLE "Upvotes" ADD CONSTRAINT "Upvotes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvotes" ADD CONSTRAINT "Upvotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
