const fp = require('mostly-func');
const { plural } = require('pluralize');

/**
 * Copy documents
 */
module.exports = async function copyDocument (app, doc) {
  const svcService = app.service(plural(doc.type || 'document'));
  let clone = fp.omit([
    'id', 'metadata', 'parent', 'ancestors',
    'createdAt', 'updatedAt', 'destroyedAt'
  ], doc);
  return svcService.create(clone);
};