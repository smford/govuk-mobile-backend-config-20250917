export const ConfigVersionDocument = {
  VALID: {
    metadata: {
      configVersion: '0.0.1',
    },
    environments: {
      default: {
        android: {
          platform: 'Android',
          available: true,
          minimumVersion: '1.0.0',
          recommendedVersion: '1.0.0',
          releaseFlags: {
            featureOne: true,
            featureTwo: false,
          },
        },
        ios: {
          platform: 'iOS',
          available: true,
          minimumVersion: '1.0.0',
          recommendedVersion: '1.0.0',
          releaseFlags: {
            featureOne: true,
            featureTwo: true,
          },
        },
      },
      integration: {
        ios: {
          platform: 'IOS_INT',
          minimumVersion: '9.9.9',
        },
      },
      production: {
        android: {
          releaseFlags: {
            featureOne: false,
          },
        },
      },
      bananas: {},
      test: {
        ios: {
          available: false,
        },
      },
    },
  },
};
