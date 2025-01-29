CREATE TABLE IF NOT EXISTS "DocumentContent" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"document_id" integer NOT NULL,
	"raw_content" text NOT NULL,
	"document_type" text NOT NULL,
	"extracted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "taleSegmentChunk" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"tale_segment_id" integer NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(768) NOT NULL,
	"chunk_index" integer NOT NULL,
	"total_chunks" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "taleSegmentRaw" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"mødeid" integer NOT NULL,
	"starttid" timestamp with time zone,
	"sluttid" timestamp with time zone,
	"last_modified" timestamp with time zone,
	"sagid" integer,
	"aktørid" integer NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taleSegmentChunk" ADD CONSTRAINT "taleSegmentChunk_tale_segment_id_taleSegmentRaw_id_fk" FOREIGN KEY ("tale_segment_id") REFERENCES "public"."taleSegmentRaw"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taleSegmentRaw" ADD CONSTRAINT "taleSegmentRaw_mødeid_Møde_id_fk" FOREIGN KEY ("mødeid") REFERENCES "public"."Møde"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taleSegmentRaw" ADD CONSTRAINT "taleSegmentRaw_sagid_sag_id_fk" FOREIGN KEY ("sagid") REFERENCES "public"."sag"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taleSegmentRaw" ADD CONSTRAINT "taleSegmentRaw_aktørid_Aktør_id_fk" FOREIGN KEY ("aktørid") REFERENCES "public"."Aktør"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tale_segment_chunk_index" ON "taleSegmentChunk" USING btree ("tale_segment_id","chunk_index");