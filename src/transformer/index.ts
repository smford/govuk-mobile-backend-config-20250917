import {ConfigOutput, Platform} from '../types/config-output';
import {ConfigVersionDocument} from '../types/config-version-document';
import merge = require('lodash.merge');

export class Transformer {
  static #PLATFORMS: Platform[] = ['ios', 'android'];

  transform(versionString: string, versionDocument: ConfigVersionDocument) {
    const timestamp = new Date().toISOString();
    const defaultConfig = versionDocument.environments.default;
    const environments = Object.keys(versionDocument.environments).filter(e => e !== 'default');

    const output: ConfigOutput = {};

    environments.forEach(env => {
      const envConfig = versionDocument.environments[env];
      output[env] = {};
      Transformer.#PLATFORMS.forEach((plt: Platform) => {
        output[env][plt] = {
          // set the overall platform property to the env-specific platform, if it exists, or the default
          platform:
            envConfig[plt] && envConfig[plt].platform
              ? envConfig[plt].platform
              : defaultConfig[plt].platform,

          // merge the default and env-specific config objects using lodash.merge; append version string and timestamp
          config: merge({}, defaultConfig[plt], envConfig[plt], {
            version: versionString,
            lastUpdated: timestamp,
          }),
        };
        // delete the platform key from the config object
        delete output[env][plt].config.platform;
      });
    });

    return output;
  }
}
