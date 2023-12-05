#!/bin/bash

# Parse command-line arguments
LOCAL_MODE=0

while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --local)
            LOCAL_MODE=1
            echo "Local mode activated."
            shift # past argument
            ;;
        *)
            shift # past argument
            ;;
    esac
done

echo "Starting deployment script..."

# Load and export environment variables from AWS Parameter Store...
echo "Fetching environment variables from AWS Parameter Store..."
# Fetching all parameters
while IFS='=' read -r name value; do
    echo "Setting env $name to $value"
    export "$name"="$value"
done < <(aws ssm get-parameters-by-path --path "/" --recursive --with-decryption --query 'Parameters[*].[Name,Value]' --output json | jq -r '.[] | .[0] + "=" + .[1]')
if [ $? -ne 0 ]; then
    echo "AWS CLI exited with code $?"
    exit 1
fi
echo "Environment variables loaded from AWS Parameter Store."

# Override PUBLIC_DNS if in local mode
if [ "$LOCAL_MODE" -eq 1 ]; then
    PUBLIC_DNS="127.0.0.1"
    echo "Overriding PUBLIC_DNS with 127.0.0.1 for local mode."
fi

# Set PUBLIC_URL and DATABASE_URL based on the retrieved or overridden public DNS
echo "Setting PUBLIC_URL and NEXT_PUBLIC_URL to ${PUBLIC_DNS}"
export PUBLIC_URL="${PUBLIC_DNS}"
export NEXT_PUBLIC_URL="${PUBLIC_DNS}"

DATABASE_URL="postgres://postgres:${POSTGRES_PASSWORD}@postgres:5432"
echo "Setting DATABASE_URL to ${DATABASE_URL}"
export DATABASE_URL="${DATABASE_URL}"
export NODE_ENV="production"

# Run docker-compose
echo "Running docker-compose"
docker-compose up --build

echo "Script completed."
