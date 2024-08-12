import {ConfigOutput, Platform} from '../types/config-output';
import {ConfigVersionDocument} from '../types/config-version-document';
import {DefaultEnv} from '../types/config-version-document';
import {Env} from '../types/environment';
import mergeObjects = require('lodash.merge');

export abstract class Transformer {
  abstract transform(versionDocument: ConfigVersionDocument): ConfigOutput;
}

export class ConfigTransformer extends Transformer {
  static #PLATFORMS: Platform[] = ['ios', 'android'];

  transform(versionDocument: ConfigVersionDocument) {
    const timestamp = new Date().toISOString();
    const defaultConfig = versionDocument.environments.default;
    const environments = Object.keys(versionDocument.environments).filter(e => e !== 'default');

    const output: ConfigOutput = {};

    environments.forEach(env => {
      const envConfig = versionDocument.environments[env];
      output[env] = {};
      ConfigTransformer.#PLATFORMS.forEach((plt: Platform) => {
        output[env][plt] = {
          platform: findPlatformOrDefault(defaultConfig, envConfig, plt),
          config: mergeObjects({}, defaultConfig[plt], envConfig[plt], {
            version: versionDocument.metadata.configVersion,
            lastUpdated: timestamp,
          }),
        };

        // `platform` sits at the top level not in the config sub-object
        delete output[env][plt].config.platform;
      });
    });

    function findPlatformOrDefault(
      defaultConfig: DefaultEnv,
      envConfig: Env,
      platform: Platform
    ): string {
      return envConfig[platform] && envConfig[platform].platform
        ? envConfig[platform].platform
        : defaultConfig[platform].platform;
    }

    return output;
  }
}
