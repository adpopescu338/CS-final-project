#!/bin/bash

# Initialize variables
LOCAL_MODE=0

echo "Starting script..."

# Parse command-line arguments
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

# Load and export environment variables
if [ "$LOCAL_MODE" -eq 1 ]; then
    echo "Using local environment file."
    set -a # automatically export all variables
    source ".env"
    set +a
    echo "Environment variables loaded from file."
else
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
fi

# Run docker-compose
echo "Running docker-compose..."
if [ "$LOCAL_MODE" -eq 1 ]; then
    echo "Starting local services..."
    docker-compose up postgres mongodb mysql
else
    echo "Starting all services..."
    docker-compose up
fi


echo "Script completed."
