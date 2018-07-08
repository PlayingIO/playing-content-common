import path from 'path';
import { plural } from 'pluralize';

/**
 * Move documents to target
 */
export default async function moveDocument (app, doc, target) {
  const svcService = app.service(plural(doc.type || 'document'));
  const data = {
    path: path.resolve(target, path.basename(doc.path)),
    type: doc.type
  };
  return svcService.patch(doc.id, data);
}