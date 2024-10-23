import os
import re
import json
import asyncio
import aiohttp
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()


# Database connection function
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
    )


# Function to clean up text content by removing fluff
def extract_main_content(content):
    lines = content.split("\n")
    cleaned_lines = []

    header_patterns = [
        r"^Aktstk\.\s*\d+",
        r"^Finansudvalget.*\d{4}",
        r"^Offentligt$",
        r"^Aktstykke nr\.$",
        r"^Folketinget.*$",
        r"^Miljøministeriet\.?$",
        r"^København,\s*den\s*\d+\.\s*\w+\s*\d+\.?$",
        r"^DD\d+$",
        r"^Til\s+Finansudvalget\.$",
        r"^Indtægt$",
        r"^\(mio\. kr\.\)$",
        r"^Udgift$",
        r"^e\.$",
        r"^f\.$",
        r"^PDF to HTML - Convert PDF files to HTML files$",
        r"^På Folketingets formands vegne$",
        r"^Lovsekretariatet$",
        r"^Svaret bedes sendt elektronisk til$",
        r"^spørgeren på$",
        r"^\[email protected\] og til$",
        r"^Lovsekretariatet på \[email protected]\.$",
        r"^Uddannelses- og Forskningsudvalget.*\d{4}-\d{2}.*S \d+\s*Offentligt$",
        r"^SPØRGSMÅL NR\. S \d+$",
        r"^§ 2 0- SP Ø RG S M Å L T IL S K RI FT LIG BE S V A R E L S E$",
        r"^Til:$",
        r"^Dato:$",
        r"^Stillet af:$",
        r"^Uddannelses- og forskningsministeren$",
    ]

    for line in lines:
        trimmed_line = line.strip()

        # Remove empty lines
        if not trimmed_line:
            continue

        # Remove lines that are page numbers or single letters
        if re.match(r"^[0-9]+$", trimmed_line) or re.match(
            r"^[a-zæøå]\.?$", trimmed_line, re.IGNORECASE
        ):
            continue

        # Remove lines matching known header/footer patterns
        if any(
            re.match(pattern, trimmed_line, re.IGNORECASE)
            for pattern in header_patterns
        ):
            continue

        # Optionally remove lines that are all uppercase and short
        if re.match(r"^[A-ZÆØÅ ]{2,}$", trimmed_line) and len(trimmed_line) < 30:
            continue

        cleaned_lines.append(trimmed_line)

    return " ".join(cleaned_lines)


async def process_document(session, file_path, db_conn):
    try:
        file_name = os.path.basename(file_path)
        file_id = os.path.splitext(file_name)[0]

        cur = db_conn.cursor(cursor_factory=RealDictCursor)

        # Check if the document has already been processed
        cur.execute(
            """
            SELECT id FROM "FilContent" 
            WHERE fil_id = %s
            LIMIT 1
        """,
            (int(file_id),),
        )

        if cur.fetchone():
            print(f"Skipping {file_name} as it has already been processed")
            return

        with open(file_path, "r", encoding="utf-8") as f:
            text_content = f.read()

        main_content = extract_main_content(text_content)

        # For simplicity, we'll assume no chunking here.
        chunks = [main_content]

        for i, chunk in enumerate(chunks):
            # Call FastAPI service to process the document and generate embedding
            async with session.post(
                "http://localhost:8000/process_document",
                json={"content": chunk, "file_id": file_id},
            ) as response:
                result = await response.json()

            if result["status"] == "success":
                # Get the latest version for this file
                cur.execute(
                    """
                    SELECT MAX(version) as max_version
                    FROM "FilContent"
                    WHERE fil_id = %s
                """,
                    (int(file_id),),
                )
                latest_version = (cur.fetchone()["max_version"] or 0) + 1

                # Store in database
                cur.execute(
                    """
                    INSERT INTO "FilContent" (fil_id, content, embedding, extracted_at, version, chunk_index)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """,
                    (
                        int(file_id),
                        chunk,
                        json.dumps(result["embedding"]),
                        datetime.now().isoformat(),
                        latest_version,
                        i,
                    ),
                )

                db_conn.commit()

                print(
                    f"Processed and stored embedding for {file_name} (chunk {i+1}/{len(chunks)}, version {latest_version})"
                )
            else:
                raise Exception(f"Failed to process document: {result.get('error')}")

    except Exception as e:
        print(f"Error processing {file_path}:", str(e))
    finally:
        cur.close()


async def process_documents(directory):
    conn = get_db_connection()

    async with aiohttp.ClientSession() as session:
        tasks = []
        for root, _, files in os.walk(directory):
            for file in files:
                if file.endswith(".html"):
                    file_path = os.path.join(root, file)
                    task = asyncio.create_task(
                        process_document(session, file_path, conn)
                    )
                    tasks.append(task)

        await asyncio.gather(*tasks)

    conn.close()


if __name__ == "__main__":
    directory_to_process = "assets/data/html"
    asyncio.run(process_documents(directory_to_process))
