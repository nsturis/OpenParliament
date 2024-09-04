#!/bin/bash

# Check if input file is provided
if [ $# -eq 0 ]; then
    echo "Please provide an input file"
    exit 1
fi

input_file=$1

# Function to extract main text from HTML
extract_main_text() {
    local html_content="$1"
    # Use sed to remove HTML tags and normalize whitespace
    echo "$html_content" | sed -e 's/<[^>]*>//g' | tr -s ' ' | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'
}

# Process each line in the input file
while IFS=',' read -r file_id file_url; do
    echo "Processing file ID: $file_id"
    
    # Convert PDF URL to HTML URL if necessary
    if [[ $file_url == *"ripdf"* ]]; then
        html_url="${file_url/.pdf/.htm}"
    else
        html_url="${file_url/.pdf//index.htm}"
    fi
    
    # Fetch HTML content
    html_content=$(curl -s -L -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3" "$html_url")
    
    # Extract main text
    main_text=$(extract_main_text "$html_content")
    
    # Save to file
    echo "$main_text" > "${file_id}_content.txt"
    
    echo "Saved content for file ID: $file_id"
done < "$input_file"

echo "Processing complete"