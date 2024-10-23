ALTER TABLE "FilContent" ALTER COLUMN "chunk_index" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "FilContent" ADD COLUMN "total_chunks" integer NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fil_content_index" ON "FilContent" USING btree ("fil_id","version","chunk_index");