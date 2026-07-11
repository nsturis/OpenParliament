import os


STREAM_URL = os.getenv(
    "STREAM_URL",
    "https://cdnapi.kaltura.com/p/2158211/sp/327418300/playManifest"
    "/entryId/1_24gfa7qq/protocol/https/format/applehttp/a.m3u8",
)

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "oda")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "root")

DATABASE_URL = (
    f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

LLM_SERVICE_URL = os.getenv("LLM_SERVICE_URL", "http://127.0.0.1:8000")

WHISPER_MODEL = os.getenv("WHISPER_MODEL", "medium")
WHISPER_LANGUAGE = "da"

# Stream polling interval when offline (seconds)
STREAM_POLL_INTERVAL = int(os.getenv("STREAM_POLL_INTERVAL", "60"))

# Audio chunk duration for Whisper (seconds)
AUDIO_CHUNK_DURATION = int(os.getenv("AUDIO_CHUNK_DURATION", "30"))
AUDIO_OVERLAP_DURATION = int(os.getenv("AUDIO_OVERLAP_DURATION", "5"))

# OCR frame capture interval (seconds)
OCR_FRAME_INTERVAL = int(os.getenv("OCR_FRAME_INTERVAL", "5"))

# Speaker matching confidence threshold (0-100)
SPEAKER_MATCH_THRESHOLD = int(os.getenv("SPEAKER_MATCH_THRESHOLD", "80"))

# Max segment duration before forced split (seconds)
MAX_SEGMENT_DURATION = int(os.getenv("MAX_SEGMENT_DURATION", "300"))

# Silence threshold for segment boundary (seconds)
SILENCE_THRESHOLD = int(os.getenv("SILENCE_THRESHOLD", "10"))

# ODA FTP for reconciliation
ODA_FTP_HOST = "oda.ft.dk"
ODA_FTP_PATH = "/ODAXML/Referat/"

# Service port
SERVICE_PORT = int(os.getenv("SERVICE_PORT", "8001"))
