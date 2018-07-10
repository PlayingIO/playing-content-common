const fp = require('mostly-func');
const { iff, isProvider } = require('feathers-hooks-common');
const { hooks } = require('mostly-feathers-mongoose');

module.exports = function addMetadata (key, values) {
  return iff(isProvider('external'), hooks.mapHookData(item => {
    if (item) {
      item.metadata = item.metadata || {};
      if (Array.isArray(values)) {
        item.metadata[key] = fp.concat(item.metadata[key] || [], values);
      } else {
        item.metadata[key] = fp.merge((item.metadata[key] || {}), values);
      }
    }
    return item;
  }));
};