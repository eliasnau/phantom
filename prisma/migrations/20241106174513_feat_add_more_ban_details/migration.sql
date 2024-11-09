/*
  Warnings:

  - You are about to drop the column `deviceId` on the `Ban` table. All the data in the column will be lost.
  - You are about to drop the column `evidence` on the `Ban` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Ban_userId_createdAt_idx";

-- AlterTable
ALTER TABLE "Ban" DROP COLUMN "deviceId",
DROP COLUMN "evidence";

-- CreateIndex
CREATE INDEX "Ban_userId_idx" ON "Ban"("userId");

-- CreateIndex
CREATE INDEX "Ban_issuedBy_idx" ON "Ban"("issuedBy");

-- CreateIndex
CREATE INDEX "Ban_liftedBy_idx" ON "Ban"("liftedBy");

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_issuedBy_fkey" FOREIGN KEY ("issuedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_liftedBy_fkey" FOREIGN KEY ("liftedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
