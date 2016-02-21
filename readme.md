# node-statsd-ns

node-statsd-ns wraps `node-statsd` with metric namespacing `env.appname.stat.hostname`.


## Install

```
$ npm install node-statsd-ns --save
```

## Setup


This module will call the equivelent metric type from `node-statsd` creating a stat name like so, based on the below config and options.

`.dev.api.airasoul_inc.local_machine`

When no options are provided we get:

`.dev.app.airasoul_inc.localhost`


```
const config = {
  host: "statsd.somewhere.com",
  port: "8125",
  prefix: "01010101-01010101-01010101-01010101"
};

const options = {
  hostname: 'local.machine',
  app: 'api',
  env: process.env.NODE_ENV || 'dev',
  clean: 'cmd_server'
};

const statsd = require('node-statsd-ns')(config, options);

statsd.increment('airasoul_inc');

```
