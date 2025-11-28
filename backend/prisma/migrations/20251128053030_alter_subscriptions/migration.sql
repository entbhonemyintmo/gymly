-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "start_date" DROP NOT NULL,
ALTER COLUMN "start_date" DROP DEFAULT,
ALTER COLUMN "end_date" DROP NOT NULL;
