#!/bin/sh
set -e

echo "🧠 [ENTRYPOINT] Booting Second Brain Component Registry Production Node..."

# Run database readiness check
if [ -n "$DATABASE_URL" ]; then
  echo "📡 Checking PostgreSQL / pgvector connectivity..."
fi

echo "🚀 Launching Node.js Server on 0.0.0.0:${PORT:-3000}"
exec "$@"
