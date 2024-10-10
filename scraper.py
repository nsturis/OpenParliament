import undetected_chromedriver as uc
from selenium.webdriver.chrome.options import Options
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import asyncio
import aiohttp
from bs4 import BeautifulSoup
import psycopg2
from psycopg2.extras import RealDictCursor

from dotenv import load_dotenv
import os

load_dotenv()


# Database connection function
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
    )


# Function to fetch documents from the database
def fetch_documents(sag_id, page=1, limit=1000):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    offset = (page - 1) * limit

    cur.execute(
        """
        SELECT f.* 
        FROM sagdokument sd
        JOIN dokument d ON sd.dokumentid = d.id
        JOIN fil f ON d.id = f.dokumentid
        WHERE sd.sagid = %s
        LIMIT %s OFFSET %s
    """,
        (sag_id, limit, offset),
    )

    documents = cur.fetchall()
    cur.close()
    conn.close()
    return documents


# Function to convert PDF URL to HTML URL
def convert_pdf_url_to_html_url(pdf_url):
    if "ripdf" in pdf_url:
        return pdf_url.replace(".pdf", ".htm")
    return pdf_url.replace(".pdf", "/index.htm")


# Function to extract main text from HTML content
def extract_main_text(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    for script in soup(["script", "style"]):
        script.decompose()
    text = soup.get_text()
    lines = (line.strip() for line in text.splitlines())
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    text = "\n".join(chunk for chunk in chunks if chunk)
    return text


# Asynchronous function to fetch content (PDF or HTML)
async def fetch_content(session, url):
    try:
        async with session.get(url, timeout=10) as response:
            if response.status != 200:
                return (
                    f"Failed to fetch content from {url}. Status: {response.status}",
                    None,
                    None,
                )

            content = await response.read()
            content_type = response.headers.get("Content-Type", "").lower()

            if "pdf" in content_type:
                return None, content, "pdf"
            elif "html" in content_type:
                text_content = extract_main_text(
                    content.decode("utf-8", errors="ignore")
                )
                return None, text_content, "html"
            else:
                return f"Unsupported content type: {content_type}", None, None
    except Exception as e:
        return str(e), None, None


# Asynchronous function to fetch both PDF and HTML content
async def fetch_both_contents(session, pdf_url):
    html_url = convert_pdf_url_to_html_url(pdf_url)
    pdf_task = fetch_content(session, pdf_url)
    html_task = fetch_content(session, html_url)
    return await asyncio.gather(pdf_task, html_task)


# Main scraping function
async def scrape_documents(sag_id):
    documents = fetch_documents(sag_id)

    # Create a base directory for this sag_id
    base_dir = f"assets/data/{sag_id}"
    os.makedirs(base_dir, exist_ok=True)

    async with aiohttp.ClientSession() as session:
        tasks = [fetch_both_contents(session, doc["filurl"]) for doc in documents]
        results = await asyncio.gather(*tasks)

    # Process and save the fetched content
    for doc, (
        (pdf_error, pdf_content, pdf_type),
        (html_error, html_content, html_type),
    ) in zip(documents, results):
        file_name = os.path.basename(doc["filurl"])
        base_name = os.path.splitext(file_name)[0]

        # Handle PDF content
        if pdf_error:
            print(f"Error fetching PDF content for {doc['filurl']}: {pdf_error}")
        elif pdf_type == "pdf":
            pdf_dir = os.path.join(base_dir, "pdf")
            os.makedirs(pdf_dir, exist_ok=True)
            pdf_path = os.path.join(pdf_dir, f"{base_name}.pdf")
            with open(pdf_path, "wb") as f:
                f.write(pdf_content)
            print(f"Saved PDF: {pdf_path}")
        else:
            print(f"Unexpected content type for PDF: {pdf_type}")

        # Handle HTML content
        if html_error:
            print(f"Error fetching HTML content for {doc['filurl']}: {html_error}")
        elif html_type == "html":
            html_dir = os.path.join(base_dir, "html")
            os.makedirs(html_dir, exist_ok=True)
            html_path = os.path.join(html_dir, f"{base_name}.html")
            with open(html_path, "w", encoding="utf-8") as f:
                f.write(html_content)
            print(f"Saved HTML: {html_path}")
        else:
            print(f"Unexpected content type for HTML: {html_type}")


# Run the scraper
if __name__ == "__main__":
    # Query the database to get all sager in periode 20231
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

    # Scrape documents for the first ten sag_ids
    for sag_id in sag_ids[10:]:
        print(f"Scraping documents for sag_id: {sag_id}")
        asyncio.run(scrape_documents(sag_id))

    print("Scraping completed for the all sager in perioder betwen 2015 and 2024")


# # Function to fetch documents for multiple sag ids
# def fetch_documents_for_sags(sag_ids):
#     conn = get_db_connection()
#     cur = conn.cursor(cursor_factory=RealDictCursor)

#     placeholders = ",".join(["%s"] * len(sag_ids))
#     cur.execute(
#         f"""
#         SELECT f.id AS fil_id, f.filurl
#         FROM sagdokument sd
#         JOIN dokument d ON sd.dokumentid = d.id
#         JOIN fil f ON d.id = f.dokumentid
#         WHERE sd.sagid IN ({placeholders})
#     """,
#         tuple(sag_ids),
#     )

#     documents = cur.fetchall()
#     cur.close()
#     conn.close()
#     return documents


# # Function to create a document list file
# def create_document_list_file(sag_ids, output_file="document_list.txt"):
#     documents = fetch_documents_for_sags(sag_ids)

#     with open(output_file, "w", encoding="utf-8") as f:
#         for doc in documents:
#             f.write(f"{doc['fil_id']},{doc['filurl']}\n")

#     print(f"Document list has been written to {output_file}")


# # Example usage
# if __name__ == "__main__":

#     # Fetch sagids for the specified periods
#     def fetch_sagids_for_periods(periods):
#         conn = get_db_connection()
#         cur = conn.cursor(cursor_factory=RealDictCursor)

#         placeholders = ",".join(["%s"] * len(periods))
#         cur.execute(
#             f"""
#             SELECT DISTINCT sag.id
#             FROM sag
#             JOIN periode p ON sag.periodeid = p.id
#             WHERE p.kode IN ({placeholders})
#             ORDER BY sag.id
#             """,
#             tuple(periods),
#         )

#         sagids = [row["id"] for row in cur.fetchall()]
#         cur.close()
#         conn.close()
#         return sagids

#     # Specify the periods
#     periods = ["20222", "20231"]

#     # Fetch sagids for the specified periods
#     sag_ids = fetch_sagids_for_periods(periods)

#     print(f"Found {len(sag_ids)} sag IDs for periods {', '.join(periods)}")
#     create_document_list_file(sag_ids)
