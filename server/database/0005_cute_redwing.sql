ALTER TABLE "FilContent" ADD COLUMN "embedding" vector(384) NOT NULL;--> statement-breakpoint
ALTER TABLE "taleSegment" ADD COLUMN "embedding" vector(384) NOT NULL;