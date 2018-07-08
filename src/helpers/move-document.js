import path from 'path';
import { plural } from 'pluralize';

/**
 * Move documents
 */
export default async function moveDocument (app, doc) {
  const svcService = app.service(plural(doc.type || 'document'));
  const data = {
    path: doc.path, // recompute path
    type: doc.type
  };
  return svcService.patch(doc.id, data);
}