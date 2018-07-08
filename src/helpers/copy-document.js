import fp from 'mostly-func';
import { plural } from 'pluralize';

/**
 * Copy documents to target
 */
export default async function copyDocument (app, doc, target) {
  const svcService = app.service(plural(doc.type || 'document'));
  let clone = fp.omit([
    'id', 'metadata', 'parent', 'path', 'ancestors',
    'createdAt', 'updatedAt', 'destroyedAt'
  ], doc);
  clone.parent = target;
  return svcService.create(clone);
}