/*
  Warnings:

  - A unique constraint covering the columns `[barcode]` on the table `Attendee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Attendee_barcode_key" ON "Attendee"("barcode");
