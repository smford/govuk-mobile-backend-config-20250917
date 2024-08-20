import {Env} from './environment';

export enum Platform {
  ios = 'ios',
  android = 'android',
}

export type ConfigOutput = {
  [key: string]: Env;
};
