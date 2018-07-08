import fp from 'mostly-func';
import { plural } from 'pluralize';

/**
 * Copy documents
 */
export default async function copyDocument (app, doc) {
  const svcService = app.service(plural(doc.type || 'document'));
  let clone = fp.omit([
    'id', 'metadata', 'parent', 'ancestors',
    'createdAt', 'updatedAt', 'destroyedAt'
  ], doc);
  return svcService.create(clone);
}