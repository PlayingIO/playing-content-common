const fp = require('mostly-func');
const path = require('path');
const { plural } = require('pluralize');

const isRootFolder = require('./is-root-folder');

// get parent or root or top workspaces document
module.exports = async function getParentDocument (app, id, data) {
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
  // get by path if provided
  if (data.path) {
    if (isRootFolder(data.path)) {
      return null; // root folder
    } else {
      const svcDocuments = app.service('documents');
      return svcDocuments.action('first').find({
        query: { path: path.dirname(data.path) }
      });
    }
  }
  // default parent is the root folder or workspaces root
  const svcFolder = app.service('folders');
  if (data.path.startsWith('/workspaces')) {
    return svcFolder.get(null, { query: { path : '/workspaces' } });
  } else {
    return svcFolder.get(null, { query: { path : '/' } });
  }
};