#!/bin/sh
# ═══════════════════════════════════════════════════════════════════════════════
# RUNTIME ENV INJECTION
# ═══════════════════════════════════════════════════════════════════════════════
#
# This script injects environment variables into the built index.html at
# container startup. This allows API keys to be set as runtime environment
# variables in AWS ECS/Fargate/App Runner/Elastic Beanstalk without needing
# to rebuild the Docker image.
#
# Usage: Set GEMINI_API_KEY as an environment variable in your AWS service
# configuration (ECS task definition, App Runner env vars, etc.)
#
# The script adds a <script> tag to index.html that sets window.__ENV__
# which is picked up by getGeminiApiKey() in awsBedrockService.ts
# ═══════════════════════════════════════════════════════════════════════════════

INDEX_FILE="./dist/index.html"

if [ -f "$INDEX_FILE" ]; then
  # Build the __ENV__ object from available environment variables
  ENV_JSON="{"
  
  if [ -n "$GEMINI_API_KEY" ]; then
    ENV_JSON="${ENV_JSON}\"GEMINI_API_KEY\":\"${GEMINI_API_KEY}\","
    ENV_JSON="${ENV_JSON}\"VITE_GEMINI_API_KEY\":\"${GEMINI_API_KEY}\","
  fi
  
  if [ -n "$VITE_GEMINI_API_KEY" ]; then
    ENV_JSON="${ENV_JSON}\"VITE_GEMINI_API_KEY\":\"${VITE_GEMINI_API_KEY}\","
  fi

  if [ -n "$VITE_AWS_ENVIRONMENT" ]; then
    ENV_JSON="${ENV_JSON}\"VITE_AWS_ENVIRONMENT\":\"${VITE_AWS_ENVIRONMENT}\","
  fi

  if [ -n "$VITE_AWS_REGION" ]; then
    ENV_JSON="${ENV_JSON}\"VITE_AWS_REGION\":\"${VITE_AWS_REGION}\","
  fi

  if [ -n "$VITE_API_BASE_URL" ]; then
    ENV_JSON="${ENV_JSON}\"VITE_API_BASE_URL\":\"${VITE_API_BASE_URL}\","
  fi

  # Remove trailing comma and close object
  ENV_JSON=$(echo "$ENV_JSON" | sed 's/,$//')
  ENV_JSON="${ENV_JSON}}"

  # Inject script tag before </head>
  ENV_SCRIPT="<script>window.__ENV__=${ENV_JSON};<\/script>"
  sed -i "s|</head>|${ENV_SCRIPT}</head>|" "$INDEX_FILE"
  
  echo "[env-inject] Runtime environment injected into index.html"
else
  echo "[env-inject] Warning: $INDEX_FILE not found, skipping env injection"
fi
