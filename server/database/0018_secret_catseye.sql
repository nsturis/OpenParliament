CREATE TABLE IF NOT EXISTS "valgtestResult" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"parties" jsonb NOT NULL,
	"oprettet" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "valgtestVote" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"ftid" text NOT NULL,
	"samling" text NOT NULL,
	"titel" text,
	"vote" text NOT NULL,
	"oprettet" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "FilContent" ALTER COLUMN "embedding" SET DATA TYPE vector(1024);--> statement-breakpoint
ALTER TABLE "taleSegment" ALTER COLUMN "embedding" SET DATA TYPE vector(1024);--> statement-breakpoint
ALTER TABLE "taleSegmentChunk" ALTER COLUMN "embedding" SET DATA TYPE vector(1024);--> statement-breakpoint
ALTER TABLE "taleSegmentRaw" ALTER COLUMN "sluttid" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "taleSegmentRaw" ALTER COLUMN "aktørid" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "taleSegmentRaw" ADD COLUMN "oratorFornavn" text;--> statement-breakpoint
ALTER TABLE "taleSegmentRaw" ADD COLUMN "oratorEfternavn" text;--> statement-breakpoint
ALTER TABLE "taleSegmentRaw" ADD COLUMN "oratorRolle" text;--> statement-breakpoint
ALTER TABLE "taleSegmentRaw" ADD COLUMN "dagsordenspunktid" integer;--> statement-breakpoint
ALTER TABLE "taleSegmentRaw" ADD COLUMN "itemNo" text;--> statement-breakpoint
ALTER TABLE "taleSegmentRaw" ADD COLUMN "sequence" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taleSegmentRaw" ADD CONSTRAINT "taleSegmentRaw_dagsordenspunktid_dagsordenspunkt_id_fk" FOREIGN KEY ("dagsordenspunktid") REFERENCES "public"."dagsordenspunkt"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
