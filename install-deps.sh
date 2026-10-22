#!/bin/bash

# Find all directories containing package.json
find . -name "package.json" -not -path "**/node_modules/*" -exec dirname {} \; | while read dir; do
    echo "Installing dependencies in $dir"
    cd "$dir"
    pnpm install
    cd - > /dev/null
done
