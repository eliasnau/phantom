DROP TABLE "two_factor";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "two_factor_enabled";