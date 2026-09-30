#!/bin/bash

set -euo pipefail

issues=$(gh issue list --state open --limit 1000 \
  --json number,title --jq '.[] | "#\(.number): \(.title)"')

commits=$(git log -n 5 --format="%H%n%ad%n%B---" --date=short 2>/dev/null || echo "No commits found")
prompt=$(cat ralph/prompt.md)

opencode run --auto \
  "Previous commits: $commits Issues: $issues $prompt"
