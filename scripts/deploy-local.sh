#!/bin/bash

# Parse command-line arguments
LOCAL_MODE=0

echo "Starting deployment script..."

# Load and export environment variables from .env file

echo "Using local environment file."
set -a # automatically export all variables
source ".env"
set +a
echo "Environment variables loaded from file."


PUBLIC_DNS="127.0.0.1"
echo "Overriding PUBLIC_DNS with 127.0.0.1 for local mode."

# Set PUBLIC_URL and DATABASE_URL based on the retrieved or overridden public DNS
echo "Setting PUBLIC_URL and NEXT_PUBLIC_URL to ${PUBLIC_DNS}"
export PUBLIC_URL="${PUBLIC_DNS}"
export NEXT_PUBLIC_URL="${PUBLIC_DNS}"

DATABASE_URL="postgres://postgres:${POSTGRES_PASSWORD}@postgres:5432"
echo "Setting DATABASE_URL to ${DATABASE_URL}"
export DATABASE_URL="${DATABASE_URL}"

export NODE_ENV="development"
export DISABLE_EMAILS="true"

# Run docker-compose
echo "Running docker-compose for databases"
docker-compose up --build

echo "Script completed."
