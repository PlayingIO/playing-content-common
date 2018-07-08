import fp from 'mostly-func';
import path from 'path';

import shortname from './shortname';

/**
 * Get children documents
 */
const getChildrens = async (app, documents) => {
  const svcDocuments = app.service('documents');
  const parents = fp.map(fp.prop('id'), documents);
  const children = await svcDocuments.find({
    query: { parent: { $in: parents } },
    paginate: false
  });
  return fp.groupBy(fp.prop('parent'), children);
};

/**
 * Fanout move/copy operation to children documents
 */
export default async function fanoutDocuments (app, documents, operation, targets) {
  const childrens = await getChildrens(app, documents);
  for (let [parent, children] of Object.entries(childrens)) {
    const target = targets[parent];
    if (children.length > 0 && target) {
      // new path
      children = fp.map(doc => fp.assoc('path', path.join(target, shortname(doc.type)), doc), children);
      app.agenda.now('fanout_documents', {
        operation, documents: children
      });
      // process next batch of children
      const childrenTargets = fp.reduce((acc, child) => {
        acc[child.id] = child.path;
        return acc;
      }, {}, children);
      await fanoutDocuments(app, children, operation, childrenTargets);
    }
  }
}