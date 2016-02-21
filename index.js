'use strict';

const StatsD = require('node-statsd');

let client;

module.exports =  (cfg, options) => {

  options = options || {};
  options.clean = options.clean || '';
  options.app = options.app || 'app';
  options.env = options.env || 'dev';
  options.hostname = options.hostname || 'localhost';

  const init = () => {

    if (client) {

      return client;
    }

    client = new StatsD(cfg);

    return client;
  }

  const clean = (stat) => {
    stat = stat.replace(options.clean, '')
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
  let env = underscore(options.env);
  let app = underscore(options.app);
  let hostname = underscore(options.hostname);

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
