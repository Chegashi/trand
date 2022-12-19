/*
  Warnings:

  - You are about to drop the column `losser_scoor` on the `game_history` table. All the data in the column will be lost.
  - You are about to drop the column `winner_scoor` on the `game_history` table. All the data in the column will be lost.
  - Added the required column `losser_score` to the `game_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winner_score` to the `game_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "game_history" DROP COLUMN "losser_scoor",
DROP COLUMN "winner_scoor",
ADD COLUMN     "losser_score" INTEGER NOT NULL,
ADD COLUMN     "winner_score" INTEGER NOT NULL;
