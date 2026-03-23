#!/bin/sh
# ═══════════════════════════════════════════════════════════════════════════════
# RUNTIME ENV INJECTION
# ═══════════════════════════════════════════════════════════════════════════════
#
# Injects environment variables into the built index.html at container startup.
# This allows API keys to be set as runtime environment variables in AWS
# ECS/Fargate/App Runner/Elastic Beanstalk without rebuilding the Docker image.
#
# Variables injected: VITE_AWS_ENVIRONMENT, VITE_AWS_REGION,
#                     VITE_API_BASE_URL
#
# SECURITY WARNING: Variables injected here are publicly visible in the browser.
# Do NOT expose secret server-side credentials via this mechanism.
# ═══════════════════════════════════════════════════════════════════════════════

INDEX_FILE="./dist/index.html"

echo "[env-inject] Starting env injection..."
echo "[env-inject] Working directory: $(pwd)"
echo "[env-inject] Looking for: $INDEX_FILE"

# If index.html doesn't exist, warn loudly and exit non-zero so the issue is visible in logs.
if [ ! -f "$INDEX_FILE" ]; then
  echo "[env-inject] ERROR: $INDEX_FILE not found."
  echo "[env-inject] Contents of ./dist (if it exists):"
  ls -la ./dist 2>/dev/null || echo "[env-inject]   ./dist directory does not exist"
  echo "[env-inject] Skipping env injection — server will still start but frontend may not be served correctly."
  exit 0
fi

echo "[env-inject] Found $INDEX_FILE ($(wc -c < "$INDEX_FILE") bytes)"

# --- Build the window.__ENV__ JSON object from available environment variables ---
JSON_CONTENT=""

if [ -n "$VITE_AWS_ENVIRONMENT" ]; then
  JSON_CONTENT="${JSON_CONTENT}\"VITE_AWS_ENVIRONMENT\":\"${VITE_AWS_ENVIRONMENT}\","
fi

if [ -n "$VITE_AWS_REGION" ]; then
  JSON_CONTENT="${JSON_CONTENT}\"VITE_AWS_REGION\":\"${VITE_AWS_REGION}\","
fi

if [ -n "$VITE_API_BASE_URL" ]; then
  JSON_CONTENT="${JSON_CONTENT}\"VITE_API_BASE_URL\":\"${VITE_API_BASE_URL}\","
fi

# If nothing to inject, exit early.
if [ -z "$JSON_CONTENT" ]; then
  echo "[env-inject] No environment variables to inject. Skipping."
  exit 0
fi

# Remove trailing comma and wrap in braces.
JSON_CONTENT=$(echo "$JSON_CONTENT" | sed 's/,$//')
ENV_JSON="{${JSON_CONTENT}}"
ENV_SCRIPT="<script>window.__ENV__=${ENV_JSON};</script>"

# Inject the script tag right before the closing </head> tag.
sed -i "s|</head>|${ENV_SCRIPT}</head>|" "$INDEX_FILE"

echo "[env-inject] Runtime environment successfully injected into index.html."
