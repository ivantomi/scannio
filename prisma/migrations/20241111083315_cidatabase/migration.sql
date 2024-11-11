/*
  Warnings:

  - You are about to drop the column `name` on the `Attendee` table. All the data in the column will be lost.
  - Added the required column `barcode` to the `Attendee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Attendee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Attendee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school` to the `Attendee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendee" DROP COLUMN "name",
ADD COLUMN     "barcode" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "school" TEXT NOT NULL;
