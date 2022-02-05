import { Vpc, SecurityGroup, Peer, Port} from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage, FargateTaskDefinition, Protocol, FargateService } from '@aws-cdk/aws-ecs';
import { Stack, App, StackProps, Duration} from '@aws-cdk/core';
import { ApplicationLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2';
import { Mesh } from '@aws-cdk/aws-appmesh';

import dotenv from 'dotenv';

dotenv.config({
  path: '.env'
});

class MyNewFargateMultiService extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const { DB_USER, DB_PWD, DB_PORT, DB_NAME, PORT, SECRET_KEY } = process.env;

    // Network Objects
    const vpc = new Vpc(this, 'MyNewVpc', { maxAzs: 2 });
    const cluster = new Cluster(this, 'MyNewCluster', { vpc });
    const mesh = new Mesh(this, 'AppMesh', {
      meshName: 'myAwsmMesh',
    });

    // Database Container
    const taskDefinitionDB = new FargateTaskDefinition(this, 'MyNewTaskDefDB');
    const containerDB = taskDefinitionDB.addContainer('db', {
        image: ContainerImage.fromRegistry("bitnami/postgresql:12"),
        memoryLimitMiB: 256,
        environment: {
            POSTGRES_DB: DB_NAME as string,
            POSTGRES_PASSWORD: DB_PWD as string,
            POSTGRES_USER: DB_USER as string
        }
    });
    containerDB.addPortMappings({
        containerPort: 5432,
        protocol: Protocol.TCP
    });
    const securityGroupDB = new SecurityGroup(this, 'MyNewSGDB', {
      vpc,
      allowAllOutbound: true,
    });
    securityGroupDB.addIngressRule(Peer.anyIpv4(), Port.tcp(parseInt(DB_PORT as string)));

    const fargateServiceDB = new FargateService(this, "MyNewServiceDB", {
      cluster,
      taskDefinition: taskDefinitionDB,
      securityGroups: [securityGroupDB]
    });

    // Application API Container
    const taskDefinitionWeb = new FargateTaskDefinition(this, 'MyNewTaskDefWeb');
    const containerApp = taskDefinitionWeb.addContainer('web', {
      image: ContainerImage.fromRegistry("antoniocsjunior/easypoll-graphql"),
      memoryLimitMiB: 256,
      environment: {
        DB_HOST: lbDB.loadBalancerDnsName,
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

    const securityGroupWeb = new SecurityGroup(this, 'MyNewSG', {
      vpc,
      allowAllOutbound: true,
    });
    securityGroupWeb.addIngressRule(Peer.anyIpv4(), Port.tcp(parseInt(PORT as string)));

    const fargateServiceWeb = new FargateService(this, "MyNewService", {
      cluster,
      taskDefinition: taskDefinitionWeb,
      securityGroups: [securityGroupWeb]
    });
    
    const scaling = fargateServiceWeb.autoScaleTaskCount({ maxCapacity: 2 });
    scaling.scaleOnCpuUtilization('MyNewCpuScaling', {
      targetUtilizationPercent: 80,
      scaleInCooldown: Duration.seconds(60),
      scaleOutCooldown: Duration.seconds(60)
    });

    const lb = new ApplicationLoadBalancer(this, 'MyNewLoadBalancerWeb', {
      vpc,
      internetFacing: true
    });
    const listener = lb.addListener('MyNewPublicListenerWeb', { port: 80, open: true });

    listener.addTargets('MyECSTargetsWeb', {
      port: 80,
      targets: [
        fargateServiceWeb.loadBalancerTarget({
          containerName: 'web',
          containerPort: parseInt(PORT as string),
        })
      ]
    });   
  }
}

export default MyNewFargateMultiService;