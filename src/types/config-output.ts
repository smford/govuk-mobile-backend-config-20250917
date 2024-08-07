export type Platform = 'ios' | 'android';

// disabling eslint here because these truly could be any
/* eslint-disable */
export type ConfigOutput = {
    [key: string]: {
        ios?: any;
        android?: any;
    }
}
/* eslint-enable */
