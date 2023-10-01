#!/bin/sh

# Define passwords and username
MONGO_PASSWORD="mongo_password"
MONGO_USERNAME="alex_admin"
MYSQL_PASSWORD="mysql_password"
POSTGRES_PASSWORD="postgres_password"

minikube start

kubectl create secret generic apps-secrets \
--from-literal=MONGO_PASSWORD=$MONGO_PASSWORD \
--from-literal=MONGO_USERNAME=$MONGO_USERNAME \
--from-literal=MYSQL_PASSWORD=$MYSQL_PASSWORD \
--from-literal=POSTGRES_PASSWORD=$POSTGRES_PASSWORD

kubectl apply -f deployment/postgres

echo "Waiting for databases to start..."
sleep 30

echo "You can connect to postgres using: postgres://postgres:$POSTGRES_PASSWORD@localhost:5432"

minikube tunnel