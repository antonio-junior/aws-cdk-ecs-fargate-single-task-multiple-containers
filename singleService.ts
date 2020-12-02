import { Vpc, SecurityGroup, Peer, Port} from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage, FargateTaskDefinition, Protocol, FargateService } from '@aws-cdk/aws-ecs';
import { Stack, App, StackProps } from '@aws-cdk/core';
import dotenv from 'dotenv';

dotenv.config({
  path: '.env'
});

class MyNewFargateSingleService extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const { DB_USER, DB_PWD, DB_PORT, DB_NAME, PORT, SECRET_KEY } = process.env;

    const vpc = new Vpc(this, 'MyNewVpc', { maxAzs: 2 });
    const cluster = new Cluster(this, 'MyNewCluster', { vpc });

    const taskDefinition = new FargateTaskDefinition(this, 'MyNewTaskDef');
    const containerDB = taskDefinition.addContainer('db', {
        image: ContainerImage.fromRegistry("bitnami/postgresql:12"),
        memoryLimitMiB: 256,
        environment: {
            POSTGRES_DB: DB_NAME as string,
            POSTGRES_PASSWORD: DB_PWD as string,
            POSTGRES_USER: DB_USER as string
        },
    });
    containerDB.addPortMappings({
        containerPort: 5432,
        protocol: Protocol.TCP
    });
   
    const containerApp = taskDefinition.addContainer('web', {
      image: ContainerImage.fromRegistry("antoniocsjunior/easypoll-graphql"),
      memoryLimitMiB: 256,
      environment: {
        DB_HOST: 'localhost',
        DB_USER: DB_USER as string,
        DB_PWD: DB_PWD as string,
        DB_PORT: DB_PORT as string,
        DB_NAME: DB_NAME as string,
        PORT: PORT as string,
        SECRET_KEY: SECRET_KEY as string,
      }
    });
    containerApp.addPortMappings({
      containerPort: parseInt(PORT as string),
      protocol: Protocol.TCP
    });
    

    const securityGroup = new SecurityGroup(this, 'MyNewSG', {
      vpc,
      allowAllOutbound: true,
    });
    securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(parseInt(PORT as string)));
    securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(parseInt(DB_PORT as string)));

    new FargateService(this, "MyNewService", {
      cluster,
      taskDefinition,
      assignPublicIp: true,
      securityGroups: [securityGroup]
    });
  }
}

export default MyNewFargateSingleService;