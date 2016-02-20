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

  const metric = (stat) => {

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

      currentKey = metric(stat);
      client.increment(currentKey, value);
    },

    increment: (stat) => {

      currentKey = metric(stat);
      client.increment(currentKey);
    },

    decrement: (stat) => {

      currentKey = metric(stat);
      client.decrement(currentKey);
    },

    histogram: (stat, value) => {

      currentKey = metric(stat);
      client.histogram(currentKey, value);
    },

    gauge: (stat, value) => {

      currentKey = metric(stat);
      client.gauge(currentKey, value);
    },

    unique: (stat, value) => {

      currentKey = metric(stat);
      client.unique(currentKey, value);
    },

    set: (stat, value) => {

      currentKey = metric(stat);
      client.set(currentKey, value);
    }
  }
};
