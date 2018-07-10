const assert = require('assert');
const makeDebug = require('debug');
const fp = require('mostly-func');
const path = require('path');

const getParentDocument = require('../helpers/get-parent-document');
const isRootFolder = require('../helpers/is-root-folder');
const shortname = require('../helpers/shortname');

const debug = makeDebug('playing:content-common:hooks:computePath');

// compute current path by parent
module.exports = function computePath (options = {}) {
  return async context => {
    assert(context.type === 'before', `computePath must be used as a 'before' hook.`);

    // skip update/patch if not changing either parent or path
    if (context.method === 'update' || context.method === 'patch') {
      if (!(context.data.parent || context.data.path)) return context;
    }

    // get new parent or root document (if creating)
    const parent = await getParentDocument(context.app, null, context.data);
    if (parent && parent.path) {
      context.data.parent = parent.id;
      // generate new type-name or use the existing name
      const type = context.data.type || options.type || 'document';
      const name = shortname(type, context.data.path);
      debug('compute parent path', parent.path, name);
      // join the parent path (against parent changing)
      context.data.path = path.join(parent.path, name);
    } else {
      if (!isRootFolder(context.data.path)) {
        debug('Parent path is undefined or not exists', parent);
        throw new Error('Parent path is undefined or not exists');
      }
    }
    return context;
  };
};