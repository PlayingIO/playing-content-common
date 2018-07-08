import fp from 'mostly-func';
import { plural } from 'pluralize';

import isRootFolder from './is-root-folder';

// get parent or root or top workspaces document
export default async function getParentDocument (app, id, data) {
  // get by the parent if provided
  if (data.parent) {
    const svcDocuments = app.service('documents');
    return svcDocuments.get(data.parent);
  }
  // get by id and type
  if (id) {
    const svcDocuments = app.service(plural(data && data.type || 'document'));
    const doc = await svcDocuments.get(id, {
      query: { $select: 'parent,*' }
    });
    return doc && doc.parent;
  }
  // get the root folder or workspaces root
  if (!isRootFolder(data.path)) {
    const svcFolder = app.service('folders');
    if (data.path.startsWith('/workspaces')) {
      return svcFolder.get(null, { query: { path : '/workspaces' } });
    } else {
      return svcFolder.get(null, { query: { path : '/' } });
    }
  }
  return null;
}