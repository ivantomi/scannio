/*
  Warnings:

  - Changed the type of `barcode` on the `Attendee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Attendee" DROP COLUMN "barcode",
ADD COLUMN     "barcode" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_barcode_key" ON "Attendee"("barcode");
