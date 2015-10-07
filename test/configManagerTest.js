var testRunner = require('test-runner');

describe('configManager', function() {
  var cm = require('../src/configManager');
  testRunner({testObj:cm},'fileLoadingTest.js','helperFunctionTests','apiTest');
});
