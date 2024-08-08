/*
  Warnings:

  - Added the required column `media_name` to the `medias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_name` to the `profile_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medias" ADD COLUMN     "media_name" VARCHAR NOT NULL,
ALTER COLUMN "media_url" SET DEFAULT 'Not Attached';

-- AlterTable
ALTER TABLE "profile_images" ADD COLUMN     "img_name" VARCHAR NOT NULL,
ALTER COLUMN "img_url" SET DEFAULT 'Not Attached';
