var testRunner = require('test-runner');

describe('configManager', function() {
  var cm = require('../src/configManager');
  testRunner({testObj:cm},'helperFunctionTests','apiTest');
});
