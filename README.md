# Spring Microservices Shop

## Prerequisites

Before running this project, please ensure you have installed the following:

- **[Docker](https://www.docker.com/get-started)**  
  Required to run containerized services.

- **[Node.js](https://nodejs.org/en/)**  
  Needed to build the frontend (Angular) part of the project.

- **[Maven](https://maven.apache.org/)**  
  To build the Spring Boot microservices.


## Running the Project

### Running on your machine

You need to have docker personal token with you. To get that you need to go to your docker hub account -> account settings -> personal token and generate personal token for this project to run. Paste it whenever you are running a mvn command, like:

```bash
mvn clean package -DskipTest -DdockerPassword={YourDockerToken}
```

Ensure Docker is running on your machine. Then, open the terminal inside folder springboot-microservices and run command:

```bash
docker compose up -d
```

If everything is ok, you can test with going through links.


### Running on kubernetes

If you have installed [Kubernetes (kind)](https://kind.sigs.k8s.io/) and want to run services in kubernetes, you need to create a cluster while docker is running. It is stored in **.sh** file inside **k8s/kind/create-kind-cluster.sh** file. You need to run it with:


```bash
chmod +x create-kind-cluster.sh
```
Then:

```bash
./create-kind-cluster.sh
```

This will create kind microservices cluster in docker as a container.

You need to dockerize the each service inside microservices, therefore run this mvn command and proceed to the next command:

```bash
mvn spring-boot:build-image -DskipTests -Ddocker.publish=true -DdockerPassword={YourDockerToken}
```

The above command will push your services as a container into your docker application. But I had problem to publicly post these services into my public repositories. If you have this kind of problem also, proceed to the next command, if not it is all good.

```bash
docker tag product-service:0.0.1-SNAPSHOT {yourDockerUsername}/product-service:0.0.1-SNAPSHOT
```

And so on, with order-service, inventory-service, notification-service and api-gateway.

Then you need to push them:

```bash
docker push {yourDockerUsername}/product-service:0.0.1-SNAPSHOT
```

And so on, with order-service, inventory-service, notification-service and api-gateway.

Then, you should put the line of code inside **frontend/src/app/config/auth.config.ts**, which is already inside it. You should replace the link in **authority** with the link commented down below, if you want to run the project with kubernetes.
You have to build **frontend** service in docker with command inside frontend service folder:

```bash
docker build -t frontend .
```

After that you have tag it and push it into docker repositories.

Open terminal inside **k8s/manifests** then run commands:

```bash
kubectl apply -f infrastructure
```

```bash
kubectl apply -f applications
```

Check the pods if the pods are running state with

```bash
kubectl get pods
```

or check services

```bash
kubectl get svc
```

If everything is working ok, then you can **port-forward** these services:

```bash
kubectl port-forward svc/frontend 4200:80
kubectl port-forward svc/api-gateway 9000:9000
kubectl port-forward svc/grafana 3000:3000
kubectl port-forward svc/keycloak 8080:8080
```

You can now start testing.

## Architecture

This project is structured as a set of loosely coupled microservices. The key components include:

- **API Gateway**  
  Handles routing, request aggregation, and authentication for incoming client requests.

- **Product Service**  
  Manages the product catalog, including product details and availability.

- **Order Service**  
  Processes orders, handles payments, and manages order lifecycle events.

- **Inventory Service**  
  Tracks product inventory levels to ensure accurate stock information.

- **Notification Service**  
  Sends email and in-app notifications to users regarding order statuses and promotions.

- **Frontend**  
  A modern Angular-based UI that interacts with the backend services through the API Gateway.

- **Keycloak**  
  Provides authentication and authorization, ensuring secure access to services.

- **Messaging System (Kafka, Zookeeper)**  
  Enables asynchronous communication between services via events and messages.

- **Databases (MySQL, MongoDB)**  
  MySQL is used for relational data and MongoDB for document-based storage.

- **Monitoring & Tracing (Prometheus, Grafana, Tempo, Loki)**  
  These tools are used for logging, monitoring, and tracing the health and performance of the services.


#
#
If you have some problems, feel free to contact me 
dryden1309@gmail.com
