#!/bin/sh

# Input and output files
INPUT="references.html"
OUTPUT="references_sorted.html"

# Extract <p> lines, sort by author and year, and write to output
grep '<p id="ref_' "$INPUT" | \
  sort -t '[' -k2,2 -k3,3n | \
  sed '1i<!DOCTYPE html>\n<html>\n<body>' | \
  sed '$a</body>\n</html>' > "$OUTPUT"

echo "Sorted references saved to $OUTPUT"
