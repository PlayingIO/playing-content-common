const fp = require('mostly-func');

module.exports = function isRootFolder (path) {
  return fp.contains(path, ['/', '/workspaces']);
};