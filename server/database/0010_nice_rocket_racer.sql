CREATE TABLE IF NOT EXISTS "taleSegment" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"mødeid" integer NOT NULL,
	"starttid" timestamp with time zone,
	"sluttid" timestamp with time zone,
	"last_modified" timestamp with time zone,
	"sagid" integer,
	"aktørid" integer NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL,
	"embedding" vector(768) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taleSegment" ADD CONSTRAINT "taleSegment_mødeid_Møde_id_fk" FOREIGN KEY ("mødeid") REFERENCES "public"."Møde"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taleSegment" ADD CONSTRAINT "taleSegment_sagid_sag_id_fk" FOREIGN KEY ("sagid") REFERENCES "public"."sag"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taleSegment" ADD CONSTRAINT "taleSegment_aktørid_Aktør_id_fk" FOREIGN KEY ("aktørid") REFERENCES "public"."Aktør"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "speech_order_idx" ON "taleSegment" USING btree ("mødeid","starttid");