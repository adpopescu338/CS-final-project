#!/bin/bash

# Define the EC2 instance name
INSTANCE_NAME="small-instance"

# Initialize variables
LOCAL_MODE=0
PUBLIC_DNS=""

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

# Fetch the EC2 instance's public DNS name if not running locally
if [ "$LOCAL_MODE" -ne 1 ]; then
    PUBLIC_DNS=$(aws ec2 describe-instances \
        --filters "Name=tag:Name,Values=$INSTANCE_NAME" "Name=instance-state-name,Values=running" \
        --query 'Reservations[].Instances[].PublicDnsName' \
        --output text)
    
    if [ -z "$PUBLIC_DNS" ]; then
        echo "Failed to retrieve the EC2 instance's public DNS name."
        exit 1
    fi
    echo "EC2 instance's public DNS: $PUBLIC_DNS"
else
    echo "Local mode activated. Skipping EC2 dns retrieval."
fi

# Set PUBLIC_URL and DATABASE_URL based on the retrieved public DNS
echo "Setting PUBLIC_URL to http://${PUBLIC_DNS}"
export PUBLIC_URL="http://${PUBLIC_DNS}"
echo "Setting DATABASE_URL to postgres://postgres:${POSTGRES_PASSWORD}@${PUBLIC_DNS}:5432"§
export DATABASE_URL="postgres://postgres:${POSTGRES_PASSWORD}@${PUBLIC_DNS}:5432"

# Run docker-compose
echo "Running docker-compose for databases"
if [ "$LOCAL_MODE" -eq 1 ]; then
    echo "Starting local services..."
    docker-compose up postgres mongodb mysql
else
    echo "Starting all services..."
    docker-compose up
fi

echo "Script completed."
