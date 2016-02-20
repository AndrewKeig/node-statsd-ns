'use strict';

const StatsD = require('node-statsd');

let client;

module.exports =  (cfg) => {

  const init = () => {

    if (client) {

      return client;
    }

    client = new StatsD({ host: cfg.host, port: cfg.port, prefix: cfg.prefix});

    return client;
  }

  const clean = (stat) => {
    stat = stat.replace(cfg.clean, '')
    stat = stat.replace('._', '.');
    stat = stat.replace('__.', '.');
    stat = stat.replace('_.', '.');
    return stat.replace(/\W+/g, '.').toLowerCase();
  }

  const underscore = (stat) => {

    return stat.replace(/\W+/g, '_');
  }

  const key = (stat) => {

    return clean(`.${env}.${app}.${underscore(stat)}.${hostname}`);
  }

  let currentKey = '';
  let env = underscore(cfg.env);
  let app = underscore(cfg.app);
  let hostname = underscore(cfg.hostname);

  init();

  return {

    key: (stat, value) => {

      return currentKey;
    },

    timing: (stat, value) => {

      currentKey = key(stat);
      client.increment(key(stat), value);
    },

    increment: (stat) => {

      currentKey = key(stat);
      client.increment(key(stat));
    },

    decrement: (stat) => {

      currentKey = key(stat);
      client.decrement(key(stat));
    },

    histogram: (stat, value) => {

      currentKey = key(stat);
      client.histogram(key(stat), value);
    },

    gauge: (stat, value) => {

      currentKey = key(stat);
      client.gauge(key(stat), value);
    },

    unique: (stat, value) => {

      currentKey = key(stat);
      client.unique(key(stat), value);
    },

    set: (stat, value) => {

      currentKey = key(stat);
      client.set(key(stat), value);
    }
  }
};
