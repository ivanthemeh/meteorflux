Package.describe({
  name: 'meteorflux:dispatcher-helper',
  version: '1.0.0',
  summary: 'A Dispatcher for Meteor, based on the Facebook\'s Dispatcher',
  git: 'https://github.com/meteorflux/meteorflux',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('meteorflux:dispatcher@1.1.0');
  api.addFiles('client/dispatcher-helper.js', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('meteorflux:dispatcher');
});
