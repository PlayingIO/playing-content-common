const { plural } = require('pluralize');

/**
 * Move documents
 */
module.exports = async function moveDocument (app, doc) {
  const svcService = app.service(plural(doc.type || 'document'));
  const data = {
    path: doc.path, // recompute path
    type: doc.type
  };
  return svcService.patch(doc.id, data);
};