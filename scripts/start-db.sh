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

kubectl apply -f deployment/mongo
kubectl apply -f deployment/mysql
kubectl apply -f deployment/postgres

echo "Waiting for databases to start..."
sleep 20

echo "You can connect to mongo using: mongodb://$MONGO_USERNAME:$MONGO_PASSWORD@127.0.0.1:27017"
echo "You can connect to mysql using: mysql://root:$MYSQL_PASSWORD@127.0.0.1:3306"
echo "You can connect to postgres using: postgres://postgres:$POSTGRES_PASSWORD@localhost:5432"

minikube tunnel
