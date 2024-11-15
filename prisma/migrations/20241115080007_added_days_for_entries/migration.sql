/*
  Warnings:

  - Changed the type of `day` on the `Entry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Day" AS ENUM ('THURSDAY', 'FRIDAY', 'SATURDAY');

-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "day",
ADD COLUMN     "day" "Day" NOT NULL;
