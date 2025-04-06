const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push(
            '--disable-password-generation',
            '--disable-save-password-bubble',
            '--disable-features=PasswordManagerOnboarding,PasswordCheck',
            '--guest'
          );
        }
        return launchOptions;
      });
    },
  },
});
