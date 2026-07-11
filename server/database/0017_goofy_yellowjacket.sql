CREATE TABLE IF NOT EXISTS "liveSession" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"mødeid" integer,
	"started_at" timestamp with time zone NOT NULL,
	"ended_at" timestamp with time zone,
	"status" text DEFAULT 'active' NOT NULL,
	"stream_url" text NOT NULL,
	"reconciliation_status" text,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "liveSpeakerDetection" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"live_session_id" integer NOT NULL,
	"aktørid" integer,
	"detected_name" text NOT NULL,
	"detected_at" timestamp with time zone NOT NULL,
	"confidence" real
);
--> statement-breakpoint
ALTER TABLE "taleSegmentRaw" ALTER COLUMN "starttid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "taleSegmentRaw" ALTER COLUMN "sluttid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "taleSegmentRaw" ADD COLUMN "status" text DEFAULT 'final' NOT NULL;--> statement-breakpoint
ALTER TABLE "taleSegmentRaw" ADD COLUMN "confidence" real;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liveSession" ADD CONSTRAINT "liveSession_mødeid_Møde_id_fk" FOREIGN KEY ("mødeid") REFERENCES "public"."Møde"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liveSpeakerDetection" ADD CONSTRAINT "liveSpeakerDetection_live_session_id_liveSession_id_fk" FOREIGN KEY ("live_session_id") REFERENCES "public"."liveSession"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liveSpeakerDetection" ADD CONSTRAINT "liveSpeakerDetection_aktørid_Aktør_id_fk" FOREIGN KEY ("aktørid") REFERENCES "public"."Aktør"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
