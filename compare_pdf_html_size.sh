#!/bin/bash

# Base directory containing the 10 subfolders
BASE_DIR="assets/data/"

# Initialize variables to store total sizes
total_pdf_size=0
total_html_size=0

# Function to get file size in bytes
get_file_size() {
    stat -f%z "$1"
}

# Loop through the 10 subfolders
for folder in "$BASE_DIR"/*; do
    if [ -d "$folder" ]; then
        # echo "Analyzing folder: $folder"
        
        # Check PDF subfolder
        pdf_folder="$folder/pdf"
        if [ -d "$pdf_folder" ]; then
            for pdf_file in "$pdf_folder"/*.pdf; do
                if [ -f "$pdf_file" ]; then
                    pdf_size=$(get_file_size "$pdf_file")
                    total_pdf_size=$((total_pdf_size + pdf_size))
                    # echo "  PDF: $pdf_file - $(numfmt --to=iec-i --suffix=B $pdf_size)"
                fi
            done
        fi
        
        # Check HTML subfolder
        html_folder="$folder/html"
        if [ -d "$html_folder" ]; then
            for html_file in "$html_folder"/*.html; do
                if [ -f "$html_file" ]; then
                    html_size=$(get_file_size "$html_file")
                    total_html_size=$((total_html_size + html_size))
                    # echo "  HTML: $html_file - $(numfmt --to=iec-i --suffix=B $html_size)"
                fi
            done
        fi
        
        # echo ""
    fi
done

# Print total sizes
echo "Total PDF size: $(numfmt --to=iec-i --suffix=B $total_pdf_size)"
echo "Total HTML size: $(numfmt --to=iec-i --suffix=B $total_html_size)"

# Calculate and print the ratio
ratio=$(echo "scale=2; $total_pdf_size / $total_html_size" | bc)
echo "PDF to HTML size ratio: $ratio"