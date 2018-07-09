import assert from 'assert';
import makeDebug from 'debug';
import fp from 'mostly-func';
import path from 'path';

import getParentDocument from '../helpers/get-parent-document';
import isRootFolder from '../helpers/is-root-folder';
import shortname from '../helpers/shortname';

const debug = makeDebug('playing:content-common:hooks:computePath');

// compute current path by parent
export default function computePath (options = {}) {
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
}
