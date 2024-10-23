ALTER TABLE "FilContent" RENAME COLUMN "fil_id" TO "filid";--> statement-breakpoint
ALTER TABLE "FilContent" RENAME COLUMN "chunk_index" TO "chunkindex";--> statement-breakpoint
ALTER TABLE "FilContent" RENAME COLUMN "total_chunks" TO "totalchunks";--> statement-breakpoint
ALTER TABLE "FilContent" DROP CONSTRAINT "FilContent_fil_id_fil_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "fil_content_index";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FilContent" ADD CONSTRAINT "FilContent_filid_fil_id_fk" FOREIGN KEY ("filid") REFERENCES "public"."fil"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fil_content_index" ON "FilContent" USING btree ("filid","version","chunkindex");