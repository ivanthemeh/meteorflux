Package.describe({
  name: 'meteorflux:appstate',
  version: '1.0.0',
  summary: '',
  git: 'https://github.com/meteorflux/meteorflux',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2');
  api.use('meteorflux:namespace');
  api.imply('meteorflux:namespace');
  api.use('ecmascript');
  api.use('check');
  api.use('underscore');
  api.use('tracker');
  api.use('blaze-html-templates');
  api.addFiles('lib/client/appstate.js', 'client');
  api.export('AppState', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('check');
  api.use('tracker');
  api.use('tinytest');
  api.use('blaze-html-templates');
  api.use('mongo');
  api.use('meteorflux:appstate', 'client');

  api.addFiles('tests/client/appstate-tests.js', 'client');
  api.addFiles('tests/client/appstate-tests.html', 'client');
});
