import {Env} from './environment';

export type Platform = 'ios' | 'android';

export type ConfigOutput = {
  [key: string]: Env;
};
