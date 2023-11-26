#!/bin/bash

# Default to .TEMP_ENV_FILE unless --local is passed
ENV_FILE=".TEMP_ENV_FILE"
LOCAL_MODE=0

# Parse command-line arguments
for arg in "$@"; do
    if [ "$arg" == "--local" ]; then
        LOCAL_MODE=1
        ENV_FILE=".env.local"
    elif [ "$arg" == "--password" ]; then
        read next_arg
        DECRYPTION_KEY="$next_arg"
    fi
done

# Check if --password is provided when not in local mode
if [ "$LOCAL_MODE" -eq 0 ] && [ -z "$DECRYPTION_KEY" ]; then
    echo "Missing --password argument"
    exit 1
fi

# Decrypt .env.gpg to .env or .env.local
if [ -n "$DECRYPTION_KEY" ]; then
    gpg --decrypt --batch --passphrase "$DECRYPTION_KEY" .env.gpg > "$ENV_FILE" 2> /dev/null
    if [ $? -ne 0 ]; then
        echo "gpg exited with code $?"
        exit 1
    fi
fi

# Load environment variables from the file
export $(grep -v '^#' "$ENV_FILE" | xargs)

# Check mandatory environment variables
MISSING_VARS=()
for var in MONGO_USERNAME MONGO_PASSWORD MYSQL_PASSWORD POSTGRES_PASSWORD; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo "Missing environment variables: ${MISSING_VARS[*]}"
    exit 1
fi

# Run docker-compose
if [ "$LOCAL_MODE" -eq 1 ]; then
    docker-compose up postgres mongodb mysql
else
    docker-compose up
fi

# Remove temp env file if not in local mode
if [ "$LOCAL_MODE" -eq 0 ]; then
    rm -f "$ENV_FILE"
fi
