-- AlterTable
ALTER TABLE "medias" ALTER COLUMN "media_url" DROP NOT NULL,
ALTER COLUMN "media_name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "profile_images" ALTER COLUMN "img_url" DROP NOT NULL,
ALTER COLUMN "img_name" DROP NOT NULL;
