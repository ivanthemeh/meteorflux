Package.describe({
  name: 'meteorflux:dispatcher',
  version: '1.1.0',
  summary: 'A Flux Dispatcher for Meteor, based on the Facebook\'s Dispatcher',
  git: 'https://github.com/meteorflux/meteorflux',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('meteorflux:namespace');
  api.imply('meteorflux:namespace');
  api.addFiles('lib/dispatcher.js');
  api.export('Dispatcher');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('blaze-html-templates');
  api.use('meteorflux:dispatcher');
  api.addFiles('tests/dispatcher-tests.js');
});
