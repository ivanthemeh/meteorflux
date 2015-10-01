Package.describe({
  name: 'meteorflux:dispatcher-blaze-helper',
  version: '1.0.0',
  summary: 'A helper to send Flux actions in Blaze.',
  git: 'https://github.com/meteorflux/meteorflux',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('meteorflux:dispatcher@1.1.0');
  api.addFiles('client/dispatcher-blaze-helper.js', 'client');
});
