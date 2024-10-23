import os
import fitz  # PyMuPDF for PDF processing
from bs4 import BeautifulSoup
import difflib
import hashlib
from PIL import Image
import io


def extract_pdf_content(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    images = []
    for page in doc:
        text += page.get_text()
        for img in page.get_images():
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            images.append(image_bytes)
    return text, images


def extract_html_content(html_path):
    with open(html_path, "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "html.parser")
    text = soup.get_text()
    images = [img["src"] for img in soup.find_all("img")]
    return text, images


def compare_text(pdf_text, html_text):
    diff = difflib.unified_diff(
        pdf_text.splitlines(), html_text.splitlines(), lineterm=""
    )
    return list(diff)


def compare_images(pdf_images, html_images):
    pdf_hashes = [hashlib.md5(img).hexdigest() for img in pdf_images]
    html_hashes = []
    for img_src in html_images:
        try:
            with open(img_src, "rb") as img_file:
                img_data = img_file.read()
                html_hashes.append(hashlib.md5(img_data).hexdigest())
        except FileNotFoundError:
            print(f"Image not found: {img_src}")

    missing_in_html = set(pdf_hashes) - set(html_hashes)
    missing_in_pdf = set(html_hashes) - set(pdf_hashes)
    return missing_in_html, missing_in_pdf


def analyze_differences(pdf_path, html_path):
    pdf_text, pdf_images = extract_pdf_content(pdf_path)
    html_text, html_images = extract_html_content(html_path)

    text_diff = compare_text(pdf_text, html_text)
    missing_images_in_html, missing_images_in_pdf = compare_images(
        pdf_images, html_images
    )

    return {
        "text_differences": text_diff,
        "missing_images_in_html": len(missing_images_in_html),
        "missing_images_in_pdf": len(missing_images_in_pdf),
    }


# Usage
base_dir = "assets/data/sagDocuments"
results = []

for sag_id in os.listdir(base_dir):
    sag_path = os.path.join(base_dir, sag_id)
    if os.path.isdir(sag_path):
        pdf_dir = os.path.join(sag_path, "pdf")
        html_dir = os.path.join(sag_path, "html")

        for filename in os.listdir(pdf_dir):
            if filename.endswith(".pdf"):
                pdf_path = os.path.join(pdf_dir, filename)
                html_path = os.path.join(html_dir, filename.replace(".pdf", ".html"))

                if os.path.exists(html_path):
                    diff_result = analyze_differences(pdf_path, html_path)
                    results.append(
                        {
                            "sag_id": sag_id,
                            "filename": filename,
                            "differences": diff_result,
                        }
                    )

# Analyze and report results
for result in results:
    print(f"Sag ID: {result['sag_id']}, File: {result['filename']}")
    print(f"Text differences: {len(result['differences']['text_differences'])} lines")
    print(f"Missing images in HTML: {result['differences']['missing_images_in_html']}")
    print(f"Missing images in PDF: {result['differences']['missing_images_in_pdf']}")
    print("---")

# Calculate overall statistics
total_files = len(results)
files_with_differences = sum(
    1 for r in results if len(r["differences"]["text_differences"]) > 0
)
files_with_missing_images = sum(
    1 for r in results if r["differences"]["missing_images_in_html"] > 0
)

print(f"Total files analyzed: {total_files}")
print(
    f"Files with text differences: {files_with_differences} ({files_with_differences/total_files*100:.2f}%)"
)
print(
    f"Files with missing images in HTML: {files_with_missing_images} ({files_with_missing_images/total_files*100:.2f}%)"
)
