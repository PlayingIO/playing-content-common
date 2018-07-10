const assert = require('assert');
const makeDebug = require('debug');
const fp = require('mostly-func');

const getParentDocument = require('../helpers/get-parent-document');
const isRootFolder = require('../helpers/is-root-folder');

const debug = makeDebug('playing:content-common:hooks:computeAncestors');

// compute ancestors of current document
module.exports = function computeAncestors () {
  return async context => {
    assert(context.type === 'before', `computeAncestors must be used as a 'before' hook.`);

    // skip update/patch if not changing either parent or path
    if (context.method === 'update' || context.method === 'patch') {
      if (!(context.data.parent || context.data.path)) return context;
    }

    // get parent or root document
    const parent = await getParentDocument(context.app, context.id, context.data);
    if (parent && parent.ancestors) {
      // join the parent ancestors typed id (against parent changing)
      const typedId = (parent.type || 'document') + ':' + parent.id;
      context.data.ancestors = fp.concat(parent.ancestors, [typedId]);
    } else {
      if (!isRootFolder(context.data.path)) {
        debug('Parent ancestors is undefined or not exists', parent);
        throw new Error('Parent ancestors is undefined or not exists');
      }
    }
    return context;
  };
};