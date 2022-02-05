# aws-ecs-fargate-services-using-cdk
## Description 
This project uses AWS CDK for provisioning a cloud serverless infrastructure for my personal application [easypoll](https://github.com/antonio-junior/easypoll-graphql).

In [this past project](https://github.com/antonio-junior/serverless-project) I've used serverless framework for building another application and providing its serverless infrastructure. 

## What is the AWS CDK?
It is a software development framework for defining cloud infrastructure in code and provisioning it through AWS CloudFormation.

## Documentaion
https://docs.aws.amazon.com/cdk/latest/guide/home.html

## Application
The application consists of a GraphQL API using Node.js, Typescript and Oracle.  
The infrastructure was designed to work in containers using Amazon ECS. Amazon ECS is a fully managed container orchestrator service purpose-built for the cloud and integrated with other AWS services.  
In this repository, there are two different stack configurations: single service and multi-service.  
Using the single service configuration, the containers get together sharing all the networking settings. In this way, it is easier for the containers to communicate. Since they are in the same network, every resource is on 'localhost' in different ports. However, single service architecture is hard to scale because there might be unnecessary component duplication due to containers dependency.  
On the other hand, the multi-service configuration has some challenges. This is the way microservices architecture works. Since the services are on different sides of a network, they need an additional component to connect them, such AWS App Mesh. Service meshes are very powerful for environments with multiple services, but they are often notoriously hard to configure.

## Some steps

Install AWS CLI ([Link](
https://docs.aws.amazon.com/pt_br/cli/latest/userguide/cli-chap-install.html))

Configure AWS CLI
```
aws configure
```
Install cdk globally
```
npm install -g cdk
````

Set environment variables (create a .env file based on .env.example)

Deploy the application with containers in a single service
```
npm run deploy:single
```
or 

Deploy the application with containers in separated services
```
npm run deploy:multi
```

Undeploy application
```
npm run destroy
```