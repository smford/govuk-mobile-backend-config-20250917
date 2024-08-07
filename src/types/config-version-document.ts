interface Metadata {
  configVersion: string;
}

// disabling eslint because these really can be anything
/* eslint-disable */
interface DefaultEnv {
    // in 'default', both these must exist
    ios: any;
    android: any;
}

interface Env {
    // for other envs, they may or may not
    ios?: any;
    android?: any;
}
/* eslint-enable */

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
