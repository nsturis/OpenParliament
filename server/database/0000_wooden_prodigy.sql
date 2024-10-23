-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SEQUENCE "public"."AktørAktør_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."DokumentAktør_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."MødeAktør_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."SagAktør_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."SagstrinAktør_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "synclogger" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"entitet" text NOT NULL,
	"internid" integer NOT NULL,
	"eksternid" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL,
	"antal" integer NOT NULL,
	"godkendtdato" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "__refactorlog" (
	"operationkey" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "afstemning" (
	"id" integer PRIMARY KEY NOT NULL,
	"nummer" integer NOT NULL,
	"konklusion" text,
	"vedtaget" boolean NOT NULL,
	"kommentar" text,
	"mødeid" integer NOT NULL,
	"typeid" integer NOT NULL,
	"sagstrinid" integer,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "afstemningstype" (
	"id" integer PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Aktør" (
	"id" integer PRIMARY KEY NOT NULL,
	"typeid" integer NOT NULL,
	"gruppenavnkort" text,
	"navn" text,
	"fornavn" text,
	"efternavn" text,
	"biografi" text,
	"periodeid" integer,
	"opdateringsdato" timestamp with time zone NOT NULL,
	"startdato" timestamp with time zone,
	"slutdato" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AktørAktør" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"fraaktørid" integer NOT NULL,
	"tilaktørid" integer NOT NULL,
	"startdato" timestamp with time zone,
	"slutdato" timestamp with time zone,
	"opdateringsdato" timestamp with time zone NOT NULL,
	"rolleid" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AktørAktørRolle" (
	"id" integer PRIMARY KEY NOT NULL,
	"rolle" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Aktørtype" (
	"id" integer PRIMARY KEY NOT NULL,
	"type" text,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dagsordenspunkt" (
	"id" integer PRIMARY KEY NOT NULL,
	"kørebemærkning" text,
	"titel" text,
	"kommentar" text,
	"nummer" text,
	"forhandlingskode" text,
	"forhandling" text,
	"superid" integer,
	"sagstrinid" integer,
	"mødeid" integer NOT NULL,
	"offentlighedskode" text NOT NULL,
	"opdateringsdato" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dagsordenspunktdokument" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"dokumentid" integer NOT NULL,
	"dagsordenspunktid" integer NOT NULL,
	"note" text,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dagsordenspunktsag" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"dagsordenspunktid" integer NOT NULL,
	"sagid" integer NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dokument" (
	"id" integer PRIMARY KEY NOT NULL,
	"typeid" integer NOT NULL,
	"kategoriid" integer NOT NULL,
	"statusid" integer NOT NULL,
	"offentlighedskode" text NOT NULL,
	"titel" text NOT NULL,
	"dato" timestamp with time zone NOT NULL,
	"modtagelsesdato" timestamp with time zone,
	"frigivelsesdato" timestamp with time zone,
	"paragraf" text,
	"paragrafnummer" text,
	"spørgsmålsordlyd" text,
	"spørgsmålstitel" text,
	"spørgsmålsid" integer,
	"procedurenummer" text,
	"grundnotatstatus" text,
	"dagsordenudgavenummer" smallint,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "DokumentAktør" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"dokumentid" integer NOT NULL,
	"aktørid" integer NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL,
	"rolleid" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "DokumentAktørRolle" (
	"id" integer PRIMARY KEY NOT NULL,
	"rolle" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dokumentkategori" (
	"id" integer PRIMARY KEY NOT NULL,
	"kategori" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dokumentstatus" (
	"id" integer PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dokumenttype" (
	"id" integer PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emneord" (
	"id" integer PRIMARY KEY NOT NULL,
	"typeid" integer NOT NULL,
	"emneord" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emneorddokument" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"emneordid" integer NOT NULL,
	"dokumentid" integer NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emneordsag" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"emneordid" integer NOT NULL,
	"sagid" integer NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emneordstype" (
	"id" integer PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entitetbeskrivelse" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"entitetnavn" text,
	"beskrivelse" text,
	"opdateringsdato" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fil" (
	"id" integer PRIMARY KEY NOT NULL,
	"dokumentid" integer NOT NULL,
	"titel" text,
	"versionsdato" timestamp with time zone NOT NULL,
	"filurl" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL,
	"variantkode" text NOT NULL,
	"format" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kollonebeskrivelse" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"entitetnavn" text,
	"kollonenavn" text,
	"beskrivelse" text,
	"opdateringsdato" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Møde" (
	"id" integer PRIMARY KEY NOT NULL,
	"titel" text NOT NULL,
	"lokale" text,
	"nummer" text,
	"dagsordenurl" text,
	"starttidsbemærkning" text,
	"offentlighedskode" text NOT NULL,
	"dato" timestamp with time zone,
	"statusid" integer,
	"typeid" integer,
	"periodeid" integer NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Mødestatus" (
	"id" integer PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Mødetype" (
	"id" integer PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MødeAktør" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"mødeid" integer NOT NULL,
	"aktørid" integer NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "omtryk" (
	"id" integer PRIMARY KEY NOT NULL,
	"dokumentid" integer NOT NULL,
	"dato" timestamp with time zone,
	"begrundelse" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "periode" (
	"id" integer PRIMARY KEY NOT NULL,
	"startdato" timestamp with time zone NOT NULL,
	"slutdato" timestamp with time zone NOT NULL,
	"type" text NOT NULL,
	"kode" text NOT NULL,
	"titel" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sag" (
	"id" integer PRIMARY KEY NOT NULL,
	"typeid" integer NOT NULL,
	"kategoriid" integer,
	"statusid" integer NOT NULL,
	"titel" text NOT NULL,
	"titelkort" text NOT NULL,
	"offentlighedskode" text NOT NULL,
	"nummer" text,
	"nummerprefix" text,
	"nummernumerisk" text,
	"nummerpostfix" text,
	"resume" text,
	"afstemningskonklusion" text,
	"periodeid" integer NOT NULL,
	"afgørelsesresultatkode" text,
	"baggrundsmateriale" text,
	"opdateringsdato" timestamp with time zone NOT NULL,
	"statsbudgetsag" boolean,
	"begrundelse" text,
	"paragrafnummer" integer,
	"paragraf" text,
	"afgørelsesdato" timestamp with time zone,
	"afgørelse" text,
	"rådsmødedato" timestamp with time zone,
	"lovnummer" text,
	"lovnummerdato" timestamp with time zone,
	"retsinformationsurl" text,
	"fremsatundersagid" integer,
	"deltundersagid" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SagAktør" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"aktørid" integer NOT NULL,
	"sagid" integer NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL,
	"rolleid" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SagAktørRolle" (
	"id" integer PRIMARY KEY NOT NULL,
	"rolle" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sagdokument" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"sagid" integer NOT NULL,
	"dokumentid" integer NOT NULL,
	"bilagsnummer" text,
	"frigivelsesdato" timestamp with time zone,
	"opdateringsdato" timestamp with time zone NOT NULL,
	"rolleid" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sagdokumentrolle" (
	"id" integer PRIMARY KEY NOT NULL,
	"rolle" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sagskategori" (
	"id" integer PRIMARY KEY NOT NULL,
	"kategori" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sagsstatus" (
	"id" integer PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sagstrin" (
	"id" integer PRIMARY KEY NOT NULL,
	"titel" text NOT NULL,
	"dato" timestamp with time zone,
	"sagid" integer NOT NULL,
	"typeid" integer NOT NULL,
	"folketingstidendeurl" text,
	"folketingstidende" text,
	"folketingstidendesidenummer" text,
	"statusid" integer NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SagstrinAktør" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"sagstrinid" integer NOT NULL,
	"aktørid" integer NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL,
	"rolleid" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SagstrinAktørRolle" (
	"id" integer PRIMARY KEY NOT NULL,
	"rolle" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sagstrindokument" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"sagstrinid" integer NOT NULL,
	"dokumentid" integer NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sagstrinsstatus" (
	"id" integer PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sagstrinstype" (
	"id" integer PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sagstype" (
	"id" integer PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sambehandlinger" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"førstesagstrinid" integer NOT NULL,
	"andetsagstrinid" integer NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "slettet" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"slettetmapid" integer NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL,
	"objektid" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "slettetmap" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"datatype" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stemme" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"typeid" integer,
	"afstemningid" integer NOT NULL,
	"aktørid" integer NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stemmetype" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"opdateringsdato" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "idmap" (
	"id" integer NOT NULL,
	"originalid" text NOT NULL,
	"entity" text NOT NULL,
	CONSTRAINT "idx_19800_pk_idmap" PRIMARY KEY("id","entity")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_19768_ix_fk_emneord_emneordstype" ON "emneord" USING btree ("typeid" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_19842_ix_fk_deltundersag_sag" ON "sag" USING btree ("deltundersagid" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_19842_ix_fk_fremsatundersag_sag" ON "sag" USING btree ("fremsatundersagid" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_19842_ix_fk_sag_sagskategori" ON "sag" USING btree ("kategoriid" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_19842_ix_fk_sag_sagsstatus" ON "sag" USING btree ("statusid" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_19842_ix_fk_sag_sagstype" ON "sag" USING btree ("typeid" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_19879_ix_fk_sagstrin_sag" ON "sagstrin" USING btree ("sagid" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_19879_ix_fk_sagstrin_sagstrinsstatus" ON "sagstrin" USING btree ("statusid" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_19879_ix_fk_sagstrin_sagstrinstype" ON "sagstrin" USING btree ("typeid" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_19932_AfstemningAktør" ON "stemme" USING btree ("afstemningid" int4_ops,"aktørid" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_19800_ix_idmap_originalid_entity" ON "idmap" USING btree ("originalid" text_ops,"entity" text_ops);
*/