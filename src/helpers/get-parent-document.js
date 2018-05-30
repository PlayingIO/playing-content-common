import fp from 'mostly-func';
import { plural } from 'pluralize';

import isRootFolder from './is-root-folder';

// get parent or root or top workspaces document
export default async function getParentDocument (app, id, doc) {
  // get by the parent if provided
  if (doc.parent) {
    const svcDocuments = app.service('documents');
    return svcDocuments.get(doc.parent);
  }
  // get by id and type
  if (id) {
    const svcDocuments = app.service(plural(doc && doc.type || 'document'));
    return svcDocuments.get(id, {
      query: { $select: 'parent,*' }
    }).then(doc => doc && doc.parent);
  }
  // get the root folder or workspaces root
  if (!isRootFolder(doc.path)) {
    const svcFolder = app.service('folders');
    if (doc.path.startsWith('/workspaces')) {
      return svcFolder.get(null, { query: { path : '/workspaces' } });
    } else {
      return svcFolder.get(null, { query: { path : '/' } });
    }
  }
  return null;
}