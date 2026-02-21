/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: 'vitest',
  plugins: ['@stryker-mutator/vitest-runner'],
  mutate: ['src/utils/calculator.js'],
  vitest: {
    configFile: 'vite.config.js',
  },
  reporters: ['clear-text', 'progress'],
  thresholds: {
    high: 80,
    low: 60,
    break: null,
  },
  concurrency: 4,
  timeoutMS: 10000,
  disableBail: true,
  clearTextReporter: {
    allowColor: false,
    logTests: false,
  },
}
