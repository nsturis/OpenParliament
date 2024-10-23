ALTER TABLE "FilContent" ADD COLUMN "version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "FilContent" ADD COLUMN "chunk_index" integer DEFAULT 0 NOT NULL;