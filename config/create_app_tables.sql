-- App-only tables (not part of the ODA backup).
-- pgloader re-seeding drops the whole public schema — re-apply this file afterwards:
--   docker exec -i pgsqldb psql -U postgres -d oda < config/create_app_tables.sql
CREATE EXTENSION IF NOT EXISTS vector;








CREATE TABLE public."DocumentContent" (
    id bigint NOT NULL,
    document_id integer NOT NULL,
    raw_content text NOT NULL,
    document_type text NOT NULL,
    extracted_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."DocumentContent" OWNER TO postgres;


CREATE SEQUENCE public."DocumentContent_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DocumentContent_id_seq" OWNER TO postgres;


ALTER SEQUENCE public."DocumentContent_id_seq" OWNED BY public."DocumentContent".id;



CREATE TABLE public."FilContent" (
    id bigint NOT NULL,
    filid integer NOT NULL,
    content text NOT NULL,
    embedding public.vector(768) NOT NULL,
    chunkindex integer NOT NULL,
    totalchunks integer NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    extracted_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."FilContent" OWNER TO postgres;


CREATE SEQUENCE public."FilContent_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."FilContent_id_seq" OWNER TO postgres;


ALTER SEQUENCE public."FilContent_id_seq" OWNED BY public."FilContent".id;



CREATE TABLE public."liveSession" (
    id bigint NOT NULL,
    "mødeid" integer,
    started_at timestamp with time zone NOT NULL,
    ended_at timestamp with time zone,
    status text DEFAULT 'active'::text NOT NULL,
    stream_url text NOT NULL,
    reconciliation_status text,
    opdateringsdato timestamp with time zone NOT NULL
);


ALTER TABLE public."liveSession" OWNER TO postgres;


CREATE SEQUENCE public."liveSession_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."liveSession_id_seq" OWNER TO postgres;


ALTER SEQUENCE public."liveSession_id_seq" OWNED BY public."liveSession".id;



CREATE TABLE public."liveSpeakerDetection" (
    id bigint NOT NULL,
    live_session_id integer NOT NULL,
    "aktørid" integer,
    detected_name text NOT NULL,
    detected_at timestamp with time zone NOT NULL,
    confidence real
);


ALTER TABLE public."liveSpeakerDetection" OWNER TO postgres;


CREATE SEQUENCE public."liveSpeakerDetection_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."liveSpeakerDetection_id_seq" OWNER TO postgres;


ALTER SEQUENCE public."liveSpeakerDetection_id_seq" OWNED BY public."liveSpeakerDetection".id;



CREATE TABLE public."taleSegment" (
    id bigint NOT NULL,
    content text NOT NULL,
    "mødeid" integer NOT NULL,
    starttid timestamp with time zone,
    sluttid timestamp with time zone,
    last_modified timestamp with time zone,
    sagid integer,
    "aktørid" integer NOT NULL,
    opdateringsdato timestamp with time zone NOT NULL,
    embedding public.vector(768) NOT NULL,
    chunk_index integer NOT NULL
);


ALTER TABLE public."taleSegment" OWNER TO postgres;


CREATE TABLE public."taleSegmentChunk" (
    id bigint NOT NULL,
    tale_segment_id integer NOT NULL,
    content text NOT NULL,
    embedding public.vector(768) NOT NULL,
    chunk_index integer NOT NULL,
    total_chunks integer NOT NULL
);


ALTER TABLE public."taleSegmentChunk" OWNER TO postgres;


CREATE SEQUENCE public."taleSegmentChunk_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."taleSegmentChunk_id_seq" OWNER TO postgres;


ALTER SEQUENCE public."taleSegmentChunk_id_seq" OWNED BY public."taleSegmentChunk".id;



CREATE TABLE public."taleSegmentRaw" (
    id bigint NOT NULL,
    content text NOT NULL,
    "mødeid" integer NOT NULL,
    starttid timestamp with time zone NOT NULL,
    sluttid timestamp with time zone,
    last_modified timestamp with time zone,
    sagid integer,
    "aktørid" integer,
    "oratorFornavn" text,
    "oratorEfternavn" text,
    "oratorRolle" text,
    opdateringsdato timestamp with time zone NOT NULL,
    status text DEFAULT 'final'::text NOT NULL,
    confidence real
);


ALTER TABLE public."taleSegmentRaw" OWNER TO postgres;


CREATE SEQUENCE public."taleSegmentRaw_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."taleSegmentRaw_id_seq" OWNER TO postgres;


ALTER SEQUENCE public."taleSegmentRaw_id_seq" OWNED BY public."taleSegmentRaw".id;



CREATE SEQUENCE public."taleSegment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."taleSegment_id_seq" OWNER TO postgres;


ALTER SEQUENCE public."taleSegment_id_seq" OWNED BY public."taleSegment".id;



ALTER TABLE ONLY public."DocumentContent" ALTER COLUMN id SET DEFAULT nextval('public."DocumentContent_id_seq"'::regclass);



ALTER TABLE ONLY public."FilContent" ALTER COLUMN id SET DEFAULT nextval('public."FilContent_id_seq"'::regclass);



ALTER TABLE ONLY public."liveSession" ALTER COLUMN id SET DEFAULT nextval('public."liveSession_id_seq"'::regclass);



ALTER TABLE ONLY public."liveSpeakerDetection" ALTER COLUMN id SET DEFAULT nextval('public."liveSpeakerDetection_id_seq"'::regclass);



ALTER TABLE ONLY public."taleSegment" ALTER COLUMN id SET DEFAULT nextval('public."taleSegment_id_seq"'::regclass);



ALTER TABLE ONLY public."taleSegmentChunk" ALTER COLUMN id SET DEFAULT nextval('public."taleSegmentChunk_id_seq"'::regclass);



ALTER TABLE ONLY public."taleSegmentRaw" ALTER COLUMN id SET DEFAULT nextval('public."taleSegmentRaw_id_seq"'::regclass);



ALTER TABLE ONLY public."DocumentContent"
    ADD CONSTRAINT "DocumentContent_pkey" PRIMARY KEY (id);



ALTER TABLE ONLY public."FilContent"
    ADD CONSTRAINT "FilContent_pkey" PRIMARY KEY (id);



ALTER TABLE ONLY public."liveSession"
    ADD CONSTRAINT "liveSession_pkey" PRIMARY KEY (id);



ALTER TABLE ONLY public."liveSpeakerDetection"
    ADD CONSTRAINT "liveSpeakerDetection_pkey" PRIMARY KEY (id);



ALTER TABLE ONLY public."taleSegmentChunk"
    ADD CONSTRAINT "taleSegmentChunk_pkey" PRIMARY KEY (id);



ALTER TABLE ONLY public."taleSegmentRaw"
    ADD CONSTRAINT "taleSegmentRaw_pkey" PRIMARY KEY (id);



ALTER TABLE ONLY public."taleSegment"
    ADD CONSTRAINT "taleSegment_pkey" PRIMARY KEY (id);



CREATE INDEX fil_content_index ON public."FilContent" USING btree (filid, version, chunkindex);



CREATE INDEX speech_order_idx ON public."taleSegment" USING btree ("mødeid", starttid);



CREATE INDEX tale_segment_chunk_index ON public."taleSegmentChunk" USING btree (tale_segment_id, chunk_index);



ALTER TABLE ONLY public."FilContent"
    ADD CONSTRAINT "FilContent_filid_fkey" FOREIGN KEY (filid) REFERENCES public.fil(id);



ALTER TABLE ONLY public."liveSession"
    ADD CONSTRAINT "liveSession_mødeid_fkey" FOREIGN KEY ("mødeid") REFERENCES public."Møde"(id);



ALTER TABLE ONLY public."liveSpeakerDetection"
    ADD CONSTRAINT "liveSpeakerDetection_aktørid_fkey" FOREIGN KEY ("aktørid") REFERENCES public."Aktør"(id);



ALTER TABLE ONLY public."liveSpeakerDetection"
    ADD CONSTRAINT "liveSpeakerDetection_live_session_id_fkey" FOREIGN KEY (live_session_id) REFERENCES public."liveSession"(id);



ALTER TABLE ONLY public."taleSegmentChunk"
    ADD CONSTRAINT "taleSegmentChunk_tale_segment_id_fkey" FOREIGN KEY (tale_segment_id) REFERENCES public."taleSegmentRaw"(id);



ALTER TABLE ONLY public."taleSegmentRaw"
    ADD CONSTRAINT "taleSegmentRaw_aktørid_fkey" FOREIGN KEY ("aktørid") REFERENCES public."Aktør"(id);



ALTER TABLE ONLY public."taleSegmentRaw"
    ADD CONSTRAINT "taleSegmentRaw_mødeid_fkey" FOREIGN KEY ("mødeid") REFERENCES public."Møde"(id);



ALTER TABLE ONLY public."taleSegmentRaw"
    ADD CONSTRAINT "taleSegmentRaw_sagid_fkey" FOREIGN KEY (sagid) REFERENCES public.sag(id);



ALTER TABLE ONLY public."taleSegment"
    ADD CONSTRAINT "taleSegment_aktørid_fkey" FOREIGN KEY ("aktørid") REFERENCES public."Aktør"(id);



ALTER TABLE ONLY public."taleSegment"
    ADD CONSTRAINT "taleSegment_mødeid_fkey" FOREIGN KEY ("mødeid") REFERENCES public."Møde"(id);



ALTER TABLE ONLY public."taleSegment"
    ADD CONSTRAINT "taleSegment_sagid_fkey" FOREIGN KEY (sagid) REFERENCES public.sag(id);





-- Danish full-text index backing /api/search's text-search path
CREATE INDEX IF NOT EXISTS tale_segment_raw_fts_idx ON public."taleSegmentRaw" USING gin (to_tsvector('danish', content));

-- Valgtest (election quiz) persistence
CREATE TABLE IF NOT EXISTS public."valgtestVote" (
    id bigserial PRIMARY KEY,
    ftid text NOT NULL,
    samling text NOT NULL,
    titel text,
    vote text NOT NULL,
    oprettet timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS public."valgtestResult" (
    id bigserial PRIMARY KEY,
    parties jsonb NOT NULL,
    oprettet timestamp with time zone DEFAULT now() NOT NULL
);
