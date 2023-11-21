#!/bin/bash

# Get the list of environment variable keys from AWS SSM
env_variable_keys=$(aws ssm describe-parameters --query "Parameters[*].Name" | jq -r '.[]')

# Check for errors
if [ $? -ne 0 ]; then
    echo "Error fetching environment variable keys"
    exit 1
fi

# Initialize arrays for keys and values
keys=()
values=()

# Fetch each environment variable from AWS SSM
for key in $env_variable_keys; do
    value=$(aws ssm get-parameter --name "$key" --with-decryption --query "Parameter.Value" | jq -r '.')

    # Check for errors
    if [ $? -ne 0 ]; then
        echo "Error fetching value for key $key"
        exit 1
    fi

    keys+=("$key")
    values+=("$value")
done

# Add DATABASE_URL
keys+=("DATABASE_URL")
values+=("postgres://postgres:${values[keys[POSTGRES_PASSWORD]]}@postgres:5432")

# Write the environment variables to the .env file
for i in "${!keys[@]}"; do
    echo "${keys[$i]}=${values[$i]}" >> .env
done

# Run docker-compose up
docker-compose up
