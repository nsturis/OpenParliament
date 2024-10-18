import os
import shutil
from pathlib import Path
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()


def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
    )


def fetch_documents(sag_id):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute(
        """
        SELECT f.* 
        FROM sagdokument sd
        JOIN dokument d ON sd.dokumentid = d.id
        JOIN fil f ON d.id = f.dokumentid
        WHERE sd.sagid = %s
    """,
        (sag_id,),
    )

    documents = cur.fetchall()
    cur.close()
    conn.close()
    return documents


def reorganize_files(sag_id):
    documents = fetch_documents(sag_id)
    base_dir = Path(f"assets/data/{sag_id}")

    for doc in documents:
        file_name = os.path.basename(doc["filurl"])
        base_name = os.path.splitext(file_name)[0]

        # Check for PDF
        pdf_path = base_dir / "pdf" / f"{base_name}.pdf"
        if pdf_path.exists():
            new_pdf_path = Path("assets/data/pdf") / f"{doc['id']}.pdf"
            new_pdf_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(pdf_path, new_pdf_path)
            print(f"Copied PDF: {pdf_path} -> {new_pdf_path}")

        # Check for HTML
        html_path = base_dir / "html" / f"{base_name}.html"
        if html_path.exists():
            new_html_path = Path("assets/data/html") / f"{doc['id']}.html"
            new_html_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(html_path, new_html_path)
            print(f"Copied HTML: {html_path} -> {new_html_path}")


def move_sag_folders_to_raw():
    assets_data_dir = Path("assets/data")
    raw_dir = assets_data_dir / "raw"
    raw_dir.mkdir(parents=True, exist_ok=True)

    for item in assets_data_dir.iterdir():
        if item.is_dir() and item.name.isdigit():
            new_location = raw_dir / item.name
            shutil.move(str(item), str(new_location))
            print(f"Moved folder: {item} -> {new_location}")


if __name__ == "__main__":
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute(
        """
        SELECT DISTINCT sag.id
        FROM sag
        JOIN periode p ON sag.periodeid = p.id
        WHERE p.id in (SELECT id FROM periode WHERE type = 'samling' and startdato < '2023-01-01'
        and slutdato > '2015-01-01')
        and sag.typeid in (2,3,5,9,10,11)
    """
    )

    sag_ids = [row["id"] for row in cur.fetchall()]
    cur.close()
    conn.close()

    for sag_id in sag_ids:
        print(f"Reorganizing files for sag_id: {sag_id}")
        reorganize_files(sag_id)

    print(
        "File reorganization completed for all sager in perioder between 2015 and 2024"
    )

    # Move all sag_id folders to 'raw' folder
    move_sag_folders_to_raw()
    print("All sag_id folders have been moved to the 'raw' folder")
