# node-statsd-ns

node-statsd-ns wraps `node-statsd` with metric namespacing.

Simply put this module will call the equivelent metric type from `node-statsd` creating a stat name like so:

`env.appname.stat.hostname`

Which will create a metric in statsd:

`.dev.api.airasoul_inc.local_machine`


## Install

```
$ npm install node-statsd-ns --save
```

## Setup

```

const config = {
  host: "statsd.somewhere.com",
  port: "8125",
  prefix: "01010101-01010101-01010101-01010101",
  hostname: 'local.machine',
  app: 'api',
  env: process.env.NODE_ENV || 'dev',
  clean: 'cmd_server'
};

const statsd = require('node-statsd-ns')(config);

statsd.increment('airasoul_inc');

```
