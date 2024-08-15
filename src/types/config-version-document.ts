import {Env} from './environment';

interface Metadata {
  configVersion: string;
}

export interface DefaultEnv extends Omit<Env, 'ios' | 'android'> {
  // in 'default', both these must exist
  /* eslint-disable */
    ios: any;
    android: any;
    /* eslint-enable */
}

interface EnvironmentConfigBase {
  default: DefaultEnv;
}

// this sets up a type where the 'default' key is defined, then
// additional arbitrarily-named environments can be added
type EnvironmentConfig = EnvironmentConfigBase & {[key: string]: Env};

export interface ConfigVersionDocument {
  metadata: Metadata;
  environments: EnvironmentConfig;
}

export interface ConfigVersionDocumentBundle {
  versionString: string;
  versionDocument: ConfigVersionDocument;
}
