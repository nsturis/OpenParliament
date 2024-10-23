DROP INDEX IF EXISTS "idx_19879_ix_fk_sagstrin_sag";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_19879_ix_fk_sagstrin_sagstrinsstatus";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_19879_ix_fk_sagstrin_sagstrinstype";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_19932_AfstemningAktør";--> statement-breakpoint
ALTER TABLE "dagsordenspunkt" ALTER COLUMN "mødeid" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "dagsordenspunktdokument" ALTER COLUMN "dokumentid" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "dagsordenspunktdokument" ALTER COLUMN "dagsordenspunktid" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "dagsordenspunktsag" ALTER COLUMN "dagsordenspunktid" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "dagsordenspunktsag" ALTER COLUMN "sagid" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "dokument" ALTER COLUMN "typeid" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "dokument" ALTER COLUMN "kategoriid" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "dokument" ALTER COLUMN "statusid" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "afstemning" ADD CONSTRAINT "afstemning_mødeid_Møde_id_fk" FOREIGN KEY ("mødeid") REFERENCES "public"."Møde"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "afstemning" ADD CONSTRAINT "afstemning_typeid_afstemningstype_id_fk" FOREIGN KEY ("typeid") REFERENCES "public"."afstemningstype"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "afstemning" ADD CONSTRAINT "afstemning_sagstrinid_sagstrin_id_fk" FOREIGN KEY ("sagstrinid") REFERENCES "public"."sagstrin"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Aktør" ADD CONSTRAINT "Aktør_typeid_Aktørtype_id_fk" FOREIGN KEY ("typeid") REFERENCES "public"."Aktørtype"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Aktør" ADD CONSTRAINT "Aktør_periodeid_periode_id_fk" FOREIGN KEY ("periodeid") REFERENCES "public"."periode"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AktørAktør" ADD CONSTRAINT "AktørAktør_fraaktørid_Aktør_id_fk" FOREIGN KEY ("fraaktørid") REFERENCES "public"."Aktør"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AktørAktør" ADD CONSTRAINT "AktørAktør_tilaktørid_Aktør_id_fk" FOREIGN KEY ("tilaktørid") REFERENCES "public"."Aktør"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AktørAktør" ADD CONSTRAINT "AktørAktør_rolleid_AktørAktørRolle_id_fk" FOREIGN KEY ("rolleid") REFERENCES "public"."AktørAktørRolle"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dagsordenspunkt" ADD CONSTRAINT "dagsordenspunkt_superid_dagsordenspunkt_id_fk" FOREIGN KEY ("superid") REFERENCES "public"."dagsordenspunkt"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dagsordenspunkt" ADD CONSTRAINT "dagsordenspunkt_sagstrinid_sagstrin_id_fk" FOREIGN KEY ("sagstrinid") REFERENCES "public"."sagstrin"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dagsordenspunkt" ADD CONSTRAINT "dagsordenspunkt_mødeid_Møde_id_fk" FOREIGN KEY ("mødeid") REFERENCES "public"."Møde"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dagsordenspunktdokument" ADD CONSTRAINT "dagsordenspunktdokument_dokumentid_dokument_id_fk" FOREIGN KEY ("dokumentid") REFERENCES "public"."dokument"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dagsordenspunktdokument" ADD CONSTRAINT "dagsordenspunktdokument_dagsordenspunktid_dagsordenspunkt_id_fk" FOREIGN KEY ("dagsordenspunktid") REFERENCES "public"."dagsordenspunkt"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dagsordenspunktsag" ADD CONSTRAINT "dagsordenspunktsag_dagsordenspunktid_dagsordenspunkt_id_fk" FOREIGN KEY ("dagsordenspunktid") REFERENCES "public"."dagsordenspunkt"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dagsordenspunktsag" ADD CONSTRAINT "dagsordenspunktsag_sagid_sag_id_fk" FOREIGN KEY ("sagid") REFERENCES "public"."sag"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dokument" ADD CONSTRAINT "dokument_typeid_dokumenttype_id_fk" FOREIGN KEY ("typeid") REFERENCES "public"."dokumenttype"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dokument" ADD CONSTRAINT "dokument_kategoriid_dokumentkategori_id_fk" FOREIGN KEY ("kategoriid") REFERENCES "public"."dokumentkategori"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dokument" ADD CONSTRAINT "dokument_statusid_dokumentstatus_id_fk" FOREIGN KEY ("statusid") REFERENCES "public"."dokumentstatus"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dokument" ADD CONSTRAINT "dokument_spørgsmålsid_dokument_id_fk" FOREIGN KEY ("spørgsmålsid") REFERENCES "public"."dokument"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DokumentAktør" ADD CONSTRAINT "DokumentAktør_dokumentid_dokument_id_fk" FOREIGN KEY ("dokumentid") REFERENCES "public"."dokument"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DokumentAktør" ADD CONSTRAINT "DokumentAktør_aktørid_Aktør_id_fk" FOREIGN KEY ("aktørid") REFERENCES "public"."Aktør"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DokumentAktør" ADD CONSTRAINT "DokumentAktør_rolleid_DokumentAktørRolle_id_fk" FOREIGN KEY ("rolleid") REFERENCES "public"."DokumentAktørRolle"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Møde" ADD CONSTRAINT "Møde_statusid_Mødestatus_id_fk" FOREIGN KEY ("statusid") REFERENCES "public"."Mødestatus"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Møde" ADD CONSTRAINT "Møde_typeid_Mødetype_id_fk" FOREIGN KEY ("typeid") REFERENCES "public"."Mødetype"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Møde" ADD CONSTRAINT "Møde_periodeid_periode_id_fk" FOREIGN KEY ("periodeid") REFERENCES "public"."periode"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MødeAktør" ADD CONSTRAINT "MødeAktør_mødeid_Møde_id_fk" FOREIGN KEY ("mødeid") REFERENCES "public"."Møde"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MødeAktør" ADD CONSTRAINT "MødeAktør_aktørid_Aktør_id_fk" FOREIGN KEY ("aktørid") REFERENCES "public"."Aktør"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sag" ADD CONSTRAINT "sag_typeid_sagstype_id_fk" FOREIGN KEY ("typeid") REFERENCES "public"."sagstype"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sag" ADD CONSTRAINT "sag_kategoriid_sagskategori_id_fk" FOREIGN KEY ("kategoriid") REFERENCES "public"."sagskategori"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sag" ADD CONSTRAINT "sag_statusid_sagsstatus_id_fk" FOREIGN KEY ("statusid") REFERENCES "public"."sagsstatus"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sag" ADD CONSTRAINT "sag_periodeid_periode_id_fk" FOREIGN KEY ("periodeid") REFERENCES "public"."periode"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sag" ADD CONSTRAINT "sag_fremsatundersagid_sag_id_fk" FOREIGN KEY ("fremsatundersagid") REFERENCES "public"."sag"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sag" ADD CONSTRAINT "sag_deltundersagid_sag_id_fk" FOREIGN KEY ("deltundersagid") REFERENCES "public"."sag"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SagAktør" ADD CONSTRAINT "SagAktør_aktørid_Aktør_id_fk" FOREIGN KEY ("aktørid") REFERENCES "public"."Aktør"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SagAktør" ADD CONSTRAINT "SagAktør_sagid_sag_id_fk" FOREIGN KEY ("sagid") REFERENCES "public"."sag"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SagAktør" ADD CONSTRAINT "SagAktør_rolleid_SagAktørRolle_id_fk" FOREIGN KEY ("rolleid") REFERENCES "public"."SagAktørRolle"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sagdokument" ADD CONSTRAINT "sagdokument_sagid_sag_id_fk" FOREIGN KEY ("sagid") REFERENCES "public"."sag"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sagdokument" ADD CONSTRAINT "sagdokument_dokumentid_dokument_id_fk" FOREIGN KEY ("dokumentid") REFERENCES "public"."dokument"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sagdokument" ADD CONSTRAINT "sagdokument_rolleid_sagdokumentrolle_id_fk" FOREIGN KEY ("rolleid") REFERENCES "public"."sagdokumentrolle"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sagstrin" ADD CONSTRAINT "sagstrin_sagid_sag_id_fk" FOREIGN KEY ("sagid") REFERENCES "public"."sag"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sagstrin" ADD CONSTRAINT "sagstrin_typeid_sagstrinstype_id_fk" FOREIGN KEY ("typeid") REFERENCES "public"."sagstrinstype"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sagstrin" ADD CONSTRAINT "sagstrin_statusid_sagstrinsstatus_id_fk" FOREIGN KEY ("statusid") REFERENCES "public"."sagstrinsstatus"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SagstrinAktør" ADD CONSTRAINT "SagstrinAktør_sagstrinid_sagstrin_id_fk" FOREIGN KEY ("sagstrinid") REFERENCES "public"."sagstrin"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SagstrinAktør" ADD CONSTRAINT "SagstrinAktør_aktørid_Aktør_id_fk" FOREIGN KEY ("aktørid") REFERENCES "public"."Aktør"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SagstrinAktør" ADD CONSTRAINT "SagstrinAktør_rolleid_SagstrinAktørRolle_id_fk" FOREIGN KEY ("rolleid") REFERENCES "public"."SagstrinAktørRolle"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sagstrindokument" ADD CONSTRAINT "sagstrindokument_sagstrinid_sagstrin_id_fk" FOREIGN KEY ("sagstrinid") REFERENCES "public"."sagstrin"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sagstrindokument" ADD CONSTRAINT "sagstrindokument_dokumentid_dokument_id_fk" FOREIGN KEY ("dokumentid") REFERENCES "public"."dokument"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sambehandlinger" ADD CONSTRAINT "sambehandlinger_førstesagstrinid_sagstrin_id_fk" FOREIGN KEY ("førstesagstrinid") REFERENCES "public"."sagstrin"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sambehandlinger" ADD CONSTRAINT "sambehandlinger_andetsagstrinid_sagstrin_id_fk" FOREIGN KEY ("andetsagstrinid") REFERENCES "public"."sagstrin"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stemme" ADD CONSTRAINT "stemme_typeid_stemmetype_id_fk" FOREIGN KEY ("typeid") REFERENCES "public"."stemmetype"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stemme" ADD CONSTRAINT "stemme_afstemningid_afstemning_id_fk" FOREIGN KEY ("afstemningid") REFERENCES "public"."afstemning"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stemme" ADD CONSTRAINT "stemme_aktørid_Aktør_id_fk" FOREIGN KEY ("aktørid") REFERENCES "public"."Aktør"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DROP SEQUENCE "public"."AktørAktør_id_seq";--> statement-breakpoint
DROP SEQUENCE "public"."DokumentAktør_id_seq";--> statement-breakpoint
DROP SEQUENCE "public"."MødeAktør_id_seq";--> statement-breakpoint
DROP SEQUENCE "public"."SagAktør_id_seq";--> statement-breakpoint
DROP SEQUENCE "public"."SagstrinAktør_id_seq";