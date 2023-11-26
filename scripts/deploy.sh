#!/bin/bash

# Initialize variables
ENV_FILE=".TEMP_ENV_FILE"
LOCAL_MODE=0
DECRYPTION_KEY=""

echo "Starting script..."

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --local)
            LOCAL_MODE=1
            ENV_FILE=".env.local"
            echo "Local mode activated."
            shift # past argument
            ;;
        --password)
            shift # past argument
            DECRYPTION_KEY="$1"
            echo "Decryption key provided."
            shift # past value
            ;;
        *)
            shift # past argument
            ;;
    esac
done

# Check if --password is provided when not in local mode
if [ "$LOCAL_MODE" -eq 0 ] && [ -z "$DECRYPTION_KEY" ]; then
    echo "Missing --password argument"
    exit 1
fi

# Decrypt .env.gpg to a variable or use .env.local
if [ -n "$DECRYPTION_KEY" ]; then
    echo "Decrypting environment variables..."
    DECRYPTED_ENV=$(gpg --decrypt --batch --passphrase "$DECRYPTION_KEY" .env.gpg 2> /dev/null)
    if [ $? -ne 0 ]; then
        echo "gpg exited with code $?"
        exit 1
    fi
    echo "Environment variables decrypted."
else
    echo "Using local environment file."
    DECRYPTED_ENV=$(cat "$ENV_FILE")
    echo "Environment variables loaded."
fi

# Export environment variables
echo "Setting environment variables..."
while IFS='=' read -r name value ; do
    if [[ $name && $name != "#"* ]]; then
        export "$name=$value"
        echo "Set $name=$value"
    fi
done <<< "$DECRYPTED_ENV"
echo "Environment variables set."

# Run docker-compose
echo "Running docker-compose..."
if [ "$LOCAL_MODE" -eq 1 ]; then
    docker-compose up postgres mongodb mysql
else
    docker-compose up
fi

echo "Script completed."
