ALTER TABLE "FilContent" ALTER COLUMN "embedding" SET DATA TYPE vector(768);--> statement-breakpoint
ALTER TABLE "taleSegment" ALTER COLUMN "embedding" SET DATA TYPE vector(768);