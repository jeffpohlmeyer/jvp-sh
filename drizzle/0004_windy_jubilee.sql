ALTER TABLE "urls" ADD COLUMN "user_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "urls" ADD CONSTRAINT "urls_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
