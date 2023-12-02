#!/bin/bash

# Initialize variables
LOCAL_MODE=1

echo "Starting local deployment script..."

# Load and export environment variables from a local environment file
echo "Using local environment file."
set -a # automatically export all variables
source ".env"
set +a
echo "Environment variables loaded from file."

# Run docker-compose for local services
echo "Starting local services..."
docker-compose up postgres mongodb mysql

echo "Local deployment script completed."
