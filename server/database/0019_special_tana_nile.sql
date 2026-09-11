CREATE INDEX IF NOT EXISTS "afstemning_sagstrinid_idx" ON "afstemning" USING btree ("sagstrinid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "afstemning_mødeid_idx" ON "afstemning" USING btree ("mødeid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "aktør_aktør_fraaktør_rolle_idx" ON "AktørAktør" USING btree ("fraaktørid","rolleid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dagsordenspunkt_sagstrinid_idx" ON "dagsordenspunkt" USING btree ("sagstrinid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dagsordenspunkt_mødeid_idx" ON "dagsordenspunkt" USING btree ("mødeid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dokumentaktør_dokumentid_idx" ON "DokumentAktør" USING btree ("dokumentid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dokumentaktør_aktørid_idx" ON "DokumentAktør" USING btree ("aktørid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "emneordsag_sagid_idx" ON "emneordsag" USING btree ("sagid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fil_dokumentid_idx" ON "fil" USING btree ("dokumentid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sagaktør_sagid_idx" ON "SagAktør" USING btree ("sagid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sagaktør_aktørid_idx" ON "SagAktør" USING btree ("aktørid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sagdokument_sagid_idx" ON "sagdokument" USING btree ("sagid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sagdokument_dokumentid_idx" ON "sagdokument" USING btree ("dokumentid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sagstrinaktør_sagstrinid_idx" ON "SagstrinAktør" USING btree ("sagstrinid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sagstrinaktør_aktørid_idx" ON "SagstrinAktør" USING btree ("aktørid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sagstrindokument_sagstrinid_idx" ON "sagstrindokument" USING btree ("sagstrinid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sagstrindokument_dokumentid_idx" ON "sagstrindokument" USING btree ("dokumentid");