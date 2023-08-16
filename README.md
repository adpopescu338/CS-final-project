## CS

This is a repository for my Computer Science final project.
As a computer science student, I was often asked to install different databases on my computer, and it was often a hassle to do so.
This website is meant to be a simple and friction-less way to set-up a database in the cloud and use it for your projects.
Ideally I would use kubernetes to scale the databases, but I don't have money to pay for a kubernetes cluster, so I'll just use docker for now, and deploy the website on heroku or something.

I'll also use this readme as a notebook, so I remember what I did.

## Development
`yarn dev` will start both the server and the client in development mode.

## Mongo

docker pull mongo
docker run --name mongo-container -p 27017:27017 -it -e MONGO_INITDB_ROOT_USERNAME=<username> -e MONGO_INITDB_ROOT_PASSWORD=<password> mongo:latest

## Mysql

docker pull mysql
docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=<password> -p 3306:3306 mysql:latest

## Postgres

docker pull postgres
docker run --name postgres-container -e POSTGRES_PASSWORD=<password> -p 5432:5432 postgres:latest
