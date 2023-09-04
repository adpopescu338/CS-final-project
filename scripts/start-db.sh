# this will start mongo db in kubernetes cluster, accessible at mongodb://127.0.0.1:27017
minikube start
kubectl create secret generic mongo-secret \
--from-literal=MONGO_INITDB_ROOT_PASSWORD=password \
--from-literal=MONGO_INITDB_ROOT_USERNAME=alex_admin


kubectl apply -f deployment/mongo-pvc.yaml
kubectl apply -f deployment/mongo-service.yaml
kubectl apply -f deployment/mongo-deployment.yaml

echo "Waiting for mongo to start..."
sleep 10

echo "You can connect to mongo using:"
echo "mongodb://alex_admin:password@127.0.0.1:27017"
echo "If it's not in your .env file, you can add it there now."

minikube tunnel