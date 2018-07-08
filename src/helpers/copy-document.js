import fp from 'mostly-func';
import path from 'path';
import { plural } from 'pluralize';

import shortname from './shortname';

/**
 * Copy documents to target path
 */
export default async function copyDocument (app, doc, target) {
  const svcService = app.service(plural(doc.type || 'document'));
  let clone = fp.omit([
    'id', 'metadata', 'parent', 'path', 'ancestors',
    'createdAt', 'updatedAt', 'destroyedAt'
  ], doc);
  clone.path = path.join(target, shortname(doc.type));
  return svcService.create(clone);
}