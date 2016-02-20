const assert = require('assert');

const config = {
  host: "statsd.hostedgraphite.com",
  port: "8125",
  prefix: "958d43fb-9672-49d6-8d0b-f2aeb1bcaa8c",
  hostname: 'local.machine',
  app: 'api',
  env: process.env.NODE_ENV || 'dev',
  clean: 'cmd_server'
};

const statsd = require('./')(config);

describe('statsd namespacing', function () {

  it("should parse simple", function(){

    const expected = '.dev.api.airasoul_inc.local_machine';

    statsd.increment('airasoul_inc');

    assert.equal(statsd.key(), expected);
  });

  it("should parse and then replace a string", function(){

    const expected = '.dev.api.airasoul_inc.local_machine';

    statsd.increment('airasoul_inc.cmd.server');

    assert.equal(statsd.key(), expected);
  });

  it("should parse and remove unwanted chars", function(){

    const expected = '.dev.api.airasoul_inc.local_machine';

    statsd.increment('£#airasoul_inc:cmd.server?/');

    assert.equal(statsd.key(), expected);

  });

});
