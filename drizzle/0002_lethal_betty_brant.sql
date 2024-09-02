ALTER TABLE "session" RENAME COLUMN "expires" TO "expires_at";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "password_reset_needed" TO "password_reset_required";--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "expires_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "expires_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "token" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "token_expiration" timestamp;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "emailUniqueIndex" ON "user" USING btree (lower("email"));