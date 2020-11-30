# aws-ecs-fargate-services-using-cdk
## Description 
This project uses AWS CDK for provisioning a cloud serverless infrastructure for my personal application [easypoll](https://github.com/antonio-junior/easypoll-graphql).

In [this past project](https://github.com/antonio-junior/serverless-project) I've used serverless framework for building another application and providing its serverless infrastructure. 

## What is the AWS CDK?
It is a software development framework for defining cloud infrastructure in code and provisioning it through AWS CloudFormation.

## Documentaion
https://docs.aws.amazon.com/cdk/latest/guide/home.html

## Application
The application consists in a GraphQL API using Node.js, Typescript and Oracle.  
The infrastructure was designed to work in containers using Amazon ECS. Amazon ECS is a fully managed container orchestrator service purpose-built for the cloud and integrated with other AWS services. 

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

Set environment variables (.env file)

Deploy the application
```
npm run deploy
```