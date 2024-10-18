CREATE TABLE IF NOT EXISTS "FilContent" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"fil_id" integer NOT NULL,
	"content" text NOT NULL,
	"extracted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "afstemning" ALTER COLUMN "nummer" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "afstemning" ALTER COLUMN "vedtaget" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "afstemning" ALTER COLUMN "mødeid" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "afstemning" ALTER COLUMN "typeid" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "afstemning" ALTER COLUMN "opdateringsdato" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FilContent" ADD CONSTRAINT "FilContent_fil_id_fil_id_fk" FOREIGN KEY ("fil_id") REFERENCES "public"."fil"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
