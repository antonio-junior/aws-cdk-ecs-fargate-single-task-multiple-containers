import MyNewFargateMultiService from './multiService';
import MyNewFargateSingleService from './singleService';
import { App } from '@aws-cdk/core';

const app = new App();

new MyNewFargateSingleService(app, 'MyNewAppSingleService');

new MyNewFargateMultiService(app, 'MyNewAppMultiService');